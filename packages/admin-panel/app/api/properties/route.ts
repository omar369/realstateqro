import { NextResponse } from "next/server";
import { db } from "@/db";
import { properties } from "@/db/schema";
import { PropertyCreateSchema } from "@/lib/validators/property";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

// GET 
export async function GET() {
  try {
    const allProperties = await db.select().from(properties);
    return NextResponse.json({ success: true, data: allProperties });
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

    const body = await req.json();
    const parsed = PropertyCreateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const newProperty = await db.insert(properties).values(parsed.data).returning();

    return NextResponse.json({ success: true, data: newProperty[0] });
  } catch (error) {
    console.error("❌ Error al crear propiedad:", error);
    return NextResponse.json(
      { success: false, error: "No se pudo crear la propiedad" },
      { status: 500 }
    );
  }
}

