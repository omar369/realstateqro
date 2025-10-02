"use client";

import { notFound, useSearchParams } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import { PaginationCatalogue } from "@/components/landing/pagination-catalogue";
import { FilterCatalogue } from "@/components/landing/filter-catalogue";
import { PropertyCard } from "@/components/landing/property-card";
import { properties } from "@/data/properties";
import { Property } from "@/types/property";

export default function InmueblesPage() {
  const searchParams = useSearchParams();
  const keyword = searchParams.get("keyword") || "";
  const tipoOperacion = searchParams.getAll("tipoOperacion");
  const tipoPropiedad = searchParams.get("tipoPropiedad") || "";
  const page = parseInt(searchParams.get("page") || "1", 10);

  const PROPERTIES_PER_PAGE = 10;

  const filtered: Property[] = properties.filter((prop) => {
    const matchesTipo =
      tipoOperacion.length === 0 || tipoOperacion.includes(prop.tipoOperacion);
    const matchesPropiedad =
      !tipoPropiedad || prop.tipoPropiedad === tipoPropiedad;
    const matchesKeyword =
     !keyword || prop.titulo.toLowerCase().includes(keyword.toLowerCase()); 

    return matchesTipo && matchesPropiedad && matchesKeyword;
  });

  const totalPages = Math.ceil(filtered.length / PROPERTIES_PER_PAGE);
  const startIndex = (page - 1) * PROPERTIES_PER_PAGE;
  const endIndex = startIndex + PROPERTIES_PER_PAGE;
  const paginatedProperties = filtered.slice(startIndex, endIndex);

  if (page > totalPages) {
    notFound();
  }

  return (
    <section className="max-w-5xl mx-auto px-4 py-16 space-y-10">
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-bold tracking-tight">Propiedades</h1>
        <FilterCatalogue />
      </div>

      {(keyword || tipoOperacion.length || tipoPropiedad) && (
        <p className="text-sm text-muted-foreground text-center">
          Mostrando resultados
          {keyword && <> con palabra clave <strong>{keyword}</strong></>}
          {tipoOperacion.length > 0 && (
            <> para operación: <strong>{tipoOperacion.join(", ")}</strong></>
          )}
          {tipoPropiedad && (
            <> de tipo: <strong>{tipoPropiedad}</strong></>
          )}
        </p>
      )}

      <Separator className="my-10" />

      <div className="grid gap-6">
        {paginatedProperties.length > 0 ? (
          paginatedProperties.map((prop) => (
            <PropertyCard key={prop.id} property={prop} />
          ))
        ) : (
          <p className="text-center text-muted-foreground">
            No se encontraron propiedades con esos filtros.
          </p>
        )}
      </div>

      <div className="flex justify-center">
        <PaginationCatalogue
          currentPage={page}
          totalPages={totalPages}
          generateHref={(pageNumber) => {
            const base = "/inmuebles";
            const params = new URLSearchParams();

            if (keyword) params.set("keyword", keyword);
            if (tipoPropiedad) params.set("tipoPropiedad", tipoPropiedad);
            tipoOperacion.forEach((op) => params.append("tipoOperacion", op));
            params.set("page", pageNumber.toString());

            return `${base}?${params.toString()}`;
          }}
        />
      </div>
    </section>
  );
}
