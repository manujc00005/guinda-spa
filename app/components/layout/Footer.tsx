"use client";

import { useTranslations } from "next-intl";
import { COMPANY_DATA } from "../../data/company";
import { SOCIAL_MEDIA } from "../../data/social";
import { Link } from "../../../i18n/routing";

/**
 * FOOTER PREMIUM — i18n
 *
 * Evolución: más limpio, más espaciado, tagline visible,
 * emojis reemplazados por SVGs, ornamento dorado.
 * Ahora con soporte completo de internacionalización.
 */

const LEGAL_ROUTES = [
  { key: "avisoLegal", href: "/aviso-legal" as const },
  { key: "privacidad", href: "/privacidad" as const },
  { key: "cookies", href: "/cookies" as const },
  { key: "cancelaciones", href: "/cancelaciones" as const },
] as const;

export function Footer() {
  const currentYear = new Date().getFullYear();
  const t = useTranslations("footer");
  const tLegal = useTranslations("legal");
  const tCommon = useTranslations("common");
  const tCompany = useTranslations("company");

  return (
    <footer id="contacto" className="py-16 md:py-24 bg-(--color-text-primary) text-white">
      <div className="container-page">
        {/* Ornamento superior */}
        <div className="flex justify-center mb-12 md:mb-16">
          <div className="flex items-center gap-3">
            <div className="w-12 h-px bg-white/20" />
            <span className="text-(--color-gold) text-sm">✦</span>
            <div className="w-12 h-px bg-white/20" />
          </div>
        </div>

        <div className="grid md:grid-cols-4 gap-12 mb-14">
          {/* Bloque 1: Marca + Descripción */}
          <div className="md:col-span-2">
            <h3 className="text-2xl font-playfair font-semibold mb-2">{COMPANY_DATA.brandName}</h3>
            <p className="text-xs tracking-[0.15em] uppercase text-(--color-gold)/80 mb-4 font-medium">
              {t("tagline")}
            </p>
            <p className="text-sm text-white/70 leading-relaxed mb-6 max-w-sm">
              {tCompany("description")}
            </p>

            {/* Redes Sociales */}
            <div className="flex items-center gap-4">
              {Object.values(SOCIAL_MEDIA).map((social) => {
                const IconComponent = social.icon;
                return (
                  <a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.ariaLabel}
                    className="w-10 h-10 rounded-full border border-white/15 flex items-center justify-center text-white/70 hover:text-white hover:border-white/30 hover:bg-white/5 transition-all duration-200"
                  >
                    <IconComponent className="w-4.5 h-4.5" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Bloque 2: Contacto */}
          <div>
            <h4 className="text-xs tracking-[0.18em] uppercase text-white/50 mb-5 font-medium">
              {tCommon("labels.contact")}
            </h4>
            <div className="space-y-3 text-sm text-white/70">
              <p className="flex items-center gap-3">
                <svg className="w-4 h-4 flex-shrink-0 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                </svg>
                <a
                  href={`tel:${COMPANY_DATA.contact.phone.replace(/\s/g, "")}`}
                  className="hover:text-white transition-colors"
                >
                  {COMPANY_DATA.contact.phone}
                </a>
              </p>
              <p className="flex items-center gap-3">
                <svg className="w-4 h-4 flex-shrink-0 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                </svg>
                <a
                  href={`mailto:${COMPANY_DATA.contact.email}`}
                  className="hover:text-white transition-colors"
                >
                  {COMPANY_DATA.contact.email}
                </a>
              </p>
              <p className="flex items-start gap-3">
                <svg className="w-4 h-4 flex-shrink-0 text-white/40 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                </svg>
                <span>
                  {COMPANY_DATA.address.street}
                  <br />
                  {COMPANY_DATA.address.postalCode} {COMPANY_DATA.address.city}
                </span>
              </p>
            </div>
          </div>

          {/* Bloque 3: Horarios */}
          <div>
            <h4 className="text-xs tracking-[0.18em] uppercase text-white/50 mb-5 font-medium">
              {tCommon("labels.schedule")}
            </h4>
            <div className="space-y-2.5 text-sm text-white/70">
              <p>{tCompany("businessHours.weekdays")}</p>
              <p>{tCompany("businessHours.saturday")}</p>
              <p>{tCompany("businessHours.sunday")}</p>
            </div>
          </div>
        </div>

        {/* Bloque Legal */}
        <div className="border-t border-white/10 pt-8 pb-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            {/* Links Legales */}
            <nav className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
              {LEGAL_ROUTES.map((route) => (
                <Link
                  key={route.href}
                  href={route.href}
                  className="text-white/40 hover:text-white/70 transition-colors"
                >
                  {tLegal(`links.${route.key}`)}
                </Link>
              ))}
            </nav>

            {/* Botón Configurar Cookies */}
            <button
              onClick={() => {
                localStorage.removeItem("cookie-consent");
                localStorage.removeItem("cookie-preferences");
                window.location.reload();
              }}
              className="text-sm text-white/40 hover:text-white/70 transition-colors whitespace-nowrap"
            >
              {tCommon("labels.configureCookies")}
            </button>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-white/10 pt-6 text-center">
          <p className="text-xs text-white/40">
            &copy; {currentYear} {COMPANY_DATA.legalName} &mdash; CIF: {COMPANY_DATA.cif}
          </p>
          <p className="text-[10px] text-white/25 mt-2 tracking-wide">
            {tCommon("labels.allRightsReserved")}
          </p>
        </div>
      </div>
    </footer>
  );
}
