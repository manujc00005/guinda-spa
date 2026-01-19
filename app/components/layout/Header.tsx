"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { COMPANY_DATA } from "../../data/company";
import { NAVIGATION } from "../../data/navigation";
import { SOCIAL_MEDIA } from "../../data/social";

const DESKTOP_NAV_MAX = 5;

function isHashHref(href: string) {
  return href.startsWith("#");
}

function scrollToHash(href: string) {
  const id = href.replace("#", "");
  if (!id) return;

  const el = document.getElementById(id);
  if (!el) return;

  // Respeta scroll-margin-top (recomendado en secciones) y scroll-padding-top (html)
  el.scrollIntoView({ behavior: "smooth", block: "start" });
}

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 16);
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
      // IMPORTANTE: prevenimos el salto brusco y controlamos el smooth scroll
      e.preventDefault();

      // Cierra menú si aplica
      if (isMobileMenuOpen) closeMenu();

      // Espera a que el DOM se refluya (y el menú se cierre) antes del scroll
      requestAnimationFrame(() => {
        // Actualiza el hash en URL sin recargar
        if (window.location.hash !== href) {
          history.pushState(null, "", href);
        }
        scrollToHash(href);
      });
    };

  return (
    <>
      {/* HEADER (solo: logo + nav + CTA) */}
      <header
        className={[
          "fixed top-0 left-0 right-0 z-50",
          "transition-[background-color,border-color,backdrop-filter] duration-300",
          isScrolled
            ? "bg-white/95 backdrop-blur-md border-b border-(--color-border)"
            : "bg-white/65 backdrop-blur-sm border-b border-transparent",
        ].join(" ")}
      >
        <div className="container-page">
          <div className="flex h-18 md:h-20 items-center justify-between">
            {/* Logo */}
            {/*
              Para #inicio usamos <a> + smooth scroll, no Link.
              Así no dependemos del comportamiento de Next con hashes.
            */}
            <a
              href="#inicio"
              onClick={handleHashClick("#inicio")}
              className={[
                "font-playfair font-semibold",
                "text-xl md:text-2xl",
                "text-(--color-text-primary)",
                "transition-colors hover:text-(--color-primary)",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--color-primary)/30 focus-visible:ring-offset-4 focus-visible:ring-offset-white/80",
              ].join(" ")}
              aria-label={`${COMPANY_DATA.brandName} - Ir al inicio`}
            >
              {COMPANY_DATA.brandName}
            </a>

            {/* Navegación desktop (máx 5) */}
            <nav className="hidden lg:flex items-center gap-8">
              {navItems.map((item) =>
                isHashHref(item.href) ? (
                  <a
                    key={item.href}
                    href={item.href}
                    onClick={handleHashClick(item.href)}
                    className={[
                      "text-sm font-medium",
                      "text-(--color-text-secondary)",
                      "transition-colors hover:text-(--color-text-primary)",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--color-primary)/25 focus-visible:ring-offset-4 focus-visible:ring-offset-white/80",
                    ].join(" ")}
                  >
                    {item.label}
                  </a>
                ) : (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={[
                      "text-sm font-medium",
                      "text-(--color-text-secondary)",
                      "transition-colors hover:text-(--color-text-primary)",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--color-primary)/25 focus-visible:ring-offset-4 focus-visible:ring-offset-white/80",
                    ].join(" ")}
                  >
                    {item.label}
                  </Link>
                )
              )}
            </nav>

            {/* Desktop: SOLO CTA */}
            <div className="hidden lg:flex items-center">
              {isHashHref(NAVIGATION.cta.href) ? (
                <a
                  href={NAVIGATION.cta.href}
                  onClick={handleHashClick(NAVIGATION.cta.href)}
                  className="btn-primary text-sm px-6 py-2.5"
                >
                  {NAVIGATION.cta.label}
                </a>
              ) : (
                <Link href={NAVIGATION.cta.href} className="btn-primary text-sm px-6 py-2.5">
                  {NAVIGATION.cta.label}
                </Link>
              )}
            </div>

            {/* Mobile: SOLO hamburguesa */}
            <div className="flex lg:hidden items-center">
              <button
                onClick={() => setIsMobileMenuOpen((v) => !v)}
                aria-label={isMobileMenuOpen ? "Cerrar menú" : "Abrir menú"}
                aria-expanded={isMobileMenuOpen}
                className={[
                  "inline-flex items-center justify-center",
                  "w-11 h-11 rounded-full",
                  "text-(--color-text-primary)",
                  "border border-transparent hover:border-(--color-border)",
                  "hover:bg-black/[0.02]",
                  "transition-colors",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--color-primary)/25 focus-visible:ring-offset-4 focus-visible:ring-offset-white/80",
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

      {/* MENÚ MOBILE (CTA + links) */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          {/* Overlay */}
          <div className="absolute inset-0 bg-black/15 backdrop-blur-sm" onClick={closeMenu} />

          {/* Panel */}
          <div className="absolute top-18 left-0 right-0 bottom-0 bg-white/98">
            <nav className="container-page py-8">
              {/* CTA principal primero */}
              <div className="mb-7">
                {isHashHref(NAVIGATION.cta.href) ? (
                  <a
                    href={NAVIGATION.cta.href}
                    onClick={handleHashClick(NAVIGATION.cta.href)}
                    className="btn-primary w-full text-center py-4 block"
                  >
                    {NAVIGATION.cta.label}
                  </a>
                ) : (
                  <Link
                    href={NAVIGATION.cta.href}
                    onClick={closeMenu}
                    className="btn-primary w-full text-center py-4 block"
                  >
                    {NAVIGATION.cta.label}
                  </Link>
                )}
              </div>

              {/* Links */}
              <ul className="space-y-1">
                {NAVIGATION.items.map((item) => (
                  <li key={item.href}>
                    {isHashHref(item.href) ? (
                      <a
                        href={item.href}
                        onClick={handleHashClick(item.href)}
                        className={[
                          "block rounded-xl",
                          "py-4 px-4",
                          "text-base font-medium",
                          "text-(--color-text-primary)",
                          "hover:bg-black/[0.02] hover:text-(--color-primary)",
                          "transition-colors",
                          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--color-primary)/25 focus-visible:ring-offset-4",
                        ].join(" ")}
                      >
                        {item.label}
                      </a>
                    ) : (
                      <Link
                        href={item.href}
                        onClick={closeMenu}
                        className={[
                          "block rounded-xl",
                          "py-4 px-4",
                          "text-base font-medium",
                          "text-(--color-text-primary)",
                          "hover:bg-black/[0.02] hover:text-(--color-primary)",
                          "transition-colors",
                          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--color-primary)/25 focus-visible:ring-offset-4",
                        ].join(" ")}
                      >
                        {item.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>

              {/* Info sutil */}
              <div className="mt-10 px-4 text-center">
                <p className="text-xs text-(--color-text-secondary) mb-1">Horario de atención</p>
                <p className="text-sm font-medium text-(--color-text-primary)">{COMPANY_DATA.businessHours.weekdays}</p>
              </div>
            </nav>
          </div>
        </div>
      )}

      {/* WHATSAPP FLOATING (aparece tras scroll) */}
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
            "bg-white/90 backdrop-blur",
            "border border-(--color-border)",
            "text-(--color-text-secondary)",
            "shadow-sm",
            "transition-all duration-300",
            isScrolled ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2 pointer-events-none",
            "hover:text-(--color-text-primary) hover:bg-white",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--color-primary)/25 focus-visible:ring-offset-4 focus-visible:ring-offset-white/80",
          ].join(" ")}
        >
          <SOCIAL_MEDIA.whatsapp.icon className="w-5 h-5" />
        </a>
      )}
    </>
  );
}
