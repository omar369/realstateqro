import { notFound } from "next/navigation";
import { properties } from "@landing/data/properties";
import PropertyDetailClientLayout from "@landing/components/landing/property-detail-client-layout";

type PropertyPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function PropertyPage({ params }: PropertyPageProps) {
  const { id } = await params;
  const property = properties.find((p) => p.id === Number(id));
  if (!property) return notFound();

  return (
    <PropertyDetailClientLayout property={property}>
      {/* No children por ahora */}
      {null}
    </PropertyDetailClientLayout>
  );
}
