"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { Menu } from "lucide-react";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="border-b">
      <div className="container mx-auto flex items-center justify-between px-4 py-4">
        <Link href="/" className="text-xl font-bold">
          Real Estate Querétaro
        </Link>

        {/* Desktop menu */}
        <nav className="hidden md:flex gap-6 text-sm font-medium">
          <Link href="/inmuebles" className="hover:text-primary">
            Inmuebles
          </Link>

          <Link
            href={{
              pathname: "/inmuebles",
              query: { tipoOperacion: "renta" },
            }}
          >
            Renta
          </Link>

          <Link
            href={{
              pathname: "/inmuebles",
              query: { tipoOperacion: "venta" },
            }}
          >
            Venta
          </Link>

          <Link href="/contacto" className="hover:text-primary">
            Contacto
          </Link>
        </nav>

        {/* Mobile hamburger menu */}
        <div className="md:hidden">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger aria-label="Abrir menú">
              <Menu className="h-6 w-6" />
            </SheetTrigger>
            <SheetContent side="left">
              <SheetTitle className="sr-only">Menú móvil</SheetTitle>
              <SheetDescription className="sr-only">
                Navegación para dispositivos móviles
              </SheetDescription>
              <div className="flex flex-col px-5 gap-4 mt-8 text-base font-medium">
                <Link href="/" onClick={() => setOpen(false)}>
                  Inicio
                </Link>
                <Separator />
                <Link href="/inmuebles" onClick={() => setOpen(false)}>
                  Inmuebles
                </Link>
                <Separator />
                <Link
                  href={{
                    pathname: "/inmuebles",
                    query: { tipoOperacion: "renta" },
                  }}
                  onClick={() => setOpen(false)}
                >
                  Renta
                </Link>
                <Separator />
                <Link
                  href={{
                    pathname: "/inmuebles",
                    query: { tipoOperacion: "venta" },
                  }}
                  onClick={() => setOpen(false)}
                >
                  Venta
                </Link>
                <Separator />
                <Link href="/contacto" onClick={() => setOpen(false)}>
                  Contacto
                </Link>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
