import { Header } from "../components/layout/Header";
import { Footer } from "../components/layout/Footer";
import { Hero } from "../components/sections/Hero";
import { ExperienciasPremium } from "../components/sections/ExperienciasPremium";
import { Diferenciadores } from "../components/sections/Diferenciadores";
import { Servicios } from "../components/sections/Servicios";
import { Packs } from "../components/sections/Packs";
import { Opiniones } from "../components/sections/Opiniones";
import { CtaFinal } from "../components/sections/CtaFinal";
import { Faq } from "../components/sections/Faq";
import { Reservar } from "../components/sections/Reservar";

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
