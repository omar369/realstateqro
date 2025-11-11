import { Suspense } from "react";
import ClientInmueblesPage from "@landing/components/landing/client-inmuebles-page";

export default function InmueblesPage() {
  return (
    <Suspense fallback={<div>Cargando propiedades...</div>}>
      <ClientInmueblesPage />
    </Suspense>
  );
}
