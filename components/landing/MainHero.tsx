'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import clsx from 'clsx'

type HeroItem = {
  title: string
  subtitle: string
  image: string
}

const items: HeroItem[] = [
  {
    title: 'Propiedades en Venta',
    subtitle: 'Explora casas, departamentos y terrenos en todo el país.',
    image: '/hero-venta.png',
  },
  {
    title: 'Propiedades en Renta',
    subtitle: 'Encuentra tu próximo hogar temporal con nosotros.',
    image: '/hero-renta.png',
  },
  {
    title: 'Cotiza con Nosotros',
    subtitle: 'Recibe asesoría gratuita y personalizada.',
    image: '/hero-cotiza.png',
  },
  {
    title: 'Contáctanos',
    subtitle: 'Estamos listos para ayudarte con lo que necesites.',
    image: '/hero-contacto.png',
  },
]

export default function MainHero() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [fade, setFade] = useState(true)

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false) // empieza fade out
      setTimeout(() => {
        setActiveIndex((prev) => (prev + 1) % items.length)
        setFade(true) // vuelve a hacer fade in
      }, 500) // espera que el fade-out termine
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  const current = items[activeIndex]

  return (
    <div className="relative h-[80vh] w-full overflow-hidden flex items-center justify-center text-center text-white">
      {/* Imagen de fondo */}
      <Image
        src={current.image}
        alt={current.title}
        fill
        className={clsx(
          'object-cover transition-opacity duration-1000',
          fade ? 'opacity-100' : 'opacity-0'
        )}
        priority
      />

      {/* Capa oscura encima de la imagen */}
      <div className="absolute inset-0 bg-black/50 z-10" />

      {/* Texto centrado */}
      <div className="z-20 px-4">
        <h1 className="text-3xl md:text-5xl font-bold mb-4 transition-opacity duration-500">
          {current.title}
        </h1>
        <p className="text-base md:text-lg text-white/90 max-w-xl mx-auto">
          {current.subtitle}
        </p>
      </div>
    </div>
  )
}

