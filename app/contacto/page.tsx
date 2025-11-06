"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { FaFacebook, FaInstagram, FaWhatsapp } from "react-icons/fa";
import CaptchaDialog from "@/components/landing/CaptchaDialog";

export default function ContactPage() {
  const [form, setForm] = useState({
    nombre: "",
    correo: "",
    mensaje: "",
    empresa: "", // honeypot
  });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error" | "bot">(
    "idle",
  );
  const [open, setOpen] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (form.empresa.trim() !== "") {
      setStatus("bot");
      return;
    }
    setOpen(true);
  };

  async function handleConfirm(token: string, phone?: string) {
    setOpen(false);
    setLoading(true);

    try {
      const verify = await fetch("/api/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });

      const result = await verify.json();
      if (!verify.ok || !result.ok) throw new Error("Captcha inválido");

      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, phone }),
      });

      if (!res.ok) throw new Error("Error al enviar el mensaje");

      setStatus("success");
      setForm({ nombre: "", correo: "", mensaje: "", empresa: "" });
    } catch (err) {
      console.error(err);
      setStatus("error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="max-w-xl mx-auto py-20 px-4 space-y-12">
      <h1 className="text-4xl font-bold text-center">Contacto</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block mb-1 text-sm font-medium">Nombre</label>
          <Input
            name="nombre"
            value={form.nombre}
            onChange={handleChange}
            placeholder="Tu nombre"
            required
          />
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium">
            Correo electrónico
          </label>
          <Input
            type="email"
            name="correo"
            value={form.correo}
            onChange={handleChange}
            placeholder="tu@email.com"
            required
          />
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium">Mensaje</label>
          <Textarea
            name="mensaje"
            value={form.mensaje}
            onChange={handleChange}
            placeholder="Escribe tu mensaje aquí..."
            required
          />
        </div>

        {/* Honeypot */}
        <input
          className="hidden"
          name="empresa"
          type="text"
          value={form.empresa}
          onChange={handleChange}
          autoComplete="off"
          tabIndex={-1}
        />

        <Button type="submit" disabled={loading} className="w-full">
          {loading ? "Enviando..." : "Enviar"}
        </Button>

        {status === "success" && (
          <p className="text-green-500">✅ Mensaje enviado correctamente.</p>
        )}
        {status === "error" && (
          <p className="text-red-500">❌ Error al enviar el mensaje.</p>
        )}
        {status === "bot" && (
          <p className="text-red-500">🚫 No se pudo enviar el mensaje.</p>
        )}
      </form>

      <CaptchaDialog
        open={open}
        onConfirm={handleConfirm}
        onClose={() => setOpen(false)}
      />

      <div className="flex justify-center gap-6 pt-8 border-t mt-8">
        <a
          href="https://wa.me/5214421234567"
          target="_blank"
          rel="noopener noreferrer"
        >
          <FaFacebook className="w-6 h-6" />
        </a>
        <a
          href="https://instagram.com/inmobiliaria"
          target="_blank"
          rel="noopener noreferrer"
        >
          <FaInstagram className="w-6 h-6" />
        </a>
        <a href="mailto:contacto@inmobiliaria.com">
          <FaWhatsapp className="w-6 h-6" />
        </a>
      </div>
    </main>
  );
}
