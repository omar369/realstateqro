import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import NewForm from "./new-form";

export default function NuevaPropiedadPage() {
  return (
    <div className="mx-auto max-w-4xl p-6">
      <Card>
        <CardHeader>
          <CardTitle>Nuevo anuncio</CardTitle>
        </CardHeader>
        <CardContent>
          <NewForm />
        </CardContent>
      </Card>
    </div>
  );
}
