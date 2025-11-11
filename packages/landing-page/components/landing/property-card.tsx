import Image from "next/image";
import { Badge } from "@landing/components/ui/badge";
import { Button } from "@landing/components/ui/button";
import {
  BathIcon,
  BedDoubleIcon,
  ExpandIcon,
  CalendarIcon,
} from "lucide-react";
import Link from "next/link";

type Property = {
  id?: number;
  titulo?: string;
  direccion?: string;
  tipoOperacion?: "venta" | "renta" | "traspaso";
  precio?: number;
  habitaciones?: number;
  banos?: number;
  metros?: number;
  imagenes?: string[];
  fecha?: string;
};

interface PropertyCardProps {
  property: Property;
}

export function PropertyCard({ property }: PropertyCardProps) {
  return (
    <div className="flex flex-col md:flex-row border rounded-lg overflow-hidden shadow-sm bg-white">
      <div className="md:w-1/2 w-full h-64 md:h-auto relative">
      {property.imagenes?.[0] && (
         <Image
          src={property.imagenes[0]}
          alt={property.titulo || "Propiedad"}
          fill
          className="object-cover"
        />
      )}
      </div>

      <div className="flex flex-col justify-between p-6 space-y-4 md:w-1/2">
        <div className="space-y-2">
          {/* Tipo y precio */}
          <div className="flex justify-between items-center">
            <Badge variant="outline" className="capitalize">
              {property.tipoOperacion}
            </Badge>
            <span className="text-xl font-bold text-right">
              ${property.precio?.toLocaleString()}
            </span>
          </div>

          {/* Título y dirección */}
          <h3 className="text-xl font-semibold">{property.titulo}</h3>
          <p className="text-sm text-muted-foreground">{property.direccion}</p>

          {/* Íconos */}
          <div className="flex items-center gap-6 pt-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <BedDoubleIcon className="w-4 h-4" />
              {property.habitaciones}
            </div>
            <div className="flex items-center gap-1">
              <BathIcon className="w-4 h-4" />
              {property.banos}
            </div>
            <div className="flex items-center gap-1">
              <ExpandIcon className="w-4 h-4" />
              {property.metros} m²
            </div>
          </div>
        </div>

        {/* Extra opcional */}
        <div className="flex justify-between items-center pt-4">
          {property.fecha && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <CalendarIcon className="w-4 h-4" />
              Publicado: {property.fecha}
            </div>
          )}
          <Button variant="outline" size="sm" asChild>
            <Link href={`/inmuebles/${property.id}`}>Ver más</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
