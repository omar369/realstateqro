"use server";

import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

interface EmailForm {
  nombre: string;
  correo: string;
  mensaje: string;
}

export const sendEmail = async ({ nombre, correo, mensaje }: EmailForm) => {
  await resend.emails.send({
    from: "Real Estate Querétaro <onboarding@resend.dev>",
    to: "omarins.222@gmail.com",
    subject: "cita para ver casa en ...",
    html: `
      <p><strong>Nombre:</strong> ${nombre}</p>
      <p><strong>Correo:</strong> ${correo}</p>
      <p><strong>Mensaje:</strong></p>
      <p>${mensaje}</p>
    `,
  });
};
