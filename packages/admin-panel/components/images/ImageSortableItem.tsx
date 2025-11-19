import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { ImageItem } from "./types";

type Props = {
  item: ImageItem;
  onRemove: (id: string) => void;
  onRetry?: (id: string) => void;
  disabled?: boolean;
};

export default function ImageSortableItem({
  item,
  onRemove,
  onRetry,
  disabled,
}: Props) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id, disabled });
  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : undefined,
  };

  const src = item.previewUrl ?? item.publicUrl ?? "";
  // no-op

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`relative aspect-square overflow-hidden rounded-md border bg-muted/20
          ${isDragging ? "ring-2 ring-primary" : ""}`}
      {...attributes}
      {...listeners}
    >
      {src ? (
        <img
          src={src}
          alt={item.file?.name || item.key || "Imagen"}
          className="h-full w-full object-cover"
          draggable={false}
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center text-xs text-muted-foreground">
          Sin vista previa
        </div>
      )}

      {/* Estado: uploading */}
      {item.status === "uploading" && (
        <div className="absolute inset-0 bg-black/35 flex items-center justify-center">
          <span className="text-white text-xs">Subiendo…</span>
        </div>
      )}

      {/* Estado: error */}
      {item.status === "error" && (
        <div className="absolute inset-x-0 bottom-0 bg-red-600/90 text-white text-xs px-2 py-1 flex items-center justify-between gap-2">
          <span className="truncate">{item.error || "Error al subir"}</span>
          {onRetry && (
            <button
              type="button"
              onClick={() => onRetry(item.id)}
              className="rounded bg-white/20 px-2 py-0.5 text-xs hover:bg-white/30"
            >
              Reintentar
            </button>
          )}
        </div>
      )}

      {/* Eliminar */}
      <button
        type="button"
        onClick={() => onRemove(item.id)}
        className="absolute right-1 top-1 rounded bg-black/40 px-2 py-1 text-xs text-white hover:bg-black/60"
        aria-label="Eliminar imagen"
      >
        Eliminar
      </button>
    </div>
  );
}
