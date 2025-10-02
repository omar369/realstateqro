"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import { useState, useTransition } from "react";

export default function RowActions({ id }: { id: number }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [loading, setLoading] = useState(false);

  const onDelete = async () => {
    const ok = confirm(`Eliminar propiedad #${id}?`);
    if (!ok) return;
    try {
      setLoading(true);
      const res = await fetch(`/api/inmuebles/${id}`, {
        method: "DELETE",
        headers: {
          // quita esto cuando ya tengas auth real
          "x-admin-token": process.env.NEXT_PUBLIC_ADMIN_TOKEN ?? "",
        },
      });
      if (!res.ok) throw new Error("Error al eliminar");
      startTransition(() => router.refresh());
    } catch (e) {
      alert((e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-end gap-2">
      <Link href={`/dashboard/propiedades/${id}/editar`}>
        <Button variant="outline" size="sm">
          <Pencil className="mr-2 h-4 w-4" /> Editar
        </Button>
      </Link>
      <Button variant="destructive" size="sm" onClick={onDelete} disabled={pending || loading}>
        <Trash2 className="mr-2 h-4 w-4" /> Eliminar
      </Button>
    </div>
  );
}
