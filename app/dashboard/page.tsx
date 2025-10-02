import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";

export default async function DashboardPage() {
  return (
    <div className="mx-auto max-w-5xl p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
        <Link href="/dashboard/propiedades">
          <Button>
            <Home className="mr-2 h-4 w-4" />
            Ver propiedades
          </Button>
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Propiedades</CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-bold">—</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Leads</CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-bold">—</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Publicadas</CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-bold">—</CardContent>
        </Card>
      </div>
    </div>
  );
}
