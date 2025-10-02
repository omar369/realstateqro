import { notFound } from "next/navigation";
import { properties } from "@/data/properties";
import PropertyDetailClientLayout from "@/components/landing/property-detail-client-layout";

export default function PropertyPage({ params }: { params: { id: string } }) {
  const property = properties.find((p) => p.id === Number(params.id));
  if (!property) return notFound();

  return (
    <PropertyDetailClientLayout property={property}>
      {/* No children por ahora */}
      {null}
    </PropertyDetailClientLayout>
  );
}
