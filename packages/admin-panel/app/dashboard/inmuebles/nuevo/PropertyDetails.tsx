"use client";

import * as React from "react";
import type { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { PropertyCreateSchema } from "@/lib/validators/property";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

type FormData = z.infer<typeof PropertyCreateSchema>;

type Props = {
  form: UseFormReturn<FormData>;
};

export default function PropertyDetails({ form }: Props) {
  return (
    <section className="space-y-6">
      <div>
        <Label htmlFor="titulo">Título</Label>
        <Input id="titulo" {...form.register("titulo")} />
        {form.formState.errors.titulo && (
          <p className="text-red-500 text-sm">{form.formState.errors.titulo.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="direccion">Dirección</Label>
        <Input id="direccion" {...form.register("direccion")} />
      </div>

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

      <div>
        <Label htmlFor="precio">Precio</Label>
        <Input id="precio" type="number" {...form.register("precio", { valueAsNumber: true })} />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="habitaciones">Habitaciones</Label>
          <Input id="habitaciones" type="number" {...form.register("habitaciones", { valueAsNumber: true })} />
        </div>

        <div>
          <Label htmlFor="banos">Baños</Label>
          <Input id="banos" type="number" {...form.register("banos", { valueAsNumber: true })} />
        </div>

        <div>
          <Label htmlFor="estacionamientos">Estacionamientos</Label>
          <Input id="estacionamientos" type="number" {...form.register("estacionamientos", { valueAsNumber: true })} />
        </div>

        <div>
          <Label htmlFor="metros">Metros</Label>
          <Input id="metros" type="number" {...form.register("metros", { valueAsNumber: true })} />
        </div>

        <div>
          <Label htmlFor="antiguedad">Antigüedad (años)</Label>
          <Input id="antiguedad" type="number" {...form.register("antiguedad", { valueAsNumber: true })} />
        </div>

        <div>
          <Label htmlFor="fecha">Fecha</Label>
          <Input id="fecha" type="date" {...form.register("fecha", { valueAsDate: true })} />
        </div>
      </div>

      <div>
        <Label htmlFor="descripcion">Descripción</Label>
        <Textarea id="descripcion" rows={5} {...form.register("descripcion")} />
      </div>
    </section>
  );
}

