'use client';

import PropertyForm from './PropertyForm';
import { Card } from '@/components/ui/card';

export default function NuevoInmueblePage() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold">Crear nuevo inmueble</h1>

      <Card className="p-6">
        <PropertyForm />
      </Card>
    </div>
  );
}

