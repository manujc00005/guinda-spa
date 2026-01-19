// components/sections/Nosotros.tsx
import { NAVIGATION } from "../../data/navigation";
import { ABOUT } from "../../data/about";

export function Nosotros() {
  return (
    <section id="nosotros" className="scroll-mt-28 py-16 md:py-24">
      <div className="container-page">
        <div className="grid items-start gap-10 md:grid-cols-12 md:gap-12">
          {/* Texto */}
          <div className="md:col-span-6">
            <div className="space-y-4">
              <p className="text-xs tracking-[0.22em] uppercase text-stone-500">
                {ABOUT.kicker}
              </p>
              <h2 className="font-playfair text-3xl leading-tight text-stone-900 md:text-4xl">
                {ABOUT.title}
              </h2>
              <p className="text-stone-600 leading-relaxed">
                {ABOUT.subtitle}
              </p>
            </div>

            <div className="mt-8 space-y-4">
              {ABOUT.paragraphs.map((p) => (
                <p key={p} className="text-sm md:text-base text-stone-700 leading-relaxed">
                  {p}
                </p>
              ))}
            </div>

            <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
              <a className="btn-primary" href={ABOUT.primaryCta.href}>
                {ABOUT.primaryCta.label}
              </a>
              <a className="btn-outline" href={ABOUT.secondaryCta.href}>
                {ABOUT.secondaryCta.label}
              </a>
            </div>
          </div>

          {/* Tarjeta premium */}
          <div className="md:col-span-6">
            <div className="card overflow-hidden">
              {/* “Credenciales” */}
              <div className="p-6 md:p-8">
                <div className="flex items-center justify-between gap-6">
                  <div>
                    <p className="text-xs uppercase tracking-[0.22em] text-stone-500">
                      {ABOUT.card.kicker}
                    </p>
                    <p className="mt-2 font-playfair text-2xl text-stone-900">
                      {ABOUT.card.title}
                    </p>
                  </div>

                  <div className="rounded-full border border-stone-200 bg-white px-4 py-2 text-xs text-stone-600">
                    {ABOUT.card.badge}
                  </div>
                </div>

                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  {ABOUT.highlights.map((h) => (
                    <div
                      key={h.title}
                      className="rounded-2xl border border-stone-100 bg-stone-50 p-5"
                    >
                      <p className="text-sm font-semibold text-stone-900">
                        {h.title}
                      </p>
                      <p className="mt-2 text-sm text-stone-600 leading-relaxed">
                        {h.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* “Firma” / nota */}
              <div className="border-t border-stone-100 bg-white px-6 py-5 md:px-8">
                <p className="text-sm text-stone-700">
                  <span className="font-semibold text-stone-900">{ABOUT.signature.title}</span>{" "}
                  {ABOUT.signature.text}
                </p>
              </div>
            </div>

            {/* Micro confianza */}
            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              {ABOUT.trust.map((t) => (
                <div
                  key={t.label}
                  className="rounded-2xl border border-stone-100 bg-white px-4 py-4 text-center"
                >
                  <p className="font-playfair text-2xl text-stone-900">{t.value}</p>
                  <p className="mt-1 text-xs uppercase tracking-[0.18em] text-stone-500">
                    {t.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
