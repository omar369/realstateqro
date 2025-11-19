import { z } from "zod";
import { ImagePayloadSchema } from "./images";

export const PropertyCreateSchema = z.object({
  // Obligatorios con mínimos
  titulo: z.string().min(10, "El título debe tener al menos 10 caracteres"),
  precio: z.coerce.number().min(1000, "El precio mínimo es 1000"),
  descripcion: z
    .string()
    .min(20, "La descripción debe tener al menos 20 caracteres"),
  metros: z.coerce
    .number()
    .int()
    .min(10, "La superficie mínima es de 2 dígitos"),

  // Básicos requeridos por negocio
  direccion: z.string().min(3, "La dirección es obligatoria"),
  tipoPropiedad: z.string().min(1, "El tipo de propiedad es obligatorio"),
  tipoOperacion: z.string().min(1, "El tipo de operación es obligatorio"),

  // Númericos base (permiten 0)
  habitaciones: z.coerce.number().int().min(0).default(0),
  banos: z.coerce.number().int().min(0).default(0),
  medioBano: z.coerce.number().int().min(0).default(0),
  estacionamientos: z.coerce.number().int().min(0).default(0),
  antiguedad: z.coerce.number().int().min(0).default(0),

  // Arrays de selección
  images: z.array(ImagePayloadSchema).default([]),
  fecha: z.coerce.date().default(() => new Date()),
  ambientes: z.array(z.string()).default([]),
  servicios: z.array(z.string()).default([]),
  amenidades: z.array(z.string()).default([]),
  exteriores: z.array(z.string()).default([]),
  extras: z.array(z.string()).default([]),

  // Detalles del inmueble (DB: NOT NULL). Si no llega dato, usamos "NA".
  estadoConservacion: z.string().default("NA"),
  balcon: z.string().default("NA"),
  elevador: z.string().default("NA"),
  bodega: z.string().default("NA"),
  nivelesConstruidos: z.string().default("NA"),
  estanciaMinimaDias: z.string().default("NA"),
  disponibilidad: z.string().default("NA"),

  // Miscelánea
  detalles: z.record(z.string(), z.any()).default({}),
  createdBy: z.string().optional(),
  createdAt: z.date().optional(),
});

export const PropertyUpdateSchema = PropertyCreateSchema.partial();

