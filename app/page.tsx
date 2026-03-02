import { Header } from "./components/layout/Header";
import { Footer } from "./components/layout/Footer";
import { Hero } from "./components/sections/Hero";
import { ExperienciasPremium } from "./components/sections/ExperienciasPremium";
import { Diferenciadores } from "./components/sections/Diferenciadores";
import { Servicios } from "./components/sections/Servicios";
import { Packs } from "./components/sections/Packs";
import { Opiniones } from "./components/sections/Opiniones";
import { CtaFinal } from "./components/sections/CtaFinal";
import { Faq } from "./components/sections/Faq";
import { Reservar } from "./components/sections/Reservar";

/**
 * LANDING PAGE — ESTRUCTURA PREMIUM
 *
 * Flujo psicológico de conversión:
 * 1. Hero → Deseo (headline + trust badges)
 * 2. Experiencias Premium → Decisión (3 cards con pareja/spa/combo)
 * 3. Diferenciadores → Confianza (privado, cava, hotel, todo incluido)
 * 4. Servicios → Profundidad (categorías con tabs)
 * 5. Packs → Upsell (regalo / ocasión especial)
 * 6. Opiniones → Validación social
 * 7. CTA Final → Última llamada emocional
 * 8. FAQ → Resolver objeciones
 * 9. Reservar → Acción
 * 10. Footer → Cierre profesional
 */

export default function Home() {
  return (
    <div className="min-h-screen">
      <Header />
      <Hero />
      <ExperienciasPremium />
      <Diferenciadores />
      <Servicios />
      <Packs />
      <Opiniones />
      <CtaFinal />
      <Faq />
      <Reservar />
      <Footer />
    </div>
  );
}
