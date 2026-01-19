import { Testimonio } from "../../types/testimonios";
import { Card } from "./Card";

interface TestimonialCardProps {
  testimonio: Testimonio;
}

export function TestimonialCard({ testimonio }: TestimonialCardProps) {
  const estrellas = "⭐".repeat(testimonio.estrellas);

  return (
    <Card className="p-8 text-center space-y-5">
      <div className="text-3xl">{estrellas}</div>
      <p className="text-(--color-text-secondary) italic leading-relaxed">"{testimonio.texto}"</p>
      <p className="text-sm font-semibold text-(--color-text-primary)">— {testimonio.autor}</p>
    </Card>
  );
}
