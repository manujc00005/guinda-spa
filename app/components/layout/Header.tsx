"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { COMPANY_DATA } from "../../data/company";
import { NAVIGATION } from "../../data/navigation";
import { SOCIAL_MEDIA } from "../../data/social";

/**
 * HEADER INMERSIVO PREMIUM
 *
 * Dos estados visuales con transición orgánica:
 *
 * Estado HERO (top):
 *   - Background: totalmente transparente
 *   - Texto: blanco puro
 *   - CTA: borde blanco semi-transparente (glass)
 *   - Sin borde inferior
 *   - El header "vive dentro" de la imagen hero
 *
 * Estado SCROLL (activo):
 *   - Background: blanco con glassmorphism (blur + opacidad)
 *   - Texto: oscuro (color-text-primary / secondary)
 *   - CTA: btn-primary sólido burdeos
 *   - Sombra sutil premium (sin borde duro)
 *   - El header "emerge" con elegancia
 *
 * Transición: 400ms cubic-bezier para sensación orgánica.
 * Mobile: hamburguesa blanca sobre hero, oscura tras scroll.
 * El menú mobile siempre abre en fondo blanco sólido.
 *
 * Threshold: 80px (no 16px) para que el header permanezca
 * transparente durante más scroll dentro del hero.
 */

const SCROLL_THRESHOLD = 80;
const DESKTOP_NAV_MAX = 5;

function isHashHref(href: string) {
  return href.startsWith("#");
}

