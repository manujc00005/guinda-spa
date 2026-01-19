"use client";

import { useState, useEffect } from "react";

/**
 * HOOK DE GESTIÓN DE COOKIES
 *
 * ✅ Sistema completo de consentimiento RGPD
 * ✅ Activación/desactivación dinámica de cookies
 * ✅ Integración con Google Analytics (opcional)
 * ✅ Persistencia en localStorage
 */

export type CookieConsent = "accepted" | "rejected" | "partial" | null;

export interface CookiePreferences {
  necessary: boolean; // Siempre true (no se puede desactivar)
  analytics: boolean;
  marketing: boolean;
  personalization: boolean;
}

// Declarar tipos para Google Analytics
declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    dataLayer?: any[];
  }
}

export function useCookieConsent() {
  const [consent, setConsent] = useState<CookieConsent>(null);
  const [preferences, setPreferences] = useState<CookiePreferences>({
    necessary: true,
    analytics: false,
    marketing: false,
    personalization: false,
  });

  useEffect(() => {
    // Cargar consentimiento desde localStorage
    const savedConsent = localStorage.getItem("cookie-consent") as CookieConsent;
    setConsent(savedConsent);

    // Cargar preferencias desde localStorage
    const savedPreferences = localStorage.getItem("cookie-preferences");
    if (savedPreferences) {
      const parsedPreferences = JSON.parse(savedPreferences);
      setPreferences(parsedPreferences);

      // Aplicar preferencias guardadas
      applyPreferences(parsedPreferences);
    }
  }, []);

  /**
   * Aplica las preferencias de cookies activando/desactivando servicios
   */
  const applyPreferences = (prefs: CookiePreferences) => {
    // Google Analytics
    if (prefs.analytics) {
      enableGoogleAnalytics();
    } else {
      disableGoogleAnalytics();
    }

    // Marketing (Facebook Pixel, Google Ads, etc.)
    if (prefs.marketing) {
      enableMarketingCookies();
    } else {
      disableMarketingCookies();
    }

    // Personalización
    if (prefs.personalization) {
      enablePersonalizationCookies();
    } else {
      disablePersonalizationCookies();
    }

    console.log("Cookie preferences applied:", prefs);
  };

  /**
   * Activa Google Analytics
   */
  const enableGoogleAnalytics = () => {
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("consent", "update", {
        analytics_storage: "granted",
      });
      console.log("✅ Google Analytics activado");
    }
  };

  /**
   * Desactiva Google Analytics
   */
  const disableGoogleAnalytics = () => {
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("consent", "update", {
        analytics_storage: "denied",
      });
      console.log("❌ Google Analytics desactivado");
    }
  };

  /**
   * Activa cookies de marketing (Facebook Pixel, Google Ads)
   */
  const enableMarketingCookies = () => {
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("consent", "update", {
        ad_storage: "granted",
        ad_user_data: "granted",
        ad_personalization: "granted",
      });
      console.log("✅ Marketing cookies activadas");
    }
  };

  /**
   * Desactiva cookies de marketing
   */
  const disableMarketingCookies = () => {
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("consent", "update", {
        ad_storage: "denied",
        ad_user_data: "denied",
        ad_personalization: "denied",
      });
      console.log("❌ Marketing cookies desactivadas");
    }
  };

  /**
   * Activa cookies de personalización
   */
  const enablePersonalizationCookies = () => {
    if (typeof window !== "undefined") {
      // Aquí puedes activar servicios de personalización
      console.log("✅ Personalization cookies activadas");
    }
  };

  /**
   * Desactiva cookies de personalización
   */
  const disablePersonalizationCookies = () => {
    if (typeof window !== "undefined") {
      // Aquí puedes desactivar servicios de personalización
      console.log("❌ Personalization cookies desactivadas");
    }
  };

  /**
   * Acepta todas las cookies
   */
  const acceptAll = () => {
    const newPreferences: CookiePreferences = {
      necessary: true,
      analytics: true,
      marketing: true,
      personalization: true,
    };

    localStorage.setItem("cookie-consent", "accepted");
    localStorage.setItem("cookie-preferences", JSON.stringify(newPreferences));
    setConsent("accepted");
    setPreferences(newPreferences);

    applyPreferences(newPreferences);
  };

  /**
   * Rechaza todas las cookies (excepto las necesarias)
   */
  const rejectAll = () => {
    const newPreferences: CookiePreferences = {
      necessary: true,
      analytics: false,
      marketing: false,
      personalization: false,
    };

    localStorage.setItem("cookie-consent", "rejected");
    localStorage.setItem("cookie-preferences", JSON.stringify(newPreferences));
    setConsent("rejected");
    setPreferences(newPreferences);

    applyPreferences(newPreferences);
  };

  /**
   * Guarda preferencias personalizadas
   */
  const savePreferences = (newPreferences: CookiePreferences) => {
    localStorage.setItem("cookie-consent", "partial");
    localStorage.setItem("cookie-preferences", JSON.stringify(newPreferences));
    setConsent("partial");
    setPreferences(newPreferences);

    applyPreferences(newPreferences);
  };

  /**
   * Resetea el consentimiento (útil para testing o botón "Configurar cookies" en footer)
   */
  const resetConsent = () => {
    localStorage.removeItem("cookie-consent");
    localStorage.removeItem("cookie-preferences");
    setConsent(null);
    setPreferences({
      necessary: true,
      analytics: false,
      marketing: false,
      personalization: false,
    });

    // Desactivar todas las cookies no necesarias
    disableGoogleAnalytics();
    disableMarketingCookies();
    disablePersonalizationCookies();
  };

  return {
    consent,
    preferences,
    acceptAll,
    rejectAll,
    savePreferences,
    resetConsent,
  };
}
