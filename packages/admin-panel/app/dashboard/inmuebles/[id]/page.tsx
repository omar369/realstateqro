"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";

interface Property {
  id: number;
  titulo: string;
  direccion: string;
  tipoPropiedad: string;
  tipoOperacion: string;
  precio: number;
  habitaciones: number;
  banos: number;
  estacionamientos: number;
  metros: number;
  antiguedad: number;
  descripcion: string;
  imagenes: string[];
  createdAt: string;
}

export default function PropertyDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProperty() {
      try {
        const res = await fetch(`/api/properties/${id}`);
        const data = await res.json();
        if (data.success) {
          setProperty(data.data);
        } else {
          console.error("❌ Error:", data.error);
        }
      } catch (err) {
        console.error("❌ Error al obtener propiedad:", err);
      } finally {
        setLoading(false);
      }
    }

    if (id) fetchProperty();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full p-10">
        <p className="text-muted-foreground">Cargando propiedad...</p>
      </div>
    );
  }

  if (!property) {
    return (
      <Card className="p-8 text-center text-muted-foreground">
        Propiedad no encontrada.
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">{property.titulo}</h1>
        <Button
          variant="outline"
          onClick={() => router.push("/dashboard/inmuebles")}
        >
          Volver al listado
        </Button>
      </div>

      <Separator />

      <Card className="p-6 space-y-4">
        <p>
          <strong>Dirección:</strong> {property.direccion}
        </p>
        <p>
          <strong>Tipo:</strong> {property.tipoPropiedad} —{" "}
          {property.tipoOperacion}
        </p>
        <p>
          <strong>Precio:</strong> ${property.precio.toLocaleString()}
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <p>
            <strong>Habitaciones:</strong> {property.habitaciones}
          </p>
          <p>
            <strong>Baños:</strong> {property.banos}
          </p>
          <p>
            <strong>Estacionamientos:</strong> {property.estacionamientos}
          </p>
          <p>
            <strong>Metros:</strong> {property.metros}
          </p>
          <p>
            <strong>Antigüedad:</strong> {property.antiguedad} años
          </p>
        </div>

        <Separator />

        <div>
          <h2 className="text-lg font-medium mb-2">Descripción</h2>
          <p className="text-muted-foreground">{property.descripcion}</p>
        </div>

        <Separator />

        {property.imagenes.length > 0 && (
          <div>
            <h2 className="text-lg font-medium mb-2">Imágenes</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {property.imagenes.map((url, i) => (
                <div
                  key={i}
                  className="relative w-full h-40 rounded-md overflow-hidden border"
                >
                  <Image
                    src={url}
                    alt={`Imagen ${i + 1}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