function scrollToHash(href: string) {
  const id = href.replace("#", "");
  if (!id) return;
  const el = document.getElementById(id);
  if (!el) return;
  el.scrollIntoView({ behavior: "smooth", block: "start" });
}

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > SCROLL_THRESHOLD);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen]);

  const navItems = useMemo(() => NAVIGATION.items.slice(0, DESKTOP_NAV_MAX), []);
  const closeMenu = () => setIsMobileMenuOpen(false);

  const handleHashClick =
    (href: string) =>
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      e.preventDefault();
      if (isMobileMenuOpen) closeMenu();
      requestAnimationFrame(() => {
        if (window.location.hash !== href) {
          history.pushState(null, "", href);
        }
        scrollToHash(href);
      });
    };

  // Cuando el menú mobile está abierto, forzamos estilo "scrolled"
  // para que el header tenga fondo blanco y texto oscuro
  const showSolid = isScrolled || isMobileMenuOpen;

  return (
    <>
      {/* ─── HEADER ─── */}
      <header
        className={[
          "fixed top-0 left-0 right-0 z-50",
          "transition-all duration-[400ms] ease-[cubic-bezier(0.4,0,0.2,1)]",
          showSolid
            ? "bg-white/95 backdrop-blur-xl shadow-[0_1px_24px_rgba(0,0,0,0.06)]"
            : "bg-transparent",
        ].join(" ")}
      >
        <div className="container-page">
          <div className="flex h-18 md:h-20 items-center justify-between">

            {/* ── Logo ── */}
            <a
              href="#inicio"
              onClick={handleHashClick("#inicio")}
              className={[
                "font-playfair font-semibold",
                "text-xl md:text-2xl",
                "transition-colors duration-[400ms]",
                showSolid
                  ? "text-(--color-text-primary) hover:text-(--color-primary)"
                  : "text-white hover:text-white/80",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent",
              ].join(" ")}
              aria-label={`${COMPANY_DATA.brandName} - Ir al inicio`}
            >
              {COMPANY_DATA.brandName}
            </a>

            {/* ── Navegación desktop ── */}
            <nav className="hidden lg:flex items-center gap-8">
              {navItems.map((item) => {
                const linkClasses = [
                  "text-sm font-medium tracking-wide",
                  "transition-colors duration-[400ms]",
                  showSolid
                    ? "text-(--color-text-secondary) hover:text-(--color-text-primary)"
                    : "text-white/75 hover:text-white",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/25 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent",
                ].join(" ");

                return isHashHref(item.href) ? (
                  <a
                    key={item.href}
                    href={item.href}
                    onClick={handleHashClick(item.href)}
                    className={linkClasses}
                  >
                    {item.label}
                  </a>
                ) : (
                  <Link key={item.href} href={item.href} className={linkClasses}>
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            {/* ── Desktop CTA ── */}
            <div className="hidden lg:flex items-center">
              {(() => {
                // Estado hero: CTA glass (borde blanco, fondo transparente)
                // Estado scroll: CTA sólido burdeos
                const ctaClasses = showSolid
                  ? "btn-primary text-sm px-6 py-2.5"
                  : [
                      "inline-flex items-center justify-center",
                      "text-sm font-medium px-6 py-2.5",
                      "rounded-full",
                      "border border-white/35 text-white",
                      "bg-white/10 backdrop-blur-sm",
                      "transition-all duration-[400ms]",
                      "hover:bg-white/20 hover:border-white/50",
                    ].join(" ");

                return isHashHref(NAVIGATION.cta.href) ? (
                  <a
                    href={NAVIGATION.cta.href}
                    onClick={handleHashClick(NAVIGATION.cta.href)}
                    className={ctaClasses}
                  >
                    {NAVIGATION.cta.label}
                  </a>
                ) : (
                  <Link href={NAVIGATION.cta.href} className={ctaClasses}>
                    {NAVIGATION.cta.label}
                  </Link>
                );
              })()}
            </div>

            {/* ── Mobile hamburguesa ── */}
            <div className="flex lg:hidden items-center">
              <button
                onClick={() => setIsMobileMenuOpen((v) => !v)}
                aria-label={isMobileMenuOpen ? "Cerrar menú" : "Abrir menú"}
                aria-expanded={isMobileMenuOpen}
                className={[
                  "inline-flex items-center justify-center",
                  "w-11 h-11 rounded-full",
                  "transition-all duration-[400ms]",
                  showSolid
                    ? "text-(--color-text-primary) hover:bg-black/[0.03]"
                    : "text-white hover:bg-white/10",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/25 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent",
                ].join(" ")}
              >
                {isMobileMenuOpen ? (
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </button>
            </div>

          </div>
        </div>
      </header>

      {/* ─── MENÚ MOBILE ─── */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          {/* Overlay oscuro */}
          <div
            className="absolute inset-0 bg-black/20 backdrop-blur-sm animate-fade-in"
            onClick={closeMenu}
          />

          {/* Panel blanco desde top */}
          <div className="absolute top-18 left-0 right-0 bottom-0 bg-white animate-fade-in-up">
            <nav className="container-page py-8">
              {/* CTA principal primero */}
              <div className="mb-8">
                {isHashHref(NAVIGATION.cta.href) ? (
                  <a
                    href={NAVIGATION.cta.href}
                    onClick={handleHashClick(NAVIGATION.cta.href)}
                    className="btn-primary w-full text-center py-4 block text-base"
                  >
                    {NAVIGATION.cta.label}
                  </a>
                ) : (
                  <Link
                    href={NAVIGATION.cta.href}
                    onClick={closeMenu}
                    className="btn-primary w-full text-center py-4 block text-base"
                  >
                    {NAVIGATION.cta.label}
                  </Link>
                )}
              </div>

              {/* Separador sutil */}
              <div className="flex items-center gap-3 mb-6 px-4">
                <div className="flex-1 h-px bg-(--color-border-light)" />
                <span className="text-[10px] tracking-[0.2em] uppercase text-(--color-text-muted)">Explorar</span>
                <div className="flex-1 h-px bg-(--color-border-light)" />
              </div>

              {/* Links */}
              <ul className="space-y-1">
                {NAVIGATION.items.map((item) => {
                  const linkClasses = [
                    "block rounded-xl",
                    "py-4 px-4",
                    "text-base font-medium",
                    "text-(--color-text-primary)",
                    "hover:bg-(--color-ivory) hover:text-(--color-primary)",
                    "transition-colors duration-200",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--color-primary)/25 focus-visible:ring-offset-4",
                  ].join(" ");

                  return (
                    <li key={item.href}>
                      {isHashHref(item.href) ? (
                        <a
                          href={item.href}
                          onClick={handleHashClick(item.href)}
                          className={linkClasses}
                        >
                          {item.label}
                        </a>
                      ) : (
                        <Link href={item.href} onClick={closeMenu} className={linkClasses}>
                          {item.label}
                        </Link>
                      )}
                    </li>
                  );
                })}
              </ul>

              {/* Info sutil */}
              <div className="mt-12 pt-6 border-t border-(--color-border-light) px-4 text-center">
                <p className="text-[10px] tracking-[0.15em] uppercase text-(--color-text-muted) mb-1.5">
                  Horario de atención
                </p>
                <p className="text-sm font-medium text-(--color-text-primary)">
                  {COMPANY_DATA.businessHours.weekdays}
                </p>
              </div>
            </nav>
          </div>
        </div>
      )}

      {/* ─── WHATSAPP FLOATING ─── */}
      {SOCIAL_MEDIA.whatsapp && (
        <a
          href={SOCIAL_MEDIA.whatsapp.url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Consulta por WhatsApp"
          title="Consulta por WhatsApp"
          className={[
            "fixed z-40",
            "right-4 bottom-4 md:right-6 md:bottom-6",
            "inline-flex items-center justify-center",
            "w-12 h-12 rounded-full",
            "bg-white/90 backdrop-blur-md",
            "border border-(--color-border-light)",
            "text-(--color-text-secondary)",
            "shadow-[var(--shadow-soft)]",
            "transition-all duration-400",
            isScrolled ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3 pointer-events-none",
            "hover:text-(--color-primary) hover:bg-white hover:shadow-[var(--shadow-premium)]",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--color-primary)/25 focus-visible:ring-offset-4 focus-visible:ring-offset-white/80",
          ].join(" ")}
        >
          <SOCIAL_MEDIA.whatsapp.icon className="w-5 h-5" />
        </a>
      )}
    </>
  );
}
