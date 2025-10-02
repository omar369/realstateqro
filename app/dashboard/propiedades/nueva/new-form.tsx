"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import ImageUploader from "./image-uploader";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Toggle } from "@/components/ui/toggle";

const DETALLES = z.object({
  estadoConservacion: z.string().min(1),
  balcon: z.coerce.number().int().nonnegative(),
  elevador: z.coerce.number().int().nonnegative(),
  bodega: z.coerce.number().int().nonnegative(),
  nivelesConstruidos: z.coerce.number().int().nonnegative(),
  estanciaMinima: z.coerce.number().int().nonnegative(),
  disponibilidad: z.string().min(1),
});

const schema = z.object({
  titulo: z.string().min(3),
  direccion: z.string().min(3),
  tipoPropiedad: z.enum([
    "casa",
    "departamento",
    "terreno",
    "oficina",
    "local",
    "bodega",
  ]),
  tipoOperacion: z.enum(["venta", "renta"]),
  precio: z.coerce.number().int().positive(),
  habitaciones: z.coerce.number().int().min(0),
  banos: z.coerce.number().int().min(0),
  estacionamientos: z.coerce.number().int().min(0),
  metros: z.coerce.number().int().min(0),
  antiguedad: z.coerce.number().int().min(0),
  descripcion: z.string().min(5),
  imagenes: z.array(z.string().url()).min(1),
  fecha: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  ambientes: z.array(z.string()).default([]),
  servicios: z.array(z.string()).default([]),
  amenidades: z.array(z.string()).default([]),
  exteriores: z.array(z.string()).default([]),
  extras: z.array(z.string()).default([]),
  // detalles
  estadoConservacion: z.string().min(1),
  balcon: z.coerce.number().int().nonnegative(),
  elevador: z.coerce.number().int().nonnegative(),
  bodega: z.coerce.number().int().nonnegative(),
  nivelesConstruidos: z.coerce.number().int().nonnegative(),
  estanciaMinima: z.coerce.number().int().nonnegative(),
  disponibilidad: z.string().min(1),
});

type FormValues = z.infer<typeof schema>;

// opciones
const AMBIENTES = [
  "Cocina integral",
  "Cuarto de juegos",
  "Estudio",
  "Sala",
  "Comedor",
];
const SERVICIOS = [
  "Internet/Wifi",
  "Seguridad privada",
  "Calefacción",
  "Elevador",
  "Cisterna",
];
const AMENIDADES = [
  "Alberca",
  "Gimnasio",
  "Área de eventos",
  "Roof garden",
  "Área común",
];
const EXTERIORES = ["Jardín privado", "Terraza", "Balcón", "Patio"];
const EXTRAS = ["Amueblado", "Clóset", "Permite mascotas", "A/A"];

function MultiToggle({
  value,
  onChange,
  options,
}: {
  value: string[];
  onChange: (v: string[]) => void;
  options: string[];
}) {
  const toggle = (opt: string) =>
    onChange(
      value.includes(opt) ? value.filter((v) => v !== opt) : [...value, opt]
    );
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => (
        <Toggle
          key={opt}
          pressed={value.includes(opt)}
          onPressedChange={() => toggle(opt)}
          className="data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
          type="button"
        >
          {opt}
        </Toggle>
      ))}
    </div>
  );
}

