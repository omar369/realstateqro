"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import {
  MailIcon,
  MessageSquareIcon,
} from "lucide-react"
import { sendEmail } from "@/lib/resend"

export default function ContactPage() {
  const [form, setForm] = useState({ nombre: "", correo: "", mensaje: "" })
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);
  try {
    await sendEmail(form); 
    setSent(true);
    setForm({ nombre: "", correo: "", mensaje: "" });
  } catch (error) {
    console.error("❌ Error al enviar mensaje:", error);
  } finally {
    setLoading(false);
  }
};


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
          <label className="block mb-1 text-sm font-medium">Correo electrónico</label>
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

        <Button type="submit" disabled={loading} className="w-full">
          {loading ? "Enviando..." : "Enviar"}
        </Button>

        {sent && (
          <p className="text-sm text-green-600 text-center mt-2">
            ✅ Tu mensaje fue enviado correctamente.
          </p>
        )}
      </form>

      <div className="flex justify-center gap-6 pt-8 border-t mt-8">
        <a href="https://wa.me/5214421234567" target="_blank" rel="noopener noreferrer">
          <MessageSquareIcon className="w-6 h-6" />
        </a>
        <a href="https://instagram.com/inmobiliaria" target="_blank" rel="noopener noreferrer">
          <h2>¬¬</h2>
        </a>
        <a href="https://facebook.com/inmobiliaria" target="_blank" rel="noopener noreferrer">
          <h2>°-°</h2>
        </a>
        <a href="mailto:contacto@inmobiliaria.com">
          <MailIcon className="w-6 h-6" />
        </a>
      </div>
    </main>
  )
}
