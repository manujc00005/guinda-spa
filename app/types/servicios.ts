export interface Precio {
  duracion: string;
  precio: string;
}

export interface Servicio {
  nombre: string;
  descripcion?: string;
  precio?: string;
  precios?: Precio[];
}

export interface CategoriaServicios {
  id: string;
  titulo: string;
  descripcion: string;
  servicios: Servicio[];
}

export interface ServicioDestacado {
  titulo: string;
  descripcion: string;
  precio: string;
}
