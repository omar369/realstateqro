import { z } from "zod";

export const PropertyCreateSchema = z.object({
  titulo: z.string().min(3),
  direccion: z.string().min(3),
  tipoPropiedad: z.string(),
  tipoOperacion: z.string(),
  precio: z.coerce.number(),
  habitaciones: z.coerce.number().optional(),
  banos: z.coerce.number().optional(),
  estacionamientos: z.coerce.number().optional(),
  metros: z.coerce.number().optional(),
  antiguedad: z.coerce.number().optional(),
  descripcion: z.string().optional(),
  imagenes: z.array(z.string()).optional().default([]),
  fecha: z.coerce.date().optional(),
  ambientes: z.array(z.string()).optional().default([]),
  servicios: z.array(z.string()).optional().default([]),
  amenidades: z.array(z.string()).optional().default([]),
  exteriores: z.array(z.string()).optional().default([]),
  extras: z.array(z.string()).optional().default([]),
  detalles: z.record(z.string(), z.any()).optional().default({}),
  createdBy: z.string().uuid().optional(),
});

// Validación para actualizar (todos los campos opcionales)
export const PropertyUpdateSchema = PropertyCreateSchema.partial();

