"use client";

import { useState, useEffect } from "react";

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleCategory = (category: string) => {
    setActiveCategory(activeCategory === category ? null : category);
  };

  return (
    <div className="min-h-screen bg-stone-50">
      {/* HEADER PROFESIONAL STICKY */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white/98 backdrop-blur-xl border-b border-stone-200 py-3 shadow-soft"
            : "bg-white/90 backdrop-blur-lg py-4"
        }`}
      >
        <div className="container mx-auto px-5 max-w-7xl">
          <nav className="flex items-center justify-between h-12">
            {/* Logo */}
            <a 
              href="#" 
              className="text-xl md:text-2xl font-playfair font-semibold text-stone-900 tracking-tight hover:text-primary transition-colors"
            >
              Guinda Wellnes & Spa
            </a>

            {/* Desktop CTA */}
            <a
              href="#reservar"
              className="hidden md:inline-flex items-center justify-center px-8 py-3 bg-primary text-white text-sm font-medium tracking-wide rounded-full hover:bg-primary-hover hover:shadow-soft transition-all"
            >
              Reservar
            </a>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden p-2 text-stone-900 hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-lg"
              aria-label="Menú"
              aria-expanded={menuOpen}
            >
              {menuOpen ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </nav>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-white border-b border-stone-200 shadow-premium">
            <div className="container mx-auto px-5 py-5 space-y-1 max-w-7xl">
              <a 
                href="#servicios" 
                onClick={() => setMenuOpen(false)} 
                className="block py-3 px-4 text-stone-700 text-sm hover:bg-stone-50 hover:text-primary rounded-lg transition-all"
              >
                Servicios
              </a>
              <a 
                href="#experiencias" 
                onClick={() => setMenuOpen(false)} 
                className="block py-3 px-4 text-stone-700 text-sm hover:bg-stone-50 hover:text-primary rounded-lg transition-all"
              >
                Experiencias
              </a>
              <a 
                href="#contacto" 
                onClick={() => setMenuOpen(false)} 
                className="block py-3 px-4 text-stone-700 text-sm hover:bg-stone-50 hover:text-primary rounded-lg transition-all"
              >
                Contacto
              </a>
              <a
                href="#reservar"
                onClick={() => setMenuOpen(false)}
                className="block w-full text-center px-6 py-3.5 bg-primary text-white text-sm rounded-full mt-4 hover:bg-primary-hover transition-all font-medium"
              >
                Reservar Ahora
              </a>
            </div>
          </div>
        )}
      </header>

      {/* HERO MINIMALISTA */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=1600&auto=format&fit=crop&q=85"
            alt="Spa wellness"
            className="w-full h-full object-cover"
            style={{ filter: "brightness(0.65)" }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/10 to-black/30"></div>
        </div>

        <div className="relative z-10 container mx-auto px-5 text-center pt-32 pb-24 max-w-4xl">
          <div className="space-y-7 animate-fade-in">
            <div className="inline-flex items-center px-6 py-2 rounded-full bg-white/20 backdrop-blur-md border border-white/30">
              <span className="text-[11px] tracking-[0.2em] uppercase text-white/95 font-medium">
                Wellness Premium
              </span>
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-playfair font-semibold text-white leading-[1.05]">
              Espacio de calma
            </h1>

            <p className="text-lg md:text-xl text-white/95 font-light max-w-2xl mx-auto leading-relaxed">
              Desconecta y renuévate en un refugio diseñado para tu bienestar
            </p>

            <div className="pt-6">
              <a
                href="#servicios"
                className="inline-flex items-center justify-center px-10 py-4 bg-primary text-white text-base font-medium tracking-wide rounded-full hover:bg-primary-hover hover:scale-105 hover:shadow-premium transition-all"
              >
                Explorar servicios
              </a>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 animate-bounce">
          <div className="w-px h-16 bg-white/40"></div>
        </div>
      </section>

      {/* CIRCUITO SPA - DESTACADO */}
      <section className="py-20 md:py-28 bg-white">
        <div className="container mx-auto px-5 max-w-5xl">
          <div className="text-center mb-14">
            <span className="inline-block text-[11px] tracking-[0.2em] uppercase text-stone-600 mb-4 font-medium">
              Experiencia Exclusiva
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-playfair font-semibold text-stone-900 mb-6 leading-tight">
              Circuito Spa Privado
            </h2>
            <p className="text-base md:text-lg text-stone-600 font-light max-w-2xl mx-auto leading-relaxed">
              Disfruta de 60 minutos en total privacidad: jacuzzi, sauna finlandesa y baño turco
            </p>
          </div>

          <div className="bg-stone-50 rounded-3xl p-8 md:p-12 border border-stone-100 hover:shadow-premium transition-shadow">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
              <div className="flex-1">
                <h3 className="text-2xl md:text-3xl font-playfair font-semibold text-stone-900 mb-3">Circuito Completo</h3>
                <p className="text-base text-stone-600 font-light mb-5">Jacuzzi • Sauna • Baño Turco</p>
                <div className="flex items-baseline gap-3">
                  <span className="text-5xl md:text-6xl font-playfair font-semibold text-primary">75€</span>
                  <span className="text-base text-stone-600 font-light">60 minutos</span>
                </div>
              </div>
              <a
                href="#reservar"
                className="inline-flex items-center justify-center px-9 py-4 bg-primary text-white text-base font-medium rounded-full hover:bg-primary-hover hover:shadow-soft hover:scale-105 transition-all"
              >
                Reservar circuito
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* SERVICIOS PRINCIPALES */}
      <section id="servicios" className="py-20 md:py-28 bg-stone-100">
        <div className="container mx-auto px-5 max-w-5xl">
          <div className="text-center mb-16">
            <span className="inline-block text-[11px] tracking-[0.2em] uppercase text-stone-600 mb-4 font-medium">
              Nuestros Servicios
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-playfair font-semibold text-stone-900 mb-6 leading-tight">
              Carta de tratamientos
            </h2>
            <p className="text-base md:text-lg text-stone-600 font-light max-w-2xl mx-auto leading-relaxed">
              Cada servicio está diseñado para restaurar tu equilibrio
            </p>
          </div>

          <div className="space-y-5">
            {/* MASAJES TERAPÉUTICOS */}
            <div className="bg-white rounded-3xl overflow-hidden shadow-soft hover:shadow-premium transition-shadow">
              <button
                onClick={() => toggleCategory("masajes")}
                className="w-full p-7 md:p-9 flex items-center justify-between text-left group"
                aria-expanded={activeCategory === "masajes"}
              >
                <div className="flex-1 pr-4">
                  <h3 className="text-2xl md:text-3xl font-playfair font-semibold text-stone-900 mb-2 group-hover:text-primary transition-colors">
                    Masajes Terapéuticos
                  </h3>
                  <p className="text-sm md:text-base text-stone-600 font-light">Técnicas especializadas para tu bienestar</p>
                </div>
                <svg
                  className={`w-6 h-6 text-stone-600 flex-shrink-0 transition-transform duration-300 ${activeCategory === "masajes" ? "rotate-180" : ""}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {activeCategory === "masajes" && (
                <div className="px-7 md:px-9 pb-9 space-y-6 border-t border-stone-100 animate-fade-in">
                  {/* Relajante */}
                  <div className="pt-6 space-y-4">
                    <h4 className="text-lg md:text-xl font-semibold text-stone-900">Masaje Relajante</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {[
                        { time: "30 minutos", price: "45€" },
                        { time: "60 minutos", price: "75€" },
                        { time: "90 minutos", price: "105€" }
                      ].map((item, i) => (
                        <div key={i} className="bg-stone-50 rounded-2xl p-6 border border-stone-100 hover:border-primary/20 hover:shadow-soft transition-all">
                          <div className="text-sm text-stone-600 font-light mb-2">{item.time}</div>
                          <div className="text-3xl font-playfair font-semibold text-primary">{item.price}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Descontracturante */}
                  <div className="space-y-4">
                    <h4 className="text-lg md:text-xl font-semibold text-stone-900">Masaje Descontracturante</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {[
                        { time: "30 minutos", price: "50€" },
                        { time: "60 minutos", price: "85€" }
                      ].map((item, i) => (
                        <div key={i} className="bg-stone-50 rounded-2xl p-6 border border-stone-100 hover:border-primary/20 hover:shadow-soft transition-all">
                          <div className="text-sm text-stone-600 font-light mb-2">{item.time}</div>
                          <div className="text-3xl font-playfair font-semibold text-primary">{item.price}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Deportivo */}
                  <div className="space-y-4">
                    <h4 className="text-lg md:text-xl font-semibold text-stone-900">Masaje Deportivo</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {[
                        { time: "30 minutos", price: "50€" },
                        { time: "60 minutos", price: "85€" }
                      ].map((item, i) => (
                        <div key={i} className="bg-stone-50 rounded-2xl p-6 border border-stone-100 hover:border-primary/20 hover:shadow-soft transition-all">
                          <div className="text-sm text-stone-600 font-light mb-2">{item.time}</div>
                          <div className="text-3xl font-playfair font-semibold text-primary">{item.price}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* MASAJES DEL MUNDO */}
            <div className="bg-white rounded-3xl overflow-hidden shadow-soft hover:shadow-premium transition-shadow">
              <button
                onClick={() => toggleCategory("masajes-mundo")}
                className="w-full p-7 md:p-9 flex items-center justify-between text-left group"
                aria-expanded={activeCategory === "masajes-mundo"}
              >
                <div className="flex-1 pr-4">
                  <h3 className="text-2xl md:text-3xl font-playfair font-semibold text-stone-900 mb-2 group-hover:text-primary transition-colors">
                    Masajes del Mundo
                  </h3>
                  <p className="text-sm md:text-base text-stone-600 font-light">Técnicas ancestrales de diferentes culturas</p>
                </div>
                <svg
                  className={`w-6 h-6 text-stone-600 flex-shrink-0 transition-transform duration-300 ${activeCategory === "masajes-mundo" ? "rotate-180" : ""}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {activeCategory === "masajes-mundo" && (
                <div className="px-7 md:px-9 pb-9 border-t border-stone-100 animate-fade-in">
                  <div className="pt-6 grid grid-cols-1 md:grid-cols-2 gap-5">
                    {[
                      { name: "Lava Shell", desc: "Conchas volcánicas calientes", price: "95€" },
                      { name: "Ayurvédico", desc: "Tradición india milenaria", price: "90€" },
                      { name: "Hindú", desc: "Técnica de equilibrio energético", price: "90€" },
                      { name: "Kobido Facial", desc: "Arte japonés del rejuvenecimiento", price: "85€" }
                    ].map((item, i) => (
                      <div key={i} className="bg-stone-50 rounded-2xl p-7 border border-stone-100 hover:border-primary/20 hover:shadow-soft transition-all">
                        <h4 className="text-lg md:text-xl font-semibold text-stone-900 mb-2">{item.name}</h4>
                        <p className="text-sm text-stone-600 font-light mb-4">{item.desc}</p>
                        <div className="text-3xl font-playfair font-semibold text-primary">{item.price}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* RITUALES DEL MUNDO */}
            <div className="bg-white rounded-3xl overflow-hidden shadow-soft hover:shadow-premium transition-shadow">
              <button
                onClick={() => toggleCategory("rituales")}
                className="w-full p-7 md:p-9 flex items-center justify-between text-left group"
                aria-expanded={activeCategory === "rituales"}
              >
                <div className="flex-1 pr-4">
                  <h3 className="text-2xl md:text-3xl font-playfair font-semibold text-stone-900 mb-2 group-hover:text-primary transition-colors">
                    Rituales del Mundo
                  </h3>
                  <p className="text-sm md:text-base text-stone-600 font-light">Experiencias completas de transformación</p>
                </div>
                <svg
                  className={`w-6 h-6 text-stone-600 flex-shrink-0 transition-transform duration-300 ${activeCategory === "rituales" ? "rotate-180" : ""}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {activeCategory === "rituales" && (
                <div className="px-7 md:px-9 pb-9 border-t border-stone-100 animate-fade-in">
                  <div className="pt-6 space-y-5">
                    {[
                      { name: "Pacific Spirit", desc: "Exfoliación con sales del Pacífico + Envoltura + Masaje relajante", price: "125€" },
                      { name: "India Ancestral", desc: "Exfoliación ayurvédica + Envoltura con especias + Masaje hindú", price: "130€" }
                    ].map((item, i) => (
                      <div key={i} className="bg-stone-50 rounded-2xl p-7 border border-stone-100 hover:border-primary/20 hover:shadow-soft transition-all">
                        <h4 className="text-lg md:text-xl font-semibold text-stone-900 mb-3">{item.name}</h4>
                        <p className="text-sm text-stone-600 font-light mb-4">{item.desc}</p>
                        <div className="text-3xl font-playfair font-semibold text-primary">{item.price}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* EXFOLIACIONES Y ENVOLTURAS */}
            <div className="bg-white rounded-3xl overflow-hidden shadow-soft hover:shadow-premium transition-shadow">
              <button
                onClick={() => toggleCategory("exfoliaciones")}
                className="w-full p-7 md:p-9 flex items-center justify-between text-left group"
                aria-expanded={activeCategory === "exfoliaciones"}
              >
                <div className="flex-1 pr-4">
                  <h3 className="text-2xl md:text-3xl font-playfair font-semibold text-stone-900 mb-2 group-hover:text-primary transition-colors">
                    Exfoliaciones y Envolturas
                  </h3>
                  <p className="text-sm md:text-base text-stone-600 font-light">Renovación profunda de la piel</p>
                </div>
                <svg
                  className={`w-6 h-6 text-stone-600 flex-shrink-0 transition-transform duration-300 ${activeCategory === "exfoliaciones" ? "rotate-180" : ""}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {activeCategory === "exfoliaciones" && (
                <div className="px-7 md:px-9 pb-9 border-t border-stone-100 animate-fade-in">
                  <div className="pt-6 grid grid-cols-1 md:grid-cols-3 gap-5">
                    {[
                      { name: "Algoterapia", desc: "Algas marinas", price: "70€" },
                      { name: "Sales & Aroma", desc: "Sales minerales", price: "65€" },
                      { name: "Aloe Vera", desc: "Hidratación intensa", price: "65€" }
                    ].map((item, i) => (
                      <div key={i} className="bg-stone-50 rounded-2xl p-7 border border-stone-100 hover:border-primary/20 hover:shadow-soft transition-all">
                        <h4 className="text-lg font-semibold text-stone-900 mb-2">{item.name}</h4>
                        <p className="text-sm text-stone-600 font-light mb-4">{item.desc}</p>
                        <div className="text-3xl font-playfair font-semibold text-primary">{item.price}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* TRATAMIENTOS FACIALES */}
            <div className="bg-white rounded-3xl overflow-hidden shadow-soft hover:shadow-premium transition-shadow">
              <button
                onClick={() => toggleCategory("faciales")}
                className="w-full p-7 md:p-9 flex items-center justify-between text-left group"
                aria-expanded={activeCategory === "faciales"}
              >
                <div className="flex-1 pr-4">
                  <h3 className="text-2xl md:text-3xl font-playfair font-semibold text-stone-900 mb-2 group-hover:text-primary transition-colors">
                    Tratamientos Faciales
                  </h3>
                  <p className="text-sm md:text-base text-stone-600 font-light">Cuidado personalizado para tu piel</p>
                </div>
                <svg
                  className={`w-6 h-6 text-stone-600 flex-shrink-0 transition-transform duration-300 ${activeCategory === "faciales" ? "rotate-180" : ""}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {activeCategory === "faciales" && (
                <div className="px-7 md:px-9 pb-9 border-t border-stone-100 animate-fade-in">
                  <div className="pt-6 grid grid-cols-1 md:grid-cols-3 gap-5">
                    {[
                      { name: "Cóctel Vitaminas", desc: "Nutrición profunda", price: "75€" },
                      { name: "Flash Glow", desc: "Luminosidad instantánea", price: "70€" },
                      { name: "Rejuvenecimiento", desc: "Anti-edad avanzado", price: "90€" }
                    ].map((item, i) => (
                      <div key={i} className="bg-stone-50 rounded-2xl p-7 border border-stone-100 hover:border-primary/20 hover:shadow-soft transition-all">
                        <h4 className="text-lg font-semibold text-stone-900 mb-2">{item.name}</h4>
                        <p className="text-sm text-stone-600 font-light mb-4">{item.desc}</p>
                        <div className="text-3xl font-playfair font-semibold text-primary">{item.price}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* TRATAMIENTOS CORPORALES */}
            <div className="bg-white rounded-3xl overflow-hidden shadow-soft hover:shadow-premium transition-shadow">
              <button
                onClick={() => toggleCategory("corporales")}
                className="w-full p-7 md:p-9 flex items-center justify-between text-left group"
                aria-expanded={activeCategory === "corporales"}
              >
                <div className="flex-1 pr-4">
                  <h3 className="text-2xl md:text-3xl font-playfair font-semibold text-stone-900 mb-2 group-hover:text-primary transition-colors">
                    Tratamientos Corporales
                  </h3>
                  <p className="text-sm md:text-base text-stone-600 font-light">Tecnología avanzada para tu cuerpo</p>
                </div>
                <svg
                  className={`w-6 h-6 text-stone-600 flex-shrink-0 transition-transform duration-300 ${activeCategory === "corporales" ? "rotate-180" : ""}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {activeCategory === "corporales" && (
                <div className="px-7 md:px-9 pb-9 border-t border-stone-100 animate-fade-in">
                  <div className="pt-6 grid grid-cols-1 md:grid-cols-3 gap-5">
                    {[
                      { name: "Estético", desc: "Modelado corporal", price: "80€" },
                      { name: "Radiofrecuencia", desc: "Reafirmación tisular", price: "95€" },
                      { name: "Presoterapia", desc: "Drenaje linfático", price: "75€" }
                    ].map((item, i) => (
                      <div key={i} className="bg-stone-50 rounded-2xl p-7 border border-stone-100 hover:border-primary/20 hover:shadow-soft transition-all">
                        <h4 className="text-lg font-semibold text-stone-900 mb-2">{item.name}</h4>
                        <p className="text-sm text-stone-600 font-light mb-4">{item.desc}</p>
                        <div className="text-3xl font-playfair font-semibold text-primary">{item.price}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* MANOS Y PIES */}
            <div className="bg-white rounded-3xl overflow-hidden shadow-soft hover:shadow-premium transition-shadow">
              <button
                onClick={() => toggleCategory("manos-pies")}
                className="w-full p-7 md:p-9 flex items-center justify-between text-left group"
                aria-expanded={activeCategory === "manos-pies"}
              >
                <div className="flex-1 pr-4">
                  <h3 className="text-2xl md:text-3xl font-playfair font-semibold text-stone-900 mb-2 group-hover:text-primary transition-colors">
                    Manos y Pies
                  </h3>
                  <p className="text-sm md:text-base text-stone-600 font-light">Cuidado completo y personalizado</p>
                </div>
                <svg
                  className={`w-6 h-6 text-stone-600 flex-shrink-0 transition-transform duration-300 ${activeCategory === "manos-pies" ? "rotate-180" : ""}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {activeCategory === "manos-pies" && (
                <div className="px-7 md:px-9 pb-9 border-t border-stone-100 animate-fade-in">
                  <div className="pt-6 grid grid-cols-1 md:grid-cols-3 gap-5">
                    {[
                      { name: "Manicura SPA", desc: "Cuidado premium", price: "45€" },
                      { name: "Pedicura SPA", desc: "Ritual completo", price: "55€" },
                      { name: "Spa Duo", desc: "Manos + Pies", price: "90€" }
                    ].map((item, i) => (
                      <div key={i} className="bg-stone-50 rounded-2xl p-7 border border-stone-100 hover:border-primary/20 hover:shadow-soft transition-all">
                        <h4 className="text-lg font-semibold text-stone-900 mb-2">{item.name}</h4>
                        <p className="text-sm text-stone-600 font-light mb-4">{item.desc}</p>
                        <div className="text-3xl font-playfair font-semibold text-primary">{item.price}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* PELUQUERÍA */}
            <div className="bg-white rounded-3xl overflow-hidden shadow-soft hover:shadow-premium transition-shadow">
              <button
                onClick={() => toggleCategory("peluqueria")}
                className="w-full p-7 md:p-9 flex items-center justify-between text-left group"
                aria-expanded={activeCategory === "peluqueria"}
              >
                <div className="flex-1 pr-4">
                  <h3 className="text-2xl md:text-3xl font-playfair font-semibold text-stone-900 mb-2 group-hover:text-primary transition-colors">
                    Peluquería
                  </h3>
                  <p className="text-sm md:text-base text-stone-600 font-light">Servicios profesionales de estilismo</p>
                </div>
                <svg
                  className={`w-6 h-6 text-stone-600 flex-shrink-0 transition-transform duration-300 ${activeCategory === "peluqueria" ? "rotate-180" : ""}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {activeCategory === "peluqueria" && (
                <div className="px-7 md:px-9 pb-9 border-t border-stone-100 animate-fade-in">
                  <div className="pt-6 grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {[
                      { name: "Lavado y Peinado", price: "35€" },
                      { name: "Corte", price: "desde 40€" },
                      { name: "Color", price: "desde 65€" },
                      { name: "Recogidos", price: "desde 50€" }
                    ].map((item, i) => (
                      <div key={i} className="bg-stone-50 rounded-2xl p-7 border border-stone-100 hover:border-primary/20 hover:shadow-soft transition-all">
                        <h4 className="text-lg font-semibold text-stone-900 mb-4">{item.name}</h4>
                        <div className="text-3xl font-playfair font-semibold text-primary">{item.price}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* EXPERIENCIAS EN PAREJA */}
      <section id="experiencias" className="py-20 md:py-28 bg-white">
        <div className="container mx-auto px-5 max-w-5xl">
          <div className="text-center mb-16">
            <span className="inline-block text-[11px] tracking-[0.2em] uppercase text-stone-600 mb-4 font-medium">
              Para Compartir
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-playfair font-semibold text-stone-900 mb-6 leading-tight">
              Experiencias en Pareja
            </h2>
            <p className="text-base md:text-lg text-stone-600 font-light max-w-2xl mx-auto leading-relaxed">
              Disfruta momentos únicos en compañía
            </p>
          </div>

          <div className="space-y-6">
            <div className="bg-stone-50 rounded-3xl p-8 md:p-12 border border-stone-100 hover:shadow-premium transition-shadow">
              <div className="mb-6">
                <h3 className="text-2xl md:text-3xl font-playfair font-semibold text-stone-900 mb-3">Circuito + Masajes</h3>
                <p className="text-base text-stone-600 font-light">Circuito spa privado + Masaje relajante 30 min</p>
              </div>
              <div className="flex items-baseline gap-4">
                <span className="text-5xl md:text-6xl font-playfair font-semibold text-primary">160€</span>
                <span className="text-base text-stone-600 font-light">2 personas</span>
              </div>
            </div>

            <div className="bg-stone-50 rounded-3xl p-8 md:p-12 border border-stone-100 hover:shadow-premium transition-shadow">
              <div className="mb-6">
                <h3 className="text-2xl md:text-3xl font-playfair font-semibold text-stone-900 mb-3">Masajes en Pareja</h3>
                <p className="text-base text-stone-600 font-light">Sala privada • Sesión simultánea</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div>
                  <div className="text-sm text-stone-600 font-light mb-2">60 minutos</div>
                  <div className="text-4xl md:text-5xl font-playfair font-semibold text-primary">145€</div>
                </div>
                <div>
                  <div className="text-sm text-stone-600 font-light mb-2">90 minutos</div>
                  <div className="text-4xl md:text-5xl font-playfair font-semibold text-primary">200€</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIOS DISCRETOS */}
      <section className="py-20 md:py-28 bg-stone-100">
        <div className="container mx-auto px-5 max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { text: "Experiencia excepcional. Volveré sin duda", name: "María G." },
              { text: "El mejor spa de la ciudad. Ambiente impecable", name: "Carlos R." },
              { text: "Profesionalidad y calma. Totalmente recomendable", name: "Laura M." }
            ].map((item, i) => (
              <div key={i} className="text-center">
                <p className="text-base text-stone-700 font-light italic mb-5 leading-relaxed">
                  "{item.text}"
                </p>
                <div className="text-xs text-stone-600 font-light">— {item.name}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section id="reservar" className="py-24 md:py-36 bg-white">
        <div className="container mx-auto px-5 max-w-3xl">
          <div className="text-center">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-playfair font-semibold text-stone-900 mb-8 leading-tight">
              Reserva tu momento
            </h2>
            <p className="text-base md:text-lg text-stone-600 font-light mb-12 max-w-2xl mx-auto leading-relaxed">
              Contáctanos para reservar tu experiencia o recibir más información
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
              <a
                href="tel:+34900123456"
                className="w-full sm:w-auto inline-flex items-center justify-center px-12 py-5 bg-primary text-white text-base font-medium tracking-wide rounded-full hover:bg-primary-hover hover:scale-105 hover:shadow-soft transition-all"
              >
                +34 900 123 456
              </a>
              <a
                href="mailto:info@spaserenity.com"
                className="w-full sm:w-auto inline-flex items-center justify-center px-12 py-5 border-2 border-stone-300 text-stone-900 text-base font-medium tracking-wide rounded-full hover:border-primary hover:text-primary transition-all"
              >
                Enviar email
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer id="contacto" className="bg-stone-900 text-stone-400 py-16 md:py-20">
        <div className="container mx-auto px-5 max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-14 mb-14">
            <div>
              <h3 className="text-xl font-playfair font-semibold text-white mb-5">Guinda Wellnes & Spa</h3>
              <p className="text-sm font-light leading-relaxed">Tu refugio de calma y bienestar</p>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white mb-5 tracking-wide uppercase">Contacto</h4>
              <div className="space-y-3 text-sm font-light">
                <p>+34 900 123 456</p>
                <p>info@spaserenity.com</p>
                <p>Calle del Bienestar 123<br />28001 Madrid</p>
              </div>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white mb-5 tracking-wide uppercase">Horario</h4>
              <div className="space-y-3 text-sm font-light">
                <p>Lunes - Viernes: 9:00 - 21:00</p>
                <p>Sábados: 10:00 - 20:00</p>
                <p>Domingos: 10:00 - 19:00</p>
              </div>
            </div>
          </div>
          <div className="pt-10 border-t border-stone-800 text-center text-sm font-light">
            <p>&copy; 2026 Guinda Wellnes & Spa. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
