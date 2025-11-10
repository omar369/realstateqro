'use client';

import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Home, Calendar, CheckSquare, Folder, PlusSquare, List } from 'lucide-react';
import Link from 'next/link';

export default function Sidebar() {
  return (
    <aside className="w-64 h-screen border-r bg-card flex flex-col">
      <div className="p-6">
        <h1 className="text-lg font-semibold tracking-tight">Admin Panel</h1>
      </div>

      <Separator />

      <ScrollArea className="flex-1">
        <nav className="flex flex-col space-y-1 p-4">
          <SidebarLink href="/dashboard" icon={<Home size={18} />} label="Panel" />
          <SidebarLink href="/dashboard/agenda" icon={<Calendar size={18} />} label="Agenda" />
          <SidebarLink href="/dashboard/tareas" icon={<CheckSquare size={18} />} label="Tareas" />
          <SidebarLink href="/dashboard/explorador" icon={<Folder size={18} />} label="Explorador" />

          <Separator className="my-4" />
          <p className="text-xs font-medium text-muted-foreground mb-2">
            Administrar inmuebles
          </p>

          <SidebarLink href="/dashboard/inmuebles/nuevo" icon={<PlusSquare size={18} />} label="Crear nuevo" />
          <SidebarLink href="/dashboard/inmuebles" icon={<List size={18} />} label="Listado completo" />
        </nav>
      </ScrollArea>

      <div className="p-4">
        <Button variant="secondary" className="w-full">
          Cerrar sesión
        </Button>
      </div>
    </aside>
  );
}

function SidebarLink({
  href,
  icon,
  label,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-muted transition-colors"
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
}

