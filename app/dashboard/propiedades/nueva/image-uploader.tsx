"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Uploaded = { key: string; publicUrl: string };

export default function ImageUploader({
  onChange,
}: { onChange: (urls: string[]) => void }) {
  const [files, setFiles] = useState<File[]>([]);
  const [uploaded, setUploaded] = useState<Uploaded[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);

  const handlePick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const list = Array.from(e.target.files ?? []);
    setFiles(list);
  };

  const upload = async () => {
    if (files.length === 0) return;
    setBusy(true);
    try {
      const items = files.map((f, i) => ({
        key: `properties/${Date.now()}-${i}-${f.name}`,
        contentType: f.type || "image/jpeg",
      }));

      // 1) pide URLs firmadas
      const presignRes = await fetch("/api/uploads/presign", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-token": process.env.NEXT_PUBLIC_ADMIN_TOKEN ?? "",
        },
        body: JSON.stringify({ files: items }),
      });
      const presigned = (await presignRes.json()).data as {
        key: string; uploadUrl: string; publicUrl: string;
      }[];

      // 2) sube cada archivo con PUT al uploadUrl
      await Promise.all(
        presigned.map(async (p, idx) => {
          const f = files[idx];
          const put = await fetch(p.uploadUrl, { method: "PUT", body: f });
          if (!put.ok) throw new Error("upload failed");
          return p;
        })
      );

      setUploaded(presigned.map(p => ({ key: p.key, publicUrl: p.publicUrl })));
      onChange(presigned.map(p => p.publicUrl));
    } catch (e: any) {
      alert(e.message ?? "error subiendo imágenes");
    } finally {
      setBusy(false);
    }
  };

  const removeOne = (url: string) => {
    const next = uploaded.filter(u => u.publicUrl !== url);
    setUploaded(next);
    onChange(next.map(n => n.publicUrl));
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png"
          multiple
          onChange={handlePick}
        />
        <Button type="button" onClick={upload} disabled={busy || files.length===0}>
          {busy ? "Subiendo..." : "Subir"}
        </Button>
      </div>

      {uploaded.length > 0 && (
        <div className="grid grid-cols-3 gap-3">
          {uploaded.map((u) => (
            <div key={u.publicUrl} className="relative">
              <Image
                src={u.publicUrl}
                alt=""
                width={200}
                height={150}
                className="rounded-md object-cover w-full h-[120px]"
              />
              <button
                type="button"
                onClick={() => removeOne(u.publicUrl)}
                className="absolute top-1 right-1 text-xs bg-black/60 text-white px-2 py-1 rounded"
              >
                Quitar
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
