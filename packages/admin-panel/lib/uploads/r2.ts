export type PresignRequest = {
  filename: string;
  contentType: string;
  prefix?: string;
};

export type PresignResponse = {
  key: string;
  uploadUrl: string;
  publicUrl?: string;
};

export async function presignUpload(req: PresignRequest): Promise<PresignResponse> {
  const res = await fetch('/api/uploads/presign', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(req),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(text || 'Failed to presign');
  }
  return res.json();
}

export async function uploadViaPresignedPut(uploadUrl: string, file: File | Blob, contentType?: string): Promise<void> {
  const res = await fetch(uploadUrl, {
    method: 'PUT',
    headers: contentType ? { 'Content-Type': contentType } : undefined,
    body: file,
  });
  if (!res.ok) {
    throw new Error('Upload failed');
  }
}

export async function uploadFileToR2(file: File, opts?: { prefix?: string }): Promise<{ key: string; publicUrl?: string }> {
  const presigned = await presignUpload({ filename: file.name, contentType: file.type, prefix: opts?.prefix });
  await uploadViaPresignedPut(presigned.uploadUrl, file, file.type);
  return { key: presigned.key, publicUrl: presigned.publicUrl };
}

export async function uploadFileViaProxy(file: File, opts?: { prefix?: string }): Promise<{ key: string; publicUrl?: string }> {
  const fd = new FormData();
  fd.append('file', file);
  if (opts?.prefix) fd.append('prefix', opts.prefix);
  if (file.type) fd.append('contentType', file.type);

  const res = await fetch('/api/uploads/proxy', { method: 'POST', body: fd });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(text || 'Proxy upload failed');
  }
  return res.json();
}
