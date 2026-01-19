import { Header } from "./components/layout/Header";
import { Footer } from "./components/layout/Footer";
import { Hero } from "./components/sections/Hero";
import { SpaMasaje } from "./components/sections/SpaMasaje";
import { Servicios } from "./components/sections/Servicios";
import { Packs } from "./components/sections/Packs";
import { Galeria } from "./components/sections/Galeria";
import { Opiniones } from "./components/sections/Opiniones";
import { Faq } from "./components/sections/Faq";
import { Reservar } from "./components/sections/Reservar";
import { Nosotros } from "./components/sections/Nosotros";

export default function Home() {
  return (
    <div className="min-h-screen">
      <Header />
      <Hero />
      <Nosotros /> 
      <SpaMasaje />
      <Servicios />
      <Packs />
      <Galeria />
      <Opiniones />
      <Faq />
      <Reservar />
      <Footer />
    </div>
  );
}
