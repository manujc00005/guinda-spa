import { HERO_DATA } from "../../data/hero";
import { Button } from "../ui/Button";

export function Hero() {
  return (
    <section id="inicio" className="relative min-h-screen flex items-center justify-center pt-20">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src={HERO_DATA.imagen.src}
          alt={HERO_DATA.imagen.alt}
          className="w-full h-full object-cover"
          style={{ filter: "brightness(0.65)" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/10 to-black/30"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 container-page max-w-4xl text-center py-32">
        <div className="space-y-8">
          {/* Eyebrow */}
          <div className="inline-flex items-center px-6 py-2 rounded-full bg-white/20 backdrop-blur-md border border-white/30">
            <span className="text-xs tracking-[0.2em] uppercase text-white/95 font-medium">
              {HERO_DATA.eyebrow}
            </span>
          </div>

          {/* Title */}
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-playfair font-semibold text-white leading-tight whitespace-pre-line">
            {HERO_DATA.titulo}
          </h1>

          {/* Description */}
          <p className="text-lg md:text-xl text-white/95 font-light max-w-2xl mx-auto leading-relaxed">
            {HERO_DATA.descripcion}
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            {HERO_DATA.ctas.map((cta) => (
              <Button key={cta.href} {...cta} fullWidth={true} className="sm:w-auto" />
            ))}
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 animate-bounce">
        <div className="w-px h-16 bg-white/40"></div>
      </div>
    </section>
  );
}
