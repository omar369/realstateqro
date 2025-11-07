'use client';

import { useSession, signOut } from 'next-auth/react';
import { Button } from '@/components/ui/button';

export default function Dashboard() {
  const { data: session } = useSession();

  return (
    <div className='flex flex-col items-center justify-center min-h-screen bg-background'>
      <div className='p-6 space-y-4 bg-card rounded-xl shadow-lg text-center'>
        <h1 className='text-2xl font-semibold'>Dashboard</h1>
        {session ? (
          <div>
            <p>
              Bienvenido, <strong>{session.user?.name}</strong>!
            </p>
            <p>
              Correo: <strong>{session.user?.email}</strong>
            </p>
            <Button onClick={() => signOut()} className='mt-4'>
              Cerrar sesión
            </Button>
          </div>
        ) : (
          <p>Cargando sesión...</p>
        )}
      </div>
    </div>
  );
}
