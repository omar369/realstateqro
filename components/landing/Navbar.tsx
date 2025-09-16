'use client'

import Link from "next/link"
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription } from "@/components/ui/sheet"
import { Menu } from "lucide-react"

export default function Navbar() {
  return (
    <header className="border-b">
      <div className="container mx-auto flex items-center justify-between px-4 py-4">
        <Link href="/" className="text-xl font-bold">
          RealEstate
        </Link>

        {/* Desktop menu */}
        <nav className="hidden md:flex gap-6 text-sm font-medium">
          <Link href="/inmuebles" className="hover:text-primary">Inmuebles</Link>
          <Link href="/renta" className="hover:text-primary">Renta</Link>
          <Link href="/venta" className="hover:text-primary">Venta</Link>
          <Link href="/contacto" className="hover:text-primary">Contacto</Link>
        </nav>

        {/* Mobile hamburger menu */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger aria-label="Abrir menú">
              <Menu className="h-6 w-6" />
            </SheetTrigger>
            <SheetContent side="left">
              <SheetTitle className="sr-only">Menú móvil</SheetTitle>
              <SheetDescription className="sr-only">Navegación para dispositivos móviles</SheetDescription>
              <div className="flex flex-col gap-4 mt-8 text-base font-medium">
                <Link href="/inmuebles">Inmuebles</Link>
                <Link href="/renta">Renta</Link>
                <Link href="/venta">Venta</Link>
                <Link href="/contacto">Contacto</Link>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