export default function NewForm() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      // selects
      tipoOperacion: "venta",
      tipoPropiedad: "casa",
      // strings
      titulo: "",
      direccion: "",
      descripcion: "",
      estadoConservacion: "",
      disponibilidad: "",
      // fecha
      fecha: new Date().toISOString().slice(0, 10),
      // números
      precio: 0,
      habitaciones: 0,
      banos: 0,
      estacionamientos: 0,
      metros: 0,
      antiguedad: 0,
      balcon: 0,
      elevador: 0,
      bodega: 0,
      nivelesConstruidos: 1,
      estanciaMinima: 0,
      // arrays
      imagenes: [],
      ambientes: [],
      servicios: [],
      amenidades: [],
      exteriores: [],
      extras: [],
    },
  });

  const onSubmit = async (v: FormValues) => {
    setSubmitting(true);
    try {
      const res = await fetch("/api/inmuebles", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-token": process.env.NEXT_PUBLIC_ADMIN_TOKEN ?? "",
        },
        body: JSON.stringify({
          titulo: v.titulo,
          direccion: v.direccion,
          tipoPropiedad: v.tipoPropiedad,
          tipoOperacion: v.tipoOperacion,
          precio: v.precio,
          habitaciones: v.habitaciones,
          banos: v.banos,
          estacionamientos: v.estacionamientos,
          metros: v.metros,
          antiguedad: v.antiguedad,
          descripcion: v.descripcion,
          imagenes: v.imagenes, // URLs de R2
          fecha: v.fecha,
          ambientes: v.ambientes,
          servicios: v.servicios,
          amenidades: v.amenidades,
          exteriores: v.exteriores,
          extras: v.extras,
          detalles: {
            estadoConservacion: v.estadoConservacion,
            balcon: v.balcon,
            elevador: v.elevador,
            bodega: v.bodega,
            nivelesConstruidos: v.nivelesConstruidos,
            estanciaMinima: v.estanciaMinima,
            disponibilidad: v.disponibilidad,
          },
        }),
      });
      if (!res.ok) throw new Error("Error al crear el anuncio");
      router.push("/dashboard/propiedades");
      router.refresh();
    } catch (e: any) {
      alert(e.message ?? "Error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Básicos */}
        <div className="grid gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="titulo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Título</FormLabel>
                <FormControl>
                  <Input {...field} value={field.value ?? ""}/>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="precio"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Precio</FormLabel>
                <FormControl>
                  <Input type="number" {...field} value={field.value ?? 0}/>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="tipoPropiedad"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tipo de propiedad</FormLabel>
                <FormControl>
                  <Select value={field.value ?? "casa"} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona" />
                    </SelectTrigger>
                    <SelectContent>
                      {[
                        "casa",
                        "departamento",
                        "terreno",
                        "oficina",
                        "local",
                        "bodega",
                      ].map((o) => (
                        <SelectItem key={o} value={o}>
                          {o}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="tipoOperacion"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Operación</FormLabel>
                <FormControl>
                  <Select value={field.value ?? "venta"} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona" />
                    </SelectTrigger>
                    <SelectContent>
                      {["venta", "renta"].map((o) => (
                        <SelectItem key={o} value={o}>
                          {o}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="fecha"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Fecha</FormLabel>
                <FormControl>
                  <Input type="date" {...field} value={field.value ?? ""}/>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="direccion"
            render={({ field }) => (
              <FormItem className="md:col-span-2">
                <FormLabel>Dirección</FormLabel>
                <FormControl>
                  <Input {...field} value={field.value ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Números */}
        <div className="grid gap-4 md:grid-cols-5">
          {(
            [
              "habitaciones",
              "banos",
              "estacionamientos",
              "metros",
              "antiguedad",
            ] as const
          ).map((name) => (
            <FormField
              key={name}
              control={form.control}
              name={name}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{name}</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} value={field.value ?? 0} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}
        </div>

        {/* Descripción */}
        <FormField
          control={form.control}
          name="descripcion"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descripción</FormLabel>
              <FormControl>
                <Textarea rows={4} {...field} value={field.value ?? ""} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Separator />

        {/* Imágenes */}
        <FormField
          control={form.control}
          name="imagenes"
          render={() => (
            <FormItem>
              <FormLabel>Imágenes</FormLabel>
              <FormControl>
                <ImageUploader
                  onChange={(urls) =>
                    form.setValue("imagenes", urls, { shouldValidate: true })
                  }
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Separator />
        {/* Grupos con Toggle */}
        <div className="grid gap-6">
          {[
            { name: "ambientes", label: "Ambientes", options: AMBIENTES },
            { name: "servicios", label: "Servicios", options: SERVICIOS },
            { name: "amenidades", label: "Amenidades", options: AMENIDADES },
            { name: "exteriores", label: "Exteriores", options: EXTERIORES },
            { name: "extras", label: "Extras", options: EXTRAS },
          ].map((grp) => (
            <FormField
              key={grp.name}
              control={form.control}
              // @ts-expect-error indexed access
              name={grp.name}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{grp.label}</FormLabel>
                  <FormControl>
                    <MultiToggle
                      value={field.value ?? []}
                      onChange={(v) => field.onChange(v)}
                      options={grp.options}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}
        </div>

        <Separator />
        {/* Detalles */}
        <p className="text-sm font-medium">Detalles</p>
        <div className="grid gap-4 md:grid-cols-3">
          {[
            ["estadoConservacion", "Estado de conservación", "text"],
            ["balcon", "Balcón", "number"],
            ["elevador", "Elevador", "number"],
            ["bodega", "Bodega", "number"],
            ["nivelesConstruidos", "Niveles construidos", "number"],
            ["estanciaMinima", "Estancia mínima", "number"],
            ["disponibilidad", "Disponibilidad", "text"],
          ].map(([name, label, type]) => (
            <FormField
              key={name}
              control={form.control}
              name={name as any}
              render={({ field }) => (
                <FormItem
                  className={
                    name === "estadoConservacion" || name === "disponibilidad"
                      ? "md:col-span-3"
                      : ""
                  }
                >
                  <FormLabel>{label}</FormLabel>
                  <FormControl>
                    <Input type={type} {...field} value={field.value ?? ""}/>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}
        </div>

        <div className="flex justify-end gap-2">
          <Button type="submit" disabled={submitting}>
            {submitting ? "Guardando..." : "Crear anuncio"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
