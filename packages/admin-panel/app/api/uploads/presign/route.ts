import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

// Ensure Node.js runtime (AWS SDK v3 requires Node, not Edge runtime)
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const R2_ACCOUNT_ID = process.env.R2_ACCOUNT_ID;
const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID;
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY;
const R2_BUCKET = process.env.R2_BUCKET;
const R2_ENDPOINT = process.env.R2_ENDPOINT;
const R2_REGION = process.env.R2_REGION || 'auto';
const R2_PUBLIC_BASE = (process.env.R2_PUBLIC_BASE || '').replace(/\/$/, '');
const FORCE_PATH_STYLE = String(process.env.R2_FORCE_PATH_STYLE || '').toLowerCase() === 'true';

const ALLOWED_MIME = new Set(['image/jpeg', 'image/png', 'image/webp']);

function createR2Client() {
  if (!R2_ACCESS_KEY_ID || !R2_SECRET_ACCESS_KEY || !R2_ENDPOINT || !R2_BUCKET) {
    throw new Error('R2 config missing. Check env: R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_ENDPOINT, R2_BUCKET');
  }
  return new S3Client({
    region: R2_REGION,
    endpoint: R2_ENDPOINT,
    forcePathStyle: FORCE_PATH_STYLE,
    credentials: {
      accessKeyId: R2_ACCESS_KEY_ID,
      secretAccessKey: R2_SECRET_ACCESS_KEY,
    },
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
  const p = prefix?.replace(/\/+$/,'') || 'uploads';
  return `${p}/${ts}/${rand}-${safe}`;
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json().catch(() => null);
    if (!body || typeof body !== 'object') {
      return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
    }

    const filename = String((body as any).filename || '').trim();
    const contentType = String((body as any).contentType || '').trim();
    const prefix = (body as any).prefix ? String((body as any).prefix) : undefined;

    if (!filename || !contentType) {
      return NextResponse.json({ error: 'filename and contentType are required' }, { status: 400 });
    }
    if (!ALLOWED_MIME.has(contentType)) {
      return NextResponse.json({ error: 'Unsupported contentType' }, { status: 400 });
    }

    const client = createR2Client();
    const Key = buildKey(filename, prefix);
    const Bucket = R2_BUCKET!;

    const command = new PutObjectCommand({ Bucket, Key, ContentType: contentType });
    const uploadUrl = await getSignedUrl(client, command, { expiresIn: 300 }); // 5 min

    const base = R2_PUBLIC_BASE;
    const publicUrl = base ? `${base}/${Key}` : '';
    return NextResponse.json({ key: Key, uploadUrl, publicUrl });
  } catch (err: any) {
    console.error('[PRESIGN] error', err);
    return NextResponse.json({ error: 'Failed to create presigned URL' }, { status: 500 });
  }
}
