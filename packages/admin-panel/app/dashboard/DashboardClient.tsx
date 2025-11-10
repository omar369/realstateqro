"use client";

import { useEffect } from "react";
import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Session } from "next-auth";

interface DashboardClientProps {
  session: Session;
}

export default function DashboardClient({ session }: DashboardClientProps) {
  useEffect(() => {
    async function testDBConnection() {
      try {
        const res = await fetch("/api/properties");
        const data = await res.json();
        console.log("🔗 Conexión a DB OK:", data);
      } catch (error) {
        console.error("❌ Error al conectar a la DB:", error);
      }
    }
    testDBConnection();
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Header superior */}
      <header className="p-6 border-b bg-card shadow-sm">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <p className="text-muted-foreground">
          Bienvenido, <strong>{session.user?.name}</strong> —{" "}
          {session.user?.email}
        </p>
      </header>

      {/* Contenido principal */}
      <main className="flex-1 p-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 9 }).map((_, i) => (
            <Card
              key={i}
              className="flex items-center justify-center h-40 text-muted-foreground"
            >
              Widget {i + 1}
            </Card>
          ))}
        </div>
      </main>

      {/* Footer / logout */}
      <footer className="p-6 border-t bg-card flex justify-center">
        <Button onClick={() => signOut()} variant="secondary">
          Cerrar sesión
        </Button>
      </footer>
    </div>
  );
}
