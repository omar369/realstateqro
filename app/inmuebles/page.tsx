"use client"

import { useSearchParams } from "next/navigation"
import { Separator } from "@/components/ui/separator"
import { PaginationCatalogue } from "@/components/landing/pagination-catalogue"

export default function InmueblesPage() {
  const searchParams = useSearchParams()
  const tipo = searchParams.get("tipo") // venta o renta 

  const page = parseInt(searchParams.get("page") || "1", 10)

  const totalPages = 5 //cambiar con backend...

  return (
    <section className="max-w-5xl mx-auto px-4 py-16 space-y-10">
      <div className="space-y-2 text-center">
        <h1 className="text-4xl font-bold tracking-tight">
          Propiedades
        </h1>
        {tipo && (
          <p className="text-muted-foreground">
            Filtrando por tipo: <strong>{tipo}</strong>
          </p>
        )}
      </div>

      {/* Recuerda crear el filtro */}

      <Separator className="my-10" />

      <div className="flex justify-center">
        <PaginationCatalogue
          currentPage={page}
          totalPages={totalPages}
          generateHref={(pageNumber) => {
            const base = "/inmuebles"
            const params = new URLSearchParams()
            if (tipo) params.set("tipo", tipo)
            params.set("page", pageNumber.toString())
            return `${base}?${params.toString()}`
          }}
        />
      </div>
    </section>
  )
}
