"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useCookieConsent, CookiePreferences } from "../../hooks/useCookieConsent";
import { CookieConfigModal } from "./CookieConfigModal";

/**
 * BANNER DE COOKIES CON CONFIGURACIÓN AVANZADA
 *
 * ✅ Sistema completo de gestión de cookies compatible con RGPD
 * ✅ Modal de configuración granular por categorías
 * ✅ Integración con Google Analytics (opcional)
 * ✅ Persistencia en localStorage
 *
 * Para empresas con requisitos estrictos de cumplimiento legal,
 * considera usar una librería certificada como Cookiebot o OneTrust.
 */

export function CookieBanner() {
  const [showBanner, setShowBanner] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const { consent, preferences, acceptAll, rejectAll, savePreferences } = useCookieConsent();

  useEffect(() => {
    // Verificar si ya hay consentimiento guardado
    if (!consent) {
      setShowBanner(true);
    }
  }, [consent]);

  const handleAccept = () => {
    acceptAll();
    setShowBanner(false);
  };

  const handleReject = () => {
    rejectAll();
    setShowBanner(false);
  };

  const handleConfigure = () => {
    setShowModal(true);
  };

  const handleSaveModal = (newPreferences: CookiePreferences) => {
    savePreferences(newPreferences);
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <>
      {/* Banner */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-(--color-border) shadow-[var(--shadow-premium)] p-6 md:p-8 animate-slide-up">
        <div className="container-page max-w-6xl">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            {/* Texto */}
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-(--color-text-primary) mb-2">
                🍪 Utilizamos cookies
              </h3>
              <p className="text-sm text-(--color-text-secondary) leading-relaxed">
                Utilizamos cookies propias y de terceros para mejorar nuestros servicios y mostrarle publicidad
                relacionada con sus preferencias mediante el análisis de sus hábitos de navegación.{" "}
                <Link href="/cookies" className="text-(--color-primary) hover:underline font-medium">
                  Más información
                </Link>
              </p>
            </div>

            {/* Botones */}
            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              <button
                onClick={handleReject}
                className="btn-outline px-6 py-3 text-sm whitespace-nowrap"
              >
                Rechazar
              </button>
              <button
                onClick={handleConfigure}
                className="btn-outline px-6 py-3 text-sm whitespace-nowrap"
              >
                Configurar
              </button>
              <button
                onClick={handleAccept}
                className="btn-primary px-6 py-3 text-sm whitespace-nowrap"
              >
                Aceptar todas
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de configuración */}
      <CookieConfigModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSave={handleSaveModal}
        initialPreferences={preferences}
      />
    </>
  );
}
