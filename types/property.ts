export type Property = {
  id: number;
  titulo: string;
  direccion: string;
  tipoPropiedad: string;
  tipoOperacion: "venta" | "renta" | "traspaso";
  precio: number;
  habitaciones: number;
  banos: number;
  estacionamientos: number;
  metros: number;
  antiguedad: number;
  fecha: string;
  imagenes: string[];
  detalles: {
    descripcion: string;
    servicios: string[];
    adicionales: string[];
  };
};
