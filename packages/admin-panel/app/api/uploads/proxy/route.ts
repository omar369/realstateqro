import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID;
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY;
const R2_ENDPOINT = process.env.R2_ENDPOINT;
const R2_BUCKET = process.env.R2_BUCKET;
const R2_REGION = process.env.R2_REGION || 'auto';
const R2_PUBLIC_BASE = (process.env.R2_PUBLIC_BASE || '').replace(/\/$/, '');
const FORCE_PATH_STYLE = String(process.env.R2_FORCE_PATH_STYLE || '').toLowerCase() === 'true';

function createR2Client() {
  if (!R2_ACCESS_KEY_ID || !R2_SECRET_ACCESS_KEY || !R2_ENDPOINT || !R2_BUCKET) {
    throw new Error('R2 config missing. Check env: R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_ENDPOINT, R2_BUCKET');
  }
  return new S3Client({
    region: R2_REGION,
    endpoint: R2_ENDPOINT,
    forcePathStyle: FORCE_PATH_STYLE,
    credentials: { accessKeyId: R2_ACCESS_KEY_ID, secretAccessKey: R2_SECRET_ACCESS_KEY },
  });
}

function sanitizeFileName(name: string) {
  const base = name.normalize('NFKD').replace(/[^a-zA-Z0-9_.-]+/g, '-');
  return base.replace(/-+/g, '-').replace(/^[-.]+|[-.]+$/g, '').slice(0, 180) || 'file';
}

function buildKey(filename: string, prefix?: string) {
  const safe = sanitizeFileName(filename);
  const ts = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
  const rand = Math.random().toString(36).slice(2, 8);
  const p = prefix?.replace(/\/+$/, '') || 'uploads';
  return `${p}/${ts}/${rand}-${safe}`;
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const form = await req.formData();
    const file = form.get('file');
    const prefix = form.get('prefix')?.toString();
    const contentTypeOverride = form.get('contentType')?.toString();

    if (!(file instanceof File)) {
      return NextResponse.json({ error: 'Missing file' }, { status: 400 });
    }

    const contentType = contentTypeOverride || (file as any).type || 'application/octet-stream';
    const client = createR2Client();
    const Key = buildKey(file.name, prefix);
    const Bucket = R2_BUCKET!;

    const body = Buffer.from(await file.arrayBuffer());

    await client.send(new PutObjectCommand({ Bucket, Key, Body: body, ContentType: contentType }));

    const publicUrl = R2_PUBLIC_BASE ? `${R2_PUBLIC_BASE}/${Key}` : undefined;
    return NextResponse.json({ key: Key, publicUrl });
  } catch (err: any) {
    console.error('[UPLOAD PROXY] error', err);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}

