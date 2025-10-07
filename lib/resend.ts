"use server";

import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

interface EmailForm {
  nombre: string;
  correo: string;
  mensaje: string;
}

export const sendEmail = async ({ nombre, correo, mensaje }: EmailForm) => {
  try {
    // al administrador
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

    // al cliente
    await resend.emails.send({
      from: "Real Estate Querétaro <onboarding@resend.dev>",
      to: correo,
      subject: "¡Hemos recibido tu mensaje!",
      html: `
        <p>Hola <strong>${nombre}</strong>,</p>
        <p>Gracias por contactarnos. Hemos recibido tu mensaje y en breve uno de nuestros asesores te responderá.</p>
        <p><strong>Tu mensaje:</strong></p>
        <blockquote>${mensaje}</blockquote>
        <p>Saludos,<br/>Equipo Real Estate Querétaro</p>
      `,
    });

    return { success: true };
  } catch (error) {
    console.error("Error al enviar correos:", error);
    return { success: false };
  }
};
