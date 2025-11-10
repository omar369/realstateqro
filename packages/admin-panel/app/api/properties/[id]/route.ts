import { NextResponse } from "next/server";
import { db } from "@/db";
import { properties } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { PropertyUpdateSchema } from "@/lib/validators/property";

// GET — obtener una propiedad por ID
export async function GET(req: Request, context: { params: Promise<{ id: string }> }) {
  const { id: rawId } = await context.params; 
  const id = Number(rawId);

  try {
    if (!id || isNaN(id)) {
      return NextResponse.json(
        { success: false, error: "ID inválido" },
        { status: 400 }
      );
    }

    const [property] = await db
      .select()
      .from(properties)
      .where(eq(properties.id, id));

    if (!property) {
      return NextResponse.json(
        { success: false, error: "Propiedad no encontrada" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: property });
  } catch (error) {
    console.error("❌ Error al obtener propiedad:", error);
    return NextResponse.json(
      { success: false, error: "Error al obtener la propiedad" },
      { status: 500 }
    );
  }
}


// PATCH — editar propiedad existente
export async function PATCH(
  req: Request,
  { params }: { params: { id: string } },
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

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
      .where(eq(properties.id, Number(params.id)))
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
  _req: Request,
  { params }: { params: { id: string } },
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const deleted = await db
      .delete(properties)
      .where(eq(properties.id, Number(params.id)))
      .returning();

    if (!deleted.length) {
      return NextResponse.json(
        { success: false, error: "Propiedad no encontrada" },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true, message: "Propiedad eliminada" });
  } catch (error) {
    console.error("❌ Error al eliminar propiedad:", error);
    return NextResponse.json(
      { success: false, error: "Error al eliminar la propiedad" },
      { status: 500 },
    );
  }
}
