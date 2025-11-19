import { NextResponse } from "next/server";
import { db } from "@/db";
import { properties, propertyImages } from "@/db/schema";
import { PropertyCreateSchema } from "@/lib/validators/property";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { eq } from "drizzle-orm";
import { inArray, asc } from "drizzle-orm";

// GET 
export async function GET() {
  try {
    const allProperties = await db.select().from(properties);
    let dataWithThumb: any[] = allProperties as any[];
    if (allProperties.length) {
      const ids = allProperties.map((p) => p.id);
      const imgs = await db
        .select()
        .from(propertyImages)
        .where(inArray(propertyImages.propertyId, ids))
        .orderBy(asc(propertyImages.propertyId), asc(propertyImages.position));

      const firstByProp = new Map<number, string>();
      for (const img of imgs as any[]) {
        const pid = (img as any).propertyId as number;
        if (!firstByProp.has(pid)) firstByProp.set(pid, (img as any).url as string);
      }

      dataWithThumb = allProperties.map((p) => ({
        ...p,
        firstImageUrl: firstByProp.get(p.id) ?? null,
      }));
    }
    return NextResponse.json({ success: true, data: dataWithThumb });
  } catch (error) {
    console.error("❌ Error al obtener propiedades:", error);
    return NextResponse.json(
      { success: false, error: "No se pudieron obtener las propiedades" },
      { status: 500 }
    );
  }
}

// POST 
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // start
    const body = await req.json();
    // no-op
    const parsed = PropertyCreateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { images, ...rest } = parsed.data as any;
    

    // Without transactions in neon-http, do sequential insert + manual cleanup on failure
    const inserted = await db
      .insert(properties)
      .values({ ...rest })
      .returning();

    const prop = inserted[0];
    

    if (images?.length) {
      try {
        const BASE = (process.env.R2_PUBLIC_BASE || "").replace(/\/$/, "");
        const ENDPOINT = (process.env.R2_ENDPOINT || "").replace(/\/$/, "");
        const BUCKET = process.env.R2_BUCKET || "";
        const deriveUrl = (key: string, publicUrl?: string | null) => {
          if (publicUrl) return publicUrl;
          if (BASE) return `${BASE}/${key}`;
          if (ENDPOINT && BUCKET) return `${ENDPOINT}/${BUCKET}/${key}`;
          return `/${key}`;
        };

        await db.insert(propertyImages).values(
          images.map((img: any, idx: number) => ({
            propertyId: prop.id,
            key: img.key,
            url: deriveUrl(img.key, img.publicUrl),
            position: typeof img.order === "number" ? img.order : idx,
          }))
        );
        
      } catch (e) {
        console.error('[PROPERTIES POST] images insert failed, rolling back property', e);
        await db.delete(properties).where(eq(properties.id, prop.id));
        throw e;
      }
    }
    return NextResponse.json({ success: true, data: prop });
  } catch (error) {
    console.error("❌ Error al crear propiedad:", error);
    return NextResponse.json(
      { success: false, error: "No se pudo crear la propiedad" },
      { status: 500 }
    );
  }
}

