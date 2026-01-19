"use client";

import { COMPANY_DATA } from "../../data/company";
import { SOCIAL_MEDIA, LEGAL_LINKS } from "../../data/social";
import Link from "next/link";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer id="contacto" className="py-16 md:py-24 bg-(--color-text-primary) text-white">
      <div className="container-page">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          {/* Bloque 1: Marca + Descripción */}
          <div className="md:col-span-2">
            <h3 className="text-2xl font-playfair font-semibold mb-4">{COMPANY_DATA.brandName}</h3>
            <p className="text-sm text-white/80 leading-relaxed mb-6">{COMPANY_DATA.description}</p>

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
                    className="text-white hover:text-(--color-primary) hover:scale-110 transition-all duration-200"
                  >
                    <IconComponent className="w-6 h-6" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Bloque 2: Contacto */}
          <div>
            <h4 className="font-semibold mb-4 tracking-wide text-white">Contacto</h4>
            <div className="space-y-2 text-sm text-white/80">
              <p className="flex items-start gap-2">
                <span className="flex-shrink-0">📞</span>
                <a
                  href={`tel:${COMPANY_DATA.contact.phone.replace(/\s/g, "")}`}
                  className="hover:text-white transition-colors"
                >
                  {COMPANY_DATA.contact.phone}
                </a>
              </p>
              <p className="flex items-start gap-2">
                <span className="flex-shrink-0">✉️</span>
                <a
                  href={`mailto:${COMPANY_DATA.contact.email}`}
                  className="hover:text-white transition-colors"
                >
                  {COMPANY_DATA.contact.email}
                </a>
              </p>
              <p className="flex items-start gap-2">
                <span className="flex-shrink-0">📍</span>
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
            <h4 className="font-semibold mb-4 tracking-wide text-white">Horario</h4>
            <div className="space-y-2 text-sm text-white/80">
              <p>{COMPANY_DATA.businessHours.weekdays}</p>
              <p>{COMPANY_DATA.businessHours.saturday}</p>
              <p>{COMPANY_DATA.businessHours.sunday}</p>
            </div>
          </div>
        </div>

        {/* Bloque Legal */}
        <div className="border-t border-white/20 pt-8 pb-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            {/* Links Legales */}
            <nav className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
              {LEGAL_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-white/60 hover:text-white transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Botón Configurar Cookies */}
            <button
              onClick={() => {
                // Resetear el consentimiento para mostrar el banner de nuevo
                localStorage.removeItem("cookie-consent");
                localStorage.removeItem("cookie-preferences");
                window.location.reload();
              }}
              className="text-sm text-white/60 hover:text-white transition-colors whitespace-nowrap"
            >
              ⚙️ Configurar cookies
            </button>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-white/20 pt-6 text-center">
          <p className="text-sm text-white/60">
            &copy; {currentYear} {COMPANY_DATA.legalName} - CIF: {COMPANY_DATA.cif}
          </p>
          <p className="text-xs text-white/40 mt-2">Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
