"use client";

import {
  Drawer,
  DrawerContent,
  DrawerTrigger,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
} from "@landing/components/ui/drawer";

import { Button } from "@landing/components/ui/button";
import { Input } from "@landing/components/ui/input";
import { Toggle } from "@landing/components/ui/toggle";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@landing/components/ui/select";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function FilterCatalogue() {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const [keyword, setKeyword] = useState("");
  const [tipoOperacion, setTipoOperacion] = useState<string[]>([]);
  const [tipoPropiedad, setTipoPropiedad] = useState("");

  const handleSubmit = () => {
    const params = new URLSearchParams();

    if (keyword) params.set("keyword", keyword);
    if (tipoPropiedad) params.set("tipoPropiedad", tipoPropiedad);
    tipoOperacion.forEach((op) => params.append("tipoOperacion", op));

    router.push(`/inmuebles?${params.toString()}`);
    setOpen(false);

    console.log("Filtrando con:", {
      keyword,
      tipoOperacion,
      tipoPropiedad,
    });
  };

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant="outline" className="ml-auto block">
          Filtrar
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full max-w-xl px-4 py-8 space-y-6">
          <DrawerHeader>
            <DrawerTitle>Filtrar Propiedades</DrawerTitle>
            <DrawerDescription>
              Usa los campos para encontrar la propiedad ideal.
            </DrawerDescription>
          </DrawerHeader>

          <div className="space-y-4">
            {/* Input: palabra clave */}
            <div className="space-y-1">
              <label className="block text-sm font-medium">
                Buscar palabra
              </label>
              <Input
                placeholder="Ej: jardín, alberca, céntrico..."
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
              />
            </div>

            {/* Select: tipo de propiedad */}
            <div className="space-y-1">
              <label className="block text-sm font-medium">
                Tipo de propiedad
              </label>
              <Select value={tipoPropiedad} onValueChange={setTipoPropiedad}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecciona un tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="casa">Casa</SelectItem>
                  <SelectItem value="departamento">Departamento</SelectItem>
                  <SelectItem value="local">Local</SelectItem>
                  <SelectItem value="terreno">Terreno</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Toggles: tipo de operación */}
            <div className="space-y-1">
              <label className="block text-sm font-medium">Operación</label>
              <div className="flex flex-wrap gap-2">
                {["venta", "renta", "traspaso"].map((op) => (
                  <Toggle
                    key={op}
                    pressed={tipoOperacion.includes(op)}
                    onPressedChange={(pressed) => {
                      setTipoOperacion((prev) =>
                        pressed
                          ? [...prev, op]
                          : prev.filter((item) => item !== op)
                      );
                    }}
                  >
                    {op.charAt(0).toUpperCase() + op.slice(1)}
                  </Toggle>
                ))}
              </div>
            </div>
          </div>

          <DrawerFooter className="pt-4">
            <Button onClick={handleSubmit}>Filtrar</Button>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
