"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PropertyCreateSchema } from "@/lib/validators/property";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import PropertyImages from "./PropertyImages";
import PropertyDetails from "./PropertyDetails";
import type { ImageItem } from "@/components/images/types";

type FormData = z.infer<typeof PropertyCreateSchema>;

export default function PropertyForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<ImageItem[]>([]);

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
      images: [],
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
    const hasPending = images.some((i) => i.status === "pending" || i.status === "uploading");

    const imagesPayload = images
      .filter((i) => i.status === "uploaded" && i.key)
      .sort((a, b) => a.order - b.order)
      .map((i) => ({ key: i.key, publicUrl: i.publicUrl ?? null, order: i.order }));

    const payload = { ...data, images: imagesPayload };
    try {
      setLoading(true);
      const res = await fetch("/api/properties", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await res.json();
      if (result.success) {
        router.push("/dashboard/inmuebles");
      } else {
        console.error("Error al crear propiedad:", result.error);
        alert("No se pudo crear la propiedad.");
      }
    } catch (error) {
      console.error("Error inesperado:", error);
      alert("Error de conexión o interno.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit(onSubmit)(e);
      }}
      className="space-y-6"
    >
      <PropertyImages value={images} onChange={setImages} />
      <PropertyDetails form={form} />

      <Button type="submit" disabled={loading}>
        {loading ? "Guardando..." : "Guardar propiedad"}
      </Button>
      {images.some(i => i.status === 'pending' || i.status === 'uploading') && (
        <p className="text-xs text-muted-foreground">Hay imágenes subiendo. Puedes guardar de todos modos.</p>
      )}
    </form>
  );
}
