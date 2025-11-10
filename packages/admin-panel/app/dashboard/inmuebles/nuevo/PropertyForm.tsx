"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PropertyCreateSchema } from "@/lib/validators/property";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

type FormData = z.infer<typeof PropertyCreateSchema>;

export default function PropertyForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(PropertyCreateSchema),
    defaultValues: {
      titulo: "",
      direccion: "",
      tipoPropiedad: "",
      tipoOperacion: "",
      precio: 0,
      habitaciones: 0,
      banos: 0,
      estacionamientos: 0,
      metros: 0,
      antiguedad: 0,
      descripcion: "",
      imagenes: [],
      fecha: new Date(),
      ambientes: [],
      servicios: [],
      amenidades: [],
      exteriores: [],
      extras: [],
      detalles: {},
    },
  });

  async function onSubmit(data: FormData) {
    console.log("Intentando enviar:", data); // 👀 primer check
    try {
      setLoading(true);
      const res = await fetch("/api/properties", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();
      if (result.success) {
        console.log("✅ Propiedad creada:", result.data);
        router.push("/dashboard/inmuebles");
      } else {
        console.error("❌ Error al crear propiedad:", result.error);
        alert("No se pudo crear la propiedad.");
      }
    } catch (error) {
      console.error("❌ Error inesperado:", error);
      alert("Error de conexión o interno.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        console.log("🟢 Evento submit disparado");
        form.handleSubmit(onSubmit)(e);
      }}
      className="space-y-6"
    >
      {/* Título */}
      <div>
        <Label htmlFor="titulo">Título</Label>
        <Input id="titulo" {...form.register("titulo")} />
        {form.formState.errors.titulo && (
          <p className="text-red-500 text-sm">
            {form.formState.errors.titulo.message}
          </p>
        )}
      </div>

      {/* Dirección */}
      <div>
        <Label htmlFor="direccion">Dirección</Label>
        <Input id="direccion" {...form.register("direccion")} />
      </div>

      {/* Tipo de propiedad */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="tipoPropiedad">Tipo de propiedad</Label>
          <Input id="tipoPropiedad" {...form.register("tipoPropiedad")} />
        </div>
        <div>
          <Label htmlFor="tipoOperacion">Tipo de operación</Label>
          <Input id="tipoOperacion" {...form.register("tipoOperacion")} />
        </div>
      </div>

      {/* Precio */}
      <div>
        <Label htmlFor="precio">Precio</Label>
        <Input
          id="precio"
          type="number"
          {...form.register("precio", { valueAsNumber: true })}
        />
      </div>

      {/* Descripción */}
      <div>
        <Label htmlFor="descripcion">Descripción</Label>
        <Textarea id="descripcion" rows={5} {...form.register("descripcion")} />
      </div>

      {/* Botón enviar */}
      <Button type="submit" disabled={loading}>
        {loading ? "Guardando..." : "Guardar propiedad"}
      </Button>
    </form>
  );
}
