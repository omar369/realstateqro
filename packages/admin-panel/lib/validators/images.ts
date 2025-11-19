import {z} from 'zod'

 export const IMAGE_ALLOWED_MIME = ['image/jpeg', 'image/png', 'image/webp'] as const;
  export const IMAGE_ALLOWED_EXTS = ['.jpg', '.jpeg', '.png', '.webp'] as const;

  export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
  export const MAX_FILES = 20;

  export type RejectedFile = { file: File; reason: string };

  export const ImagePayloadSchema = z.object({
    key: z.string().min(1),
    publicUrl: z.string().url().optional().nullable(),
    order: z.number().int().min(0),
  });
  export type ImagePayload = z.infer<typeof ImagePayloadSchema>;

  export function isAllowedType(file: File, allowedMimes = IMAGE_ALLOWED_MIME): boolean {
    if (file.type && allowedMimes.includes(file.type as typeof IMAGE_ALLOWED_MIME[number])) {
      return true;
    }
    // Fallback por extensión si type viene vacío/incompleto
    const name = file.name?.toLowerCase?.() || '';
    return IMAGE_ALLOWED_EXTS.some((ext) => name.endsWith(ext));
  }

  export function isWithinSizeLimit(file: File, maxSize = MAX_FILE_SIZE): boolean {
    return file.size <= maxSize;
  }

  export function validateCount(existingCount: number, incomingCount: number, max = MAX_FILES) {
    const remaining = Math.max(0, max - existingCount);
    const allowed = Math.min(remaining, incomingCount);
    const ok = allowed > 0;
    return {
      ok,
      allowed,
      remaining,
      reason: ok ? undefined : `Límite alcanzado: máximo ${max} imágenes`,
    };
  }

  export function dedupeByNameSize(files: File[]): File[] {
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

  export function splitAcceptedRejected(
    files: File[],
    opts?: { allowedMimes?: readonly string[]; maxSize?: number }
  ): { accepted: File[]; rejected: RejectedFile[] } {
    const allowedMimes = (opts?.allowedMimes ?? IMAGE_ALLOWED_MIME) as readonly string[];
    const maxSize = opts?.maxSize ?? MAX_FILE_SIZE;

    const accepted: File[] = [];
    const rejected: RejectedFile[] = [];

    for (const file of files) {
      if (!isAllowedType(file, allowedMimes)) {
        rejected.push({ file, reason: 'Tipo de archivo no permitido' });
        continue;
      }
      if (!isWithinSizeLimit(file, maxSize)) {
        rejected.push({ file, reason: `Excede el tamaño máximo (${Math.round(maxSize / (1024 * 1024))}MB)` });
        continue;
      }
      accepted.push(file);
    }
    return { accepted, rejected };
  }
