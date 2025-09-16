import MainHero from "@/components/landing/MainHero"
import Footer from '@/components/landing/Footer'

export default function HomePage() {
  return (
    <>
    <MainHero />
    <section className="py-12 space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
          Encuentra tu hogar ideal
        </h1>
        <p className="max-w-md mx-auto text-muted-foreground">
          Explora nuestras propiedades exclusivas en renta o venta.
        </p>
        <button className="px-6 py-3 bg-black text-white rounded-md text-sm font-medium hover:bg-neutral-800">
          Ver Propiedades
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
        <div className="text-center space-y-2">
          <div className="text-2xl">🏡</div>
          <h3 className="font-semibold">Amplia Selección</h3>
          <p className="text-sm text-muted-foreground">Propiedades para todos los gustos y presupuestos.</p>
        </div>
        <div className="text-center space-y-2">
          <div className="text-2xl">📍</div>
          <h3 className="font-semibold">Ubicaciones Destacadas</h3>
          <p className="text-sm text-muted-foreground">Zonas privilegiadas con alta demanda.</p>
        </div>
        <div className="text-center space-y-2">
          <div className="text-2xl">💰</div>
          <h3 className="font-semibold">Fácil Financiamiento</h3>
          <p className="text-sm text-muted-foreground">Opciones flexibles de compra y renta.</p>
        </div>
      </div>
    </section>
      <Footer />
    </>
  )
}

