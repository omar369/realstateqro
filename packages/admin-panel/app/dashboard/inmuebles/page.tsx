'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import Link from 'next/link';

interface Property {
  id: number;
  titulo: string;
  direccion: string;
  tipoPropiedad: string;
  tipoOperacion: string;
  precio: number;
  ciudad?: string;
  createdAt: string;
}

export default function InmueblesPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProperties() {
      try {
        const res = await fetch('/api/properties');
        const data = await res.json();
        if (data.success) {
          setProperties(data.data);
        } else {
          console.error('Error:', data.error);
        }
      } catch (err) {
        console.error('Error al cargar propiedades:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchProperties();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full p-10">
        <p className="text-muted-foreground">Cargando propiedades...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Listado de Inmuebles</h1>
        <Link href="/dashboard/inmuebles/nuevo">
          <Button>+ Nuevo inmueble</Button>
        </Link>
      </div>

      {properties.length === 0 ? (
        <Card className="p-8 text-center text-muted-foreground">
          No hay propiedades registradas aún.
        </Card>
      ) : (
        <ScrollArea className="rounded-md border">
          <table className="w-full text-sm">
            <thead className="bg-muted/40">
              <tr className="text-left">
                <th className="px-4 py-2">Título</th>
                <th className="px-4 py-2">Tipo</th>
                <th className="px-4 py-2">Operación</th>
                <th className="px-4 py-2">Precio</th>
                <th className="px-4 py-2">Fecha</th>
                <th className="px-4 py-2 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {properties.map((p) => (
                <tr key={p.id} className="border-b hover:bg-muted/20">
                  <td className="px-4 py-2 font-medium">{p.titulo}</td>
                  <td className="px-4 py-2">{p.tipoPropiedad}</td>
                  <td className="px-4 py-2">{p.tipoOperacion}</td>
                  <td className="px-4 py-2">${p.precio.toLocaleString()}</td>
                  <td className="px-4 py-2">
                    {new Date(p.createdAt).toLocaleDateString('es-MX')}
                  </td>
                  <td className="px-4 py-2 text-right">
                    <div className="flex justify-end gap-2">
                      <Link href={`/dashboard/inmuebles/${p.id}`}>
                        <Button variant="outline" size="sm">
                          Ver
                        </Button>
                      </Link>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => console.log('Eliminar', p.id)}
                      >
                        Eliminar
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </ScrollArea>
      )}
    </div>
  );
}

