import { SPA_MASAJE_DATA } from "../../data/spaMasaje";
import { SectionShell } from "../ui/SectionShell";
import { SectionHeader } from "../ui/SectionHeader";
import { Button } from "../ui/Button";
import { Card } from "../ui/Card";

export function SpaMasaje() {
  return (
    <SectionShell id="spa-masaje" bg="white">
      <div className="max-w-5xl mx-auto">
        <SectionHeader {...SPA_MASAJE_DATA.header} />

        <Card className="p-10 md:p-14 space-y-10">
          {/* Beneficios */}
          <div className="grid md:grid-cols-3 gap-8">
            {SPA_MASAJE_DATA.beneficios.map((beneficio, index) => (
              <div key={index} className="text-center space-y-3">
                <div className="text-5xl">{beneficio.icono}</div>
                <h3 className="font-semibold text-lg text-(--color-text-primary)">{beneficio.titulo}</h3>
                <p className="text-sm text-(--color-text-secondary) leading-relaxed">
                  {beneficio.descripcion}
                </p>
              </div>
            ))}
          </div>

          {/* Precio y CTA */}
          <div className="border-t border-(--color-border) pt-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              <div>
                <div className="text-5xl md:text-6xl font-playfair font-semibold text-(--color-primary) mb-2">
                  {SPA_MASAJE_DATA.precio.cantidad}
                </div>
                <p className="text-sm text-(--color-text-secondary)">
                  {SPA_MASAJE_DATA.precio.detalle}
                </p>
                <p className="text-xs text-(--color-text-secondary) mt-1">
                  {SPA_MASAJE_DATA.precio.incluye}
                </p>
              </div>
              <Button {...SPA_MASAJE_DATA.cta} fullWidth={false} className="md:w-auto w-full" />
            </div>
          </div>
        </Card>
      </div>
    </SectionShell>
  );
}
