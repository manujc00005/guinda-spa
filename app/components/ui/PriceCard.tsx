import { ServicioDestacado } from "../../types/servicios";
import { Card } from "./Card";

interface PriceCardProps {
  servicio: ServicioDestacado;
}

export function PriceCard({ servicio }: PriceCardProps) {
  return (
    <Card className="p-8">
      <h3 className="text-xl font-playfair font-semibold text-(--color-text-primary) mb-3">
        {servicio.titulo}
      </h3>
      <p className="text-sm text-(--color-text-secondary) mb-5 leading-relaxed">{servicio.descripcion}</p>
      <div className="text-3xl font-playfair font-semibold text-(--color-primary)">{servicio.precio}</div>
    </Card>
  );
}
