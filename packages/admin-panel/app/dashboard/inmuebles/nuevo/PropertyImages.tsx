"use client";

import * as React from "react";
import ImageGallery from "@/components/images/ImageGallery";
import type { ImageItem } from "@/components/images/types";
import { uploadFileViaProxy } from "@/lib/uploads/r2";

type Props = {
  value: ImageItem[];
  onChange: (next: ImageItem[]) => void;
  maxFiles?: number;
  prefix?: string;
};

export default function PropertyImages({ value, onChange, maxFiles = 20, prefix = "inmuebles" }: Props) {
  const [error, setError] = React.useState<string | null>(null);
  const valueRef = React.useRef(value);
  React.useEffect(() => { valueRef.current = value; }, [value]);

  const handleFilesAdded = React.useCallback(
    (files: File[]) => {
      setError(null);
      if (!files?.length) { return; }

      const remaining = Math.max(0, maxFiles - value.length);
      
      if (remaining <= 0) {
        setError(`Límite alcanzado: máximo ${maxFiles} imágenes`);
        return;
      }

      const unique = dedupeByNameSize(files).slice(0, remaining);
      const { accepted, rejected } = splitAcceptedRejected(unique);
      
      if (rejected.length) setError(rejected[0].reason);

      const toAdd: ImageItem[] = accepted.map((file, idx) => ({
        id: (globalThis as any).crypto?.randomUUID?.() ?? `${Date.now()}-${idx}`,
        file,
        previewUrl: URL.createObjectURL(file),
        contentType: file.type,
        size: file.size,
        order: value.length + idx,
        status: "pending",
      }));

      const next = [...value, ...toAdd];
      onChange(next);
      // Ensure ref reflects the new list before starting uploads
      valueRef.current = next;
      const newIds = toAdd.map(t => t.id);
      void uploadPendingIds(newIds, () => valueRef.current, onChange, prefix);
    },
    [maxFiles, onChange, value]
  );

  const handleItemsChange = React.useCallback(
    (next: ImageItem[]) => {
      onChange(next);
    },
    [onChange]
  );

  return (
    <section className="space-y-2">
      <h3 className="text-base font-medium">Imágenes</h3>
      <p className="text-sm text-muted-foreground">Arrastra o selecciona imágenes. Reordena con drag-and-drop.</p>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <ImageGallery
        items={value}
        onItemsChange={handleItemsChange}
        onFilesAdded={handleFilesAdded}
        accept={{ "image/*": [] }}
        maxFiles={maxFiles}
      />
    </section>
  );
}

type RejectedFile = { file: File; reason: string };

function dedupeByNameSize(files: File[]): File[] {
  const seen = new Set<string>();
  const out: File[] = [];
  for (const f of files) {
    const key = `${f.name}-${f.size}`;
    if (!seen.has(key)) {
      seen.add(key);
      out.push(f);
    }
  }
  return out;
}

function splitAcceptedRejected(
  files: File[],
  opts?: { allowedMimes?: readonly string[]; maxSize?: number }
): { accepted: File[]; rejected: RejectedFile[] } {
  const allowedMimes = (opts?.allowedMimes ?? [
    "image/jpeg",
    "image/png",
    "image/webp",
  ]) as readonly string[];
  const maxSize = opts?.maxSize ?? 10 * 1024 * 1024;

  const accepted: File[] = [];
  const rejected: RejectedFile[] = [];

  for (const file of files) {
    if (!isAllowedType(file, allowedMimes)) {
      rejected.push({ file, reason: "Tipo de archivo no permitido" });
      continue;
    }
    if (file.size > maxSize) {
      rejected.push({ file, reason: `Excede el tamaño máximo (${Math.round(maxSize / (1024 * 1024))}MB)` });
      continue;
    }
    accepted.push(file);
  }
  return { accepted, rejected };
}

function isAllowedType(file: File, allowedMimes: readonly string[]): boolean {
  if (file.type && allowedMimes.includes(file.type)) return true;
  const name = file.name?.toLowerCase?.() || "";
  return [".jpg", ".jpeg", ".png", ".webp"].some((ext) => name.endsWith(ext));
}

async function uploadPendingIds(
  ids: string[],
  getItems: () => ImageItem[],
  setItems: (next: ImageItem[]) => void,
  prefix: string
) {
  const doOne = async (id: string) => {
    const items = getItems();
    const idx = items.findIndex((i) => i.id === id);
    if (idx < 0) { return; }
    const item = items[idx];
    if (!item.file) return;
    

    const startUploading = [...items];
    startUploading[idx] = { ...item, status: 'uploading' };
    setItems(startUploading);

    try {
      const { key, publicUrl } = await uploadFileViaProxy(item.file, { prefix });
      
      const done = getItems();
      const j = done.findIndex((i) => i.id === id);
      if (j < 0) return;
      const after = [...done];
      after[j] = { ...done[j], key, publicUrl, status: 'uploaded' };
      setItems(after);
    } catch (e: any) {
      
      const fail = getItems();
      const j = fail.findIndex((i) => i.id === id);
      if (j < 0) return;
      const after = [...fail];
      after[j] = { ...fail[j], status: 'error', error: e?.message || 'Error al subir' };
      setItems(after);
    }
  };

  // small concurrency to reduce presign expiry pressure
  const limit = Math.min(2, Math.max(1, ids.length));
  let cursor = 0;
  const workers = Array.from({ length: limit }, async () => {
    while (cursor < ids.length) {
      const id = ids[cursor++];
      // eslint-disable-next-line no-await-in-loop
      await doOne(id);
    }
  });
  await Promise.all(workers);
}

function useStableRef<T>(value: T) {
  const ref = React.useRef(value);
  ref.current = value;
  return ref;
}
