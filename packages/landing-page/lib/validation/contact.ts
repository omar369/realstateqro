import { z } from "zod";

export const contactSchema = z.object({
  nombre: z.string().min(2, "Nombre demasiado corto").max(100),
  correo: z.string().email("Correo no válido"),
  mensaje: z.string().min(5, "Mensaje muy corto").max(1000),
  empresa: z.string().optional().default(""),
});

export type ContactSchema = z.infer<typeof contactSchema>;
