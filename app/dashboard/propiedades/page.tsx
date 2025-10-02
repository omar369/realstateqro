// Server Component
import Link from "next/link";
import { headers } from "next/headers";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import RowActions from "./row-actions";

type Property = {
  id: number;
  titulo: string;
  precio: number;
  ciudad?: string; // si no tienes, se omite
  tipoPropiedad: string;
  tipoOperacion: string;
  fecha: string; // "YYYY-MM-DD"
};

async function getBaseUrl() {
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host");
  const proto = h.get("x-forwarded-proto") ?? "http";
  return `${proto}://${host}`;
}

async function getProperties(): Promise<Property[]> {
  const base = await getBaseUrl();
  const res = await fetch(`${base}/api/inmuebles`, { cache: "no-store" });
  if (!res.ok) return [];
  const json = await res.json();
  return json.data ?? [];
}

export default async function PropertiesPage() {
  const data = await getProperties();

  return (
    <div className="mx-auto max-w-6xl p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">Propiedades</h1>
        <Link href="/dashboard/propiedades/nueva">
          <Button>Agregar propiedad</Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Listado</CardTitle>
        </CardHeader>
        <CardContent>
          {data.length === 0 ? (
            <p className="text-sm text-muted-foreground">No hay propiedades aún.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Título</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Operación</TableHead>
                  <TableHead>Precio</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell>{p.id}</TableCell>
                    <TableCell className="font-medium">{p.titulo}</TableCell>
                    <TableCell>{p.tipoPropiedad}</TableCell>
                    <TableCell>{p.tipoOperacion}</TableCell>
                    <TableCell>${p.precio.toLocaleString("es-MX")}</TableCell>
                    <TableCell>{p.fecha}</TableCell>
                    <TableCell className="text-right">
                      <RowActions id={p.id} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
