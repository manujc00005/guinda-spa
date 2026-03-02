import { CTA_FINAL_DATA } from "../../data/ctaFinal";

/**
 * CTA FINAL POTENTE
 *
 * Última sección antes de FAQ y footer.
 * Copy emocional, imagen de fondo, doble CTA.
 * Cierra el loop de conversión para usuarios que han scrolleado todo.
 */

export function CtaFinal() {
  return (
    <section className="relative py-24 md:py-32 overflow-hidden">
      {/* Background image with overlay */}
      <div className="absolute inset-0 z-0">
        <div
          className="w-full h-full bg-cover bg-center"
          style={{
            backgroundImage: `url(${CTA_FINAL_DATA.imagen})`,
            filter: "brightness(0.4)",
          }}
          role="img"
          aria-label="Interior del spa Guinda Wellness"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-(--color-primary)/60 to-(--color-primary)/30" />
      </div>

      {/* Content */}
      <div className="relative z-10 container-page text-center max-w-3xl mx-auto">
        {/* Eyebrow */}
        <span className="inline-block text-xs tracking-[0.2em] uppercase text-(--color-gold-light) mb-5 font-medium">
          {CTA_FINAL_DATA.eyebrow}
        </span>

        {/* Headline */}
        <h2 className="text-3xl md:text-5xl lg:text-6xl font-playfair font-semibold text-white leading-tight mb-6">
          {CTA_FINAL_DATA.titulo}
        </h2>

        {/* Description */}
        <p className="text-base md:text-lg text-white/85 font-light max-w-xl mx-auto leading-relaxed mb-10">
          {CTA_FINAL_DATA.descripcion}
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href={CTA_FINAL_DATA.ctaPrimario.href}
            className="btn-primary px-10 py-4 text-base w-full sm:w-auto"
          >
            {CTA_FINAL_DATA.ctaPrimario.label}
          </a>
          <a
            href={CTA_FINAL_DATA.ctaSecundario.href}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-10 py-4 text-base rounded-full font-medium border border-white/30 text-white bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all w-full sm:w-auto"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
            </svg>
            {CTA_FINAL_DATA.ctaSecundario.label}
          </a>
        </div>
      </div>
    </section>
  );
}
