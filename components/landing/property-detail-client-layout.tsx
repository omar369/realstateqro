"use client";

import { useState } from "react";
import Image from "next/image";
import {
  BedDoubleIcon,
  BathIcon,
  CarIcon,
  ExpandIcon,
  CalendarIcon,
} from "lucide-react";

import { ImageGalleryCarousel } from "./image-gallery-carousel";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function PropertyDetailClientLayout({
  property,
  children,
}: {
  property: any;
  children: React.ReactNode;
}) {
  const [showGallery, setShowGallery] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const handleImageClick = (index: number) => {
    setSelectedImageIndex(index);
    setShowGallery(true);
  };

  const groupedFeatures = [
    { label: "Más ambientes", key: "ambientes" },
    { label: "Servicios", key: "servicios" },
    { label: "Amenidades", key: "amenidades" },
    { label: "Exteriores", key: "exteriores" },
    { label: "Extras", key: "extras" },
    { label: "Detalles del inmueble", key: "detalles" },
  ];

  const renderBadges = (items: string[] = []) => (
    <div className="flex flex-wrap gap-2 pt-2">
      {items.map((item, idx) => (
        <Badge
          key={idx}
          className="text-md rounded-md px-3 py-1 bg-muted text-muted-foreground "
        >
          {item}
        </Badge>
      ))}
    </div>
  );

  const renderDetalles = () => {
    const {
      estadoConservacion,
      balcon,
      elevador,
      bodega,
      nivelesConstruidos,
      estanciaMinima,
      disponibilidad,
    } = property.detalles || {};

    const detallesList = [
      estadoConservacion && `Estado: ${estadoConservacion}`,
      balcon >= 0 && `Balcón: ${balcon}`,
      elevador >= 0 && `Elevador: ${elevador}`,
      bodega >= 0 && `Bodega: ${bodega}`,
      nivelesConstruidos >= 0 && `Niveles: ${nivelesConstruidos}`,
      estanciaMinima >= 0 && `Estancia mínima: ${estanciaMinima} días`,
      disponibilidad && `Disponibilidad: ${disponibilidad}`,
    ].filter(Boolean) as string[];

    return renderBadges(detallesList);
  };

  return (
    <main className="max-w-5xl mx-auto px-4 py-12 space-y-10">
      {/* Galería de imágenes */}
      <div className="grid md:grid-cols-5 gap-4">
        <div
          className="md:col-span-3 cursor-pointer"
          onClick={() => handleImageClick(0)}
        >
          <Image
            src={property.imagenes[0]}
            alt={property.titulo}
            width={800}
            height={500}
            className="w-full h-64 rounded-lg object-cover object-center cursor-pointer"
          />
        </div>
        <div className="md:col-span-2 grid grid-cols-2 gap-2">
          {property.imagenes.slice(1,5).map((img, index) => (
            <Image
              key={index}
              src={img}
              alt={`Imagen ${index + 2}`}
              width={400}
              height={200}
              className="w-full h-32 rounded-md object-cover object-center cursor-pointer"
              onClick={() => handleImageClick(index + 1)}
            />
          ))}
        </div>
      </div>

      {/* Dialog carrusel */}
      <ImageGalleryCarousel
        images={property.imagenes}
        open={showGallery}
        onClose={() => setShowGallery(false)}
        initialSlide={selectedImageIndex}
      />

      {/* Info general */}
      <div className="space-y-2">
        <h2 className="text-3xl font-bold">{property.titulo}</h2>
        <p className="text-muted-foreground">{property.direccion}</p>
        <p className="text-2xl font-semibold text-primary">
          ${property.precio.toLocaleString()}
        </p>
        <div className="flex flex-wrap gap-6 pt-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <BedDoubleIcon className="w-4 h-4" /> {property.habitaciones}
          </div>
          <div className="flex items-center gap-1">
            <BathIcon className="w-4 h-4" /> {property.banos}
          </div>
          {property.estacionamientos !== undefined && (
            <div className="flex items-center gap-1">
              <CarIcon className="w-4 h-4" /> {property.estacionamientos}
            </div>
          )}
          <div className="flex items-center gap-1">
            <ExpandIcon className="w-4 h-4" /> {property.metros} m²
          </div>
          {property.antiguedad && (
            <div className="flex items-center gap-1">
              <CalendarIcon className="w-4 h-4" /> {property.antiguedad} años
            </div>
          )}
        </div>

        {/* Descripción */}
        <div className="pt-6 text-base leading-relaxed text-gray-800 dark:text-gray-200">
          {property.descripcion}
        </div>
      </div>

      {/* Acordeón con detalles extra */}
      <div>
        <Accordion type="multiple" className="w-full space-y-2">
          {groupedFeatures.map(({ label, key }) => (
            <AccordionItem key={key} value={key}>
              <AccordionTrigger>{label}</AccordionTrigger>
              <AccordionContent>
                {key === "detalles"
                  ? renderDetalles()
                  : renderBadges(property[key])}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>

      {/* Slot para futuras secciones */}
      <div>{children}</div>
    </main>
  );
}
