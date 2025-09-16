'use client'

import { Separator } from "@/components/ui/separator"

export default function Footer() {
  return (
    <footer className="mt-16">
      <Separator className="mb-6" />
      <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center text-sm text-muted-foreground pb-8">
        <p className="mb-2 md:mb-0">Creado por RealEstate Studio</p>
        <p>Contacto: 442-765-4321</p>
      </div>
    </footer>
  )
}

