"use server";

import { Resend } from "resend";
import { contactSchema } from "@/lib/validation/contact";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendEmail = async (formData: unknown) => {
  const parsed = contactSchema.safeParse(formData);

  if (!parsed.success) {
    console.error(
      "❌ Datos inválidos en el formulario:",
      parsed.error.flatten()
    );
    throw new Error("Datos inválidos");
  }

  const { nombre, correo, mensaje, empresa } = parsed.data;

  // honeypot anti-bot 
  if (empresa && empresa.trim() !== "") {
    console.warn("🛑 Bot detectado: campo honeypot llenado.");
    throw new Error("HONEYPOT_TRIGGERED");
  }

  try {
    // Admin
    await resend.emails.send({
      from: "Real Estate Querétaro <onboarding@resend.dev>",
      to: "omarins.222@gmail.com",
      subject: "Nuevo mensaje de contacto",
      html: `
        <p><strong>Nombre:</strong> ${nombre}</p>
        <p><strong>Correo:</strong> ${correo}</p>
        <p><strong>Mensaje:</strong></p>
        <p>${mensaje}</p>
      `,
    });

    // Cliente
    await resend.emails.send({
      from: "Real Estate Querétaro <onboarding@resend.dev>",
      to: correo,
      subject: "¡Hemos recibido tu mensaje!",
      html: `
        <p>Hola <strong>${nombre}</strong>,</p>
        <p>Gracias por contactarnos. Hemos recibido tu mensaje y en breve te responderemos.</p>
        <blockquote>${mensaje}</blockquote>
        <p>Saludos,<br/>Equipo Real Estate Querétaro</p>
      `,
    });

    return { success: true };
  } catch (error) {
    console.error("❌ Error al enviar correos:", error);
    throw new Error("No se pudo enviar el correo.");
  }
};
