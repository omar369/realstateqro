import { NextResponse, type NextRequest } from "next/server";
import { db } from "@/db";
import { properties, propertyImages } from "@/db/schema";
import { asc, eq } from "drizzle-orm";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { PropertyUpdateSchema } from "@/lib/validators/property";
import { S3Client, DeleteObjectsCommand } from "@aws-sdk/client-s3";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function normalizeKey(raw: string): string {
  const base = (process.env.R2_PUBLIC_BASE || "").replace(/\/$/, "");
  const bucket = process.env.R2_BUCKET || "";

  let k = raw.trim();

  if (/^https?:\/\//i.test(k)) {
    try {
      const u = new URL(k);
      k = u.pathname;
    } catch { }
  }

  k = k.replace(/^\/+/, "");

  if (bucket && k.startsWith(bucket + "/")) {
    k = k.slice(bucket.length + 1);
  }

  const pathBase = base
    ? new URL(base, "http://x").pathname.replace(/^\/+/, "")
    : "";
  if (pathBase && k.startsWith(pathBase + "/")) {
    k = k.slice(pathBase.length + 1);
  }

  return k;
}

// GET — obtener una propiedad por ID
export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const { id: rawId } = await context.params;
  const id = Number(rawId);

  try {
    if (!id || isNaN(id)) {
      return NextResponse.json(
        { success: false, error: "ID inválido" },
        { status: 400 },
      );
    }

    const [property] = await db
      .select()
      .from(properties)
      .where(eq(properties.id, id));

    if (!property) {
      return NextResponse.json(
        { success: false, error: "Propiedad no encontrada" },
        { status: 404 },
      );
    }

    const images = await db
      .select()
      .from(propertyImages)
      .where(eq(propertyImages.propertyId, id))
      .orderBy(asc(propertyImages.position));

    return NextResponse.json({ success: true, data: { ...property, images } });
  } catch (error) {
    console.error("❌ Error al obtener propiedad:", error);
    return NextResponse.json(
      { success: false, error: "Error al obtener la propiedad" },
      { status: 500 },
    );
  }
}

// PATCH — editar propiedad existente
export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await context.params;
    const body = await req.json();
    const parsed = PropertyUpdateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const updated = await db
      .update(properties)
      .set({ ...parsed.data, updatedAt: new Date().toISOString() })
      .where(eq(properties.id, Number(id)))
      .returning();

    if (!updated.length) {
      return NextResponse.json(
        { success: false, error: "Propiedad no encontrada" },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true, data: updated[0] });
  } catch (error) {
    console.error("❌ Error al actualizar propiedad:", error);
    return NextResponse.json(
      { success: false, error: "Error al actualizar la propiedad" },
      { status: 500 },
    );
  }
}

// DELETE — eliminar propiedad
export async function DELETE(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  class R2DeleteError extends Error {}

  try {
    const session = await getServerSession(authOptions);
    if (!session)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id: idRaw } = await context.params;
    const id = Number.parseInt(String(idRaw).trim(), 10);
    if (!Number.isInteger(id) || id <= 0) {
      return NextResponse.json(
        { success: false, error: "ID inválido" },
        { status: 400 },
      );
    }

    const [property] = await db
      .select()
      .from(properties)
      .where(eq(properties.id, id));
    if (!property) {
      return NextResponse.json(
        { success: false, error: "Propiedad no encontrada" },
        { status: 404 },
      );
    }

    // Borrar imágenes en R2
    const imgs = await db
      .select({ key: propertyImages.key })
      .from(propertyImages)
      .where(eq(propertyImages.propertyId, id));

    if (imgs.length) {
      const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID;
      const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY;
      const R2_ENDPOINT = process.env.R2_ENDPOINT;
      const R2_BUCKET = process.env.R2_BUCKET;
      const R2_REGION = process.env.R2_REGION || "auto";
      const FORCE_PATH_STYLE =
        String(process.env.R2_FORCE_PATH_STYLE || "").toLowerCase() === "true";

      if (
        !R2_ACCESS_KEY_ID ||
        !R2_SECRET_ACCESS_KEY ||
        !R2_ENDPOINT ||
        !R2_BUCKET
      ) {
        throw new R2DeleteError("R2 config missing");
      }

      const s3 = new S3Client({
        region: R2_REGION,
        endpoint: R2_ENDPOINT,
        forcePathStyle: FORCE_PATH_STYLE,
        credentials: {
          accessKeyId: R2_ACCESS_KEY_ID,
          secretAccessKey: R2_SECRET_ACCESS_KEY,
        },
      });

      const Objects = imgs.map(({ key }) => ({ Key: normalizeKey(key) }));
      const res = await s3.send(
        new DeleteObjectsCommand({
          Bucket: R2_BUCKET,
          Delete: { Objects, Quiet: true },
        }),
      );
      const errors = (res as any)?.Errors as Array<any> | undefined;
      if (errors && errors.length) {
        throw new R2DeleteError("Some R2 deletions failed");
      }
    }

    // Borrar propiedad en DB
    const deleted = await db
      .delete(properties)
      .where(eq(properties.id, id))
      .returning();

    if (!deleted.length) {
      return NextResponse.json(
        { success: false, error: "Propiedad no encontrada" },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true, message: "Propiedad eliminada" });
  } catch (e: any) {
    if (e instanceof R2DeleteError) {
      console.error("[R2 DELETE] error", e);
      return NextResponse.json(
        { success: false, error: "Error al eliminar imágenes en R2" },
        { status: 500 },
      );
    }
    console.error("⚠️ Error al eliminar propiedad:", e);
    return NextResponse.json(
      { success: false, error: "Error al eliminar la propiedad" },
      { status: 500 },
    );
  }
}
