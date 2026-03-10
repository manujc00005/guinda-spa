"use client";

import { useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { COMPANY_DATA } from "../../data/company";
import { SOCIAL_MEDIA } from "../../data/social";
import { LanguageSelector } from "./LanguageSelector";

const SCROLL_THRESHOLD = 80;
const DESKTOP_NAV_MAX = 5;

const NAV_ITEMS = [
  { href: "#experiencias", key: "experiencias" },
  { href: "#servicios", key: "servicios" },
  { href: "#packs", key: "packs" },
  { href: "#opiniones", key: "opiniones" },
  { href: "#faq", key: "faq" },
  { href: "#reservar", key: "reservar" },
];

const CTA_HREF = "#reservar";

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
  const t = useTranslations("navigation");
  const tCommon = useTranslations("common");

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

  const navItems = useMemo(() => NAV_ITEMS.slice(0, DESKTOP_NAV_MAX), []);
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

  const showSolid = isScrolled || isMobileMenuOpen;

  return (
    <>
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
            {/* Logo */}
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
              aria-label={tCommon("aria.goToHome", {
                brandName: COMPANY_DATA.brandName,
              })}
            >
              {COMPANY_DATA.brandName}
            </a>

            {/* Desktop nav */}
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

                return (
                  <a
                    key={item.href}
                    href={item.href}
                    onClick={handleHashClick(item.href)}
                    className={linkClasses}
                  >
                    {t(`items.${item.key}`)}
                  </a>
                );
              })}
            </nav>

            {/* Desktop: Language Selector + CTA */}
            <div className="hidden lg:flex items-center gap-5">
              <LanguageSelector
                className={
                  showSolid ? "text-(--color-text-secondary)" : "text-white/70"
                }
              />
              <a
                href={CTA_HREF}
                onClick={handleHashClick(CTA_HREF)}
                className={
                  showSolid
                    ? "btn-primary text-sm px-6 py-2.5"
                    : [
                        "inline-flex items-center justify-center",
                        "text-sm font-medium px-6 py-2.5",
                        "rounded-full",
                        "border border-white/35 text-white",
                        "bg-white/10 backdrop-blur-sm",
                        "transition-all duration-[400ms]",
                        "hover:bg-white/20 hover:border-white/50",
                      ].join(" ")
                }
              >
                {t("cta")}
              </a>
            </div>

            {/* Mobile hamburger */}
            <div className="flex lg:hidden items-center">
              <button
                onClick={() => setIsMobileMenuOpen((v) => !v)}
                aria-label={
                  isMobileMenuOpen
                    ? tCommon("aria.closeMenu")
                    : tCommon("aria.openMenu")
                }
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
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                ) : (
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="absolute inset-0 bg-black/20 backdrop-blur-sm animate-fade-in"
            onClick={closeMenu}
          />

          <div className="absolute top-18 left-0 right-0 bottom-0 bg-white animate-fade-in-up">
            <nav className="container-page py-8">
              {/* CTA first */}
              <div className="mb-8">
                <a
                  href={CTA_HREF}
                  onClick={handleHashClick(CTA_HREF)}
                  className="btn-primary w-full text-center py-4 block text-base"
                >
                  {t("cta")}
                </a>
              </div>

              {/* Divider */}
              <div className="flex items-center gap-3 mb-6 px-4">
                <div className="flex-1 h-px bg-(--color-border-light)" />
                <span className="text-[10px] tracking-[0.2em] uppercase text-(--color-text-muted)">
                  {tCommon("labels.explore")}
                </span>
                <div className="flex-1 h-px bg-(--color-border-light)" />
              </div>

              {/* Nav links */}
              <ul className="space-y-1">
                {NAV_ITEMS.map((item) => (
                  <li key={item.href}>
                    <a
                      href={item.href}
                      onClick={handleHashClick(item.href)}
                      className="block rounded-xl py-4 px-4 text-base font-medium text-(--color-text-primary) hover:bg-(--color-ivory) hover:text-(--color-primary) transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--color-primary)/25 focus-visible:ring-offset-4"
                    >
                      {t(`items.${item.key}`)}
                    </a>
                  </li>
                ))}
              </ul>

              {/* Language selector + business hours */}
              <div className="mt-12 pt-6 border-t border-(--color-border-light) px-4">
                <div className="flex justify-center mb-6">
                  <LanguageSelector className="text-(--color-text-secondary)" />
                </div>
                <div className="text-center">
                  <p className="text-[10px] tracking-[0.15em] uppercase text-(--color-text-muted) mb-1.5">
                    {tCommon("labels.businessHours")}
                  </p>
                  <p className="text-sm font-medium text-(--color-text-primary)">
                    {COMPANY_DATA.businessHours.weekdays}
                  </p>
                </div>
              </div>
            </nav>
          </div>
        </div>
      )}

      {/* WhatsApp floating */}
      {SOCIAL_MEDIA.whatsapp && (
        <a
          href={SOCIAL_MEDIA.whatsapp.url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={tCommon("aria.contactWhatsapp")}
          title={tCommon("aria.contactWhatsapp")}
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
            isScrolled
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-3 pointer-events-none",
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
