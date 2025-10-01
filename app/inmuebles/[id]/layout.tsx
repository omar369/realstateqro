import { notFound } from "next/navigation"
import { ReactNode} from "react"

import { properties } from "@/data/properties"
import PropertyDetailClientLayout from "@/components/landing/property-detail-client-layout"

interface LayoutProps {
  children: ReactNode
  params: { id: string }
}

export default function PropertyLayout({ children, params }: LayoutProps) {
  const property = properties.find((p) => p.id === Number(params.id))
  if (!property) return notFound()

  // Client-side interactividad separada en subcomponente
  return (
    <PropertyDetailClientLayout property={property}>
      {children}
    </PropertyDetailClientLayout>
  )
}
