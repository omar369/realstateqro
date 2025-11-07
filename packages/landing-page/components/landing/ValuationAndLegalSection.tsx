"use client";

import Image from "next/image";
import Link from "next/link";

export default function ValuationAndLegalSection() {
  return (
    <section className="max-w-6xl mx-auto px-4 py-24 space-y-32">
      {/* Avalúo Profesional */}
      <div className="grid md:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold leading-tight">
            Servicio de Avalúos Profesional
          </h2>
          <p className="text-muted-foreground text-lg">
            Ofrecemos avalúos precisos realizados por peritos certificados para
            asegurar el valor real de tu propiedad en el mercado.
          </p>
          <Link
            href="/"
            className="text-primary underline underline-offset-4 text-base font-medium hover:opacity-80 transition"
          >
            Ver info
          </Link>
        </div>
        <div className="relative w-full h-72 md:h-96">
          <Image
            src="/valuation.png"
            alt="Avalúo profesional"
            fill
            className="object-cover rounded-lg"
          />
        </div>
      </div>

      {/* Pólizas Jurídicas */}
      <div className="grid md:grid-cols-2 gap-12 items-center md:flex-row-reverse">
        <div className="space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold leading-tight">
            Pólizas Jurídicas para Renta
          </h2>
          <p className="text-muted-foreground text-lg">
            Protege tu propiedad y asegura el cumplimiento del contrato con
            nuestras pólizas jurídicas especializadas para arrendamientos.
          </p>
          <Link
            href="/"
            className="text-primary underline underline-offset-4 text-base font-medium hover:opacity-80 transition"
          >
            Ver info
          </Link>
        </div>
        <div className="relative w-full h-72 md:h-96">
          <Image
            src="/legal-protection.png"
            alt="Pólizas jurídicas"
            fill
            className="object-cover rounded-lg"
          />
        </div>
      </div>
    </section>
  );
}
