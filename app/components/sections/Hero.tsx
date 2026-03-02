import { HERO_DATA } from "../../data/hero";
import { Button } from "../ui/Button";

/**
 * HERO ESTRATÉGICO PREMIUM
 *
 * Evolución del hero original:
 * - Headline con ubicación hotel (diferenciador inmediato)
 * - Subheadline sensorial que lista lo tangible
 * - CTA principal + CTA secundario "Experiencia en Pareja" (ticket alto)
 * - Trust badges: Hotel · Rating · Privacidad
 * - Imagen placeholder preparada
 */

function TrustIcon({ icon }: { icon: string }) {
  switch (icon) {
    case "hotel":
      return (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 0h.008v.008h-.008V7.5z" />
        </svg>
      );
    case "star":
      return (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      );
    case "lock":
      return (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
        </svg>
      );
    default:
      return null;
  }
}

export function Hero() {
  return (
    <section id="inicio" className="relative min-h-[100svh] flex items-center justify-center pt-20">
      {/* Background Image with premium overlay */}
      <div className="absolute inset-0 z-0">
        {/* Placeholder: reemplazar con /images/hero/hero-spa-private.jpg */}
        <div
          className="w-full h-full bg-cover bg-center"
          style={{
            backgroundImage: `url(${HERO_DATA.imagen.src})`,
            filter: "brightness(0.55)",
          }}
          role="img"
          aria-label={HERO_DATA.imagen.alt}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/50" />
      </div>

      {/* Content */}
      <div className="relative z-10 container-page max-w-4xl text-center py-24 md:py-32">
        <div className="space-y-7 md:space-y-8">
          {/* Eyebrow badge */}
          <div className="animate-fade-in inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/15 backdrop-blur-md border border-white/25">
            <div className="w-1.5 h-1.5 rounded-full bg-(--color-gold)" />
            <span className="text-[11px] tracking-[0.2em] uppercase text-white/95 font-medium">
              {HERO_DATA.eyebrow}
            </span>
          </div>

          {/* Headline */}
          <h1 className="animate-fade-in-up text-[2.5rem] md:text-6xl lg:text-7xl font-playfair font-semibold text-white leading-[1.1] whitespace-pre-line">
            {HERO_DATA.titulo}
          </h1>

          {/* Subheadline */}
          <p className="animate-fade-in-up animate-delay-100 text-base md:text-lg text-white/90 font-light max-w-xl mx-auto leading-relaxed">
            {HERO_DATA.descripcion}
          </p>

          {/* CTAs */}
          <div className="animate-fade-in-up animate-delay-200 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 pt-2">
            {HERO_DATA.ctas.map((cta) => (
              <Button key={cta.label} {...cta} fullWidth={true} className="sm:w-auto" />
            ))}
          </div>

          {/* Trust badges */}
          <div className="animate-fade-in-up animate-delay-300 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 pt-6">
            {HERO_DATA.trust.map((item, index) => (
              <div key={item.label} className="flex items-center gap-2 text-white/70">
                <TrustIcon icon={item.icon} />
                <span className="text-xs tracking-wide font-medium">{item.label}</span>
                {index < HERO_DATA.trust.length - 1 && (
                  <span className="hidden sm:inline text-white/30 ml-4">|</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll Indicator — premium minimal */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10">
        <div className="flex flex-col items-center gap-2 animate-bounce">
          <span className="text-[10px] tracking-[0.15em] uppercase text-white/50 font-medium">Descubre</span>
          <svg className="w-4 h-4 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
          </svg>
        </div>
      </div>
    </section>
  );
}
