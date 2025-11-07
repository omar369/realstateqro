"use client";

import * as React from "react";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogHeader,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

interface Props {
  images: string[];
  open: boolean;
  initialSlide?: number;
  onClose: () => void;
}

export function ImageGalleryCarousel({
  images,
  open,
  initialSlide = 0,
  onClose,
}: Props) {
  const [startIndex, setStartIndex] = React.useState(initialSlide);

  React.useEffect(() => {
    if (open) {
      setStartIndex(initialSlide);
    }
  }, [open, initialSlide]);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl w-full">
        <DialogHeader>
          <DialogTitle>Galería de Imágenes</DialogTitle>
          <DialogDescription>
            Desliza para ver todas las fotos del inmueble
          </DialogDescription>
        </DialogHeader>
        <Carousel
          opts={{
            startIndex,
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent>
            {images.map((src, idx) => (
              <CarouselItem
                key={idx}
                className="flex justify-center items-center"
              >
                <div className="relative w-full h-[70vh]">
                  <Image
                    src={src}
                    alt={`Imagen ${idx + 1}`}
                    fill
                    className="object-contain rounded-lg"
                    priority={idx === 0}
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </DialogContent>
    </Dialog>
  );
}
