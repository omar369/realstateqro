import { NextRequest, NextResponse } from "next/server";
import { db } from "@/server/db";
import { properties } from "@/server/db/schema";
import { and, desc, eq, ilike, gte, lte, sql } from "drizzle-orm";
import { z } from "zod";

// --- Zod (ajustado a tu modelo)
const detallesSchema = z.object({
  estadoConservacion: z.string(),
  balcon: z.number().int(),
  elevador: z.number().int(),
  bodega: z.number().int(),
  nivelesConstruidos: z.number().int(),
  estanciaMinima: z.number().int(),
  disponibilidad: z.string(),
});

const createSchema = z.object({
  titulo: z.string().min(3),
  direccion: z.string().min(3),
  tipoPropiedad: z.string().min(2),
  tipoOperacion: z.string().min(2), // venta|renta
  precio: z.number().int().positive(),
  habitaciones: z.number().int().min(0),
  banos: z.number().int().min(0),
  estacionamientos: z.number().int().min(0),
  metros: z.number().int().min(0),
  antiguedad: z.number().int().min(0),
  descripcion: z.string().min(5),
  imagenes: z.array(z.string().url()).min(1),
  fecha: z.string().regex(/^\d{4}-\d{2}-\d{2}$/), // YYYY-MM-DD
  ambientes: z.array(z.string()).default([]),
  servicios: z.array(z.string()).default([]),
  amenidades: z.array(z.string()).default([]),
  exteriores: z.array(z.string()).default([]),
  extras: z.array(z.string()).default([]),
  detalles: detallesSchema,
});

const listQuery = z.object({
  page: z.coerce.number().int().min(1).default(1),
  perPage: z.coerce.number().int().min(1).max(50).default(12),
  q: z.string().optional(),
  tipoPropiedad: z.string().optional(),
  tipoOperacion: z.string().optional(),
  minPrecio: z.coerce.number().int().optional(),
  maxPrecio: z.coerce.number().int().optional(),
});

export const dynamic = "force-dynamic";
export const runtime = "edge";

// GET /api/inmuebles
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const parsed = listQuery.safeParse(Object.fromEntries(searchParams));
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const { page, perPage, q, tipoPropiedad, tipoOperacion, minPrecio, maxPrecio } = parsed.data;

  const where = [
    q ? ilike(properties.titulo, `%${q}%`) : undefined,
    tipoPropiedad ? eq(properties.tipoPropiedad, tipoPropiedad) : undefined,
    tipoOperacion ? eq(properties.tipoOperacion, tipoOperacion) : undefined,
    minPrecio ? gte(properties.precio, minPrecio) : undefined,
    maxPrecio ? lte(properties.precio, maxPrecio) : undefined,
  ].filter(Boolean) as any[];

  const offset = (page - 1) * perPage;

  const [rows, [{ count }]] = await Promise.all([
    db.query.properties.findMany({
      where: where.length ? and(...where) : undefined,
      orderBy: desc(properties.createdAt),
      limit: perPage,
      offset,
    }),
    db.execute(
      sql`SELECT COUNT(*)::int AS count FROM properties ${where.length ? sql`WHERE ${and(...where)}` : sql``}`
    ) as any,
  ]);

  return NextResponse.json({ data: rows, meta: { page, perPage, total: count } });
}

// POST /api/inmuebles  (protege con token temporal hasta tener auth real)
export async function POST(req: NextRequest) {
  const token = req.headers.get("x-admin-token");
  if (!token || token !== process.env.ADMIN_API_TOKEN) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const p = parsed.data;

  const [created] = await db
    .insert(properties)
    .values({
      titulo: p.titulo,
      direccion: p.direccion,
      tipoPropiedad: p.tipoPropiedad,
      tipoOperacion: p.tipoOperacion,
      precio: p.precio,
      habitaciones: p.habitaciones,
      banos: p.banos,
      estacionamientos: p.estacionamientos,
      metros: p.metros,
      antiguedad: p.antiguedad,
      descripcion: p.descripcion,
      imagenes: p.imagenes,
      fecha: p.fecha,
      ambientes: p.ambientes,
      servicios: p.servicios,
      amenidades: p.amenidades,
      exteriores: p.exteriores,
      extras: p.extras,
      detalles: p.detalles,
    })
    .returning();

  return NextResponse.json({ data: created }, { status: 201 });
}
