import { PACKS_DATA } from "../../data/packs";
import { SectionShell } from "../ui/SectionShell";
import { SectionHeader } from "../ui/SectionHeader";
import { Card } from "../ui/Card";

export function Packs() {
  return (
    <SectionShell id="packs" bg="white">
      <div className="max-w-5xl mx-auto">
        <SectionHeader {...PACKS_DATA.header} />

        <div className="space-y-6">
          {PACKS_DATA.packs.map((pack, index) => (
            <Card key={index} className="p-10 md:p-12">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
                <div className="flex-1">
                  <h3 className="text-2xl md:text-3xl font-playfair font-semibold text-(--color-text-primary) mb-3">
                    {pack.titulo}
                  </h3>
                  <p className="text-(--color-text-secondary) mb-4 leading-relaxed">
                    {pack.descripcion}
                  </p>
                  <div className="flex items-baseline gap-3">
                    <span className="text-5xl font-playfair font-semibold text-(--color-primary)">
                      {pack.precio}
                    </span>
                    {pack.detalle && (
                      <span className="text-(--color-text-secondary)">{pack.detalle}</span>
                    )}
                  </div>
                </div>
                <a
                  href={pack.ctaHref}
                  className="btn-outline px-8 py-4 text-sm whitespace-nowrap"
                >
                  {pack.ctaLabel}
                </a>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </SectionShell>
  );
}
