"use client";

import { useState, useEffect } from "react";
import { CookiePreferences } from "../../hooks/useCookieConsent";

interface CookieConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (preferences: CookiePreferences) => void;
  initialPreferences: CookiePreferences;
}

interface CookieCategory {
  id: keyof CookiePreferences;
  title: string;
  description: string;
  required: boolean;
  examples: string[];
}

const COOKIE_CATEGORIES: CookieCategory[] = [
  {
    id: "necessary",
    title: "Cookies Necesarias",
    description:
      "Estas cookies son esenciales para el funcionamiento básico del sitio web. No se pueden desactivar ya que permiten funcionalidades básicas como la navegación por páginas y el acceso a áreas seguras.",
    required: true,
    examples: ["Sesión de usuario", "Idioma seleccionado", "Configuración de cookies"],
  },
  {
    id: "analytics",
    title: "Cookies Analíticas",
    description:
      "Estas cookies nos permiten analizar el uso del sitio web para medir y mejorar el rendimiento. Recopilan información de forma anónima sobre cómo los visitantes utilizan el sitio.",
    required: false,
    examples: ["Google Analytics", "Estadísticas de visitas", "Páginas más visitadas"],
  },
  {
    id: "marketing",
    title: "Cookies de Marketing",
    description:
      "Estas cookies se utilizan para mostrar anuncios relevantes y medir la eficacia de nuestras campañas publicitarias. Pueden ser establecidas por nuestros socios publicitarios.",
    required: false,
    examples: ["Facebook Pixel", "Google Ads", "Remarketing"],
  },
  {
    id: "personalization",
    title: "Cookies de Personalización",
    description:
      "Estas cookies permiten recordar tus preferencias y personalizar tu experiencia de navegación, como tu ubicación o el idioma preferido.",
    required: false,
    examples: ["Preferencias de visualización", "Contenido personalizado", "Recomendaciones"],
  },
];

export function CookieConfigModal({
  isOpen,
  onClose,
  onSave,
  initialPreferences,
}: CookieConfigModalProps) {
  const [preferences, setPreferences] = useState<CookiePreferences>(initialPreferences);
  const [activeTab, setActiveTab] = useState<keyof CookiePreferences | "all">("all");

  useEffect(() => {
    setPreferences(initialPreferences);
  }, [initialPreferences]);

  useEffect(() => {
    // Bloquear scroll del body cuando el modal está abierto
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const handleToggle = (category: keyof CookiePreferences) => {
    if (category === "necessary") return; // No se puede desactivar
    setPreferences((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  const handleAcceptAll = () => {
    const allAccepted: CookiePreferences = {
      necessary: true,
      analytics: true,
      marketing: true,
      personalization: true,
    };
    onSave(allAccepted);
    onClose();
  };

  const handleRejectAll = () => {
    const allRejected: CookiePreferences = {
      necessary: true,
      analytics: false,
      marketing: false,
      personalization: false,
    };
    onSave(allRejected);
    onClose();
  };

  const handleSavePreferences = () => {
    onSave(preferences);
    onClose();
  };

  if (!isOpen) return null;

  const activeCount = Object.values(preferences).filter(Boolean).length;
  const totalCount = Object.keys(preferences).length;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 z-[100] transition-opacity duration-300"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div className="fixed inset-0 z-[101] overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4">
          <div
            className="relative bg-white rounded-lg shadow-[var(--shadow-premium)] w-full max-w-4xl max-h-[90vh] overflow-hidden animate-fade-in-up"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-(--color-border) px-6 py-4 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-playfair font-semibold text-(--color-text-primary)">
                  Configuración de Cookies
                </h2>
                <p className="text-sm text-(--color-text-secondary) mt-1">
                  {activeCount} de {totalCount} categorías activas
                </p>
              </div>
              <button
                onClick={onClose}
                className="text-(--color-text-secondary) hover:text-(--color-text-primary) transition-colors"
                aria-label="Cerrar modal"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Tabs */}
            <div className="sticky top-[73px] bg-white border-b border-(--color-border) px-6 overflow-x-auto">
              <div className="flex gap-2 py-3">
                <button
                  onClick={() => setActiveTab("all")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                    activeTab === "all"
                      ? "bg-(--color-primary) text-white"
                      : "bg-(--color-bg-light) text-(--color-text-secondary) hover:text-(--color-text-primary)"
                  }`}
                >
                  Todas ({totalCount})
                </button>
                {COOKIE_CATEGORIES.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setActiveTab(category.id)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                      activeTab === category.id
                        ? "bg-(--color-primary) text-white"
                        : "bg-(--color-bg-light) text-(--color-text-secondary) hover:text-(--color-text-primary)"
                    }`}
                  >
                    {category.title.split(" ")[1]}
                  </button>
                ))}
              </div>
            </div>

            {/* Content */}
            <div className="px-6 py-6 overflow-y-auto max-h-[calc(90vh-200px)]">
              {activeTab === "all" ? (
                <div className="space-y-6">
                  {COOKIE_CATEGORIES.map((category) => (
                    <CategoryCard
                      key={category.id}
                      category={category}
                      isEnabled={preferences[category.id]}
                      onToggle={() => handleToggle(category.id)}
                    />
                  ))}
                </div>
              ) : (
                <div>
                  {COOKIE_CATEGORIES.filter((c) => c.id === activeTab).map((category) => (
                    <CategoryCard
                      key={category.id}
                      category={category}
                      isEnabled={preferences[category.id]}
                      onToggle={() => handleToggle(category.id)}
                      expanded
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="sticky bottom-0 bg-white border-t border-(--color-border) px-6 py-4">
              <div className="flex flex-col sm:flex-row gap-3 justify-end">
                <button
                  onClick={handleRejectAll}
                  className="btn-outline px-6 py-3 text-sm whitespace-nowrap"
                >
                  Rechazar todas
                </button>
                <button
                  onClick={handleSavePreferences}
                  className="btn-outline px-6 py-3 text-sm whitespace-nowrap"
                >
                  Guardar selección
                </button>
                <button
                  onClick={handleAcceptAll}
                  className="btn-primary px-6 py-3 text-sm whitespace-nowrap"
                >
                  Aceptar todas
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

interface CategoryCardProps {
  category: CookieCategory;
  isEnabled: boolean;
  onToggle: () => void;
  expanded?: boolean;
}

function CategoryCard({ category, isEnabled, onToggle, expanded = false }: CategoryCardProps) {
  const [isExpanded, setIsExpanded] = useState(expanded);

  return (
    <div className="border border-(--color-border) rounded-lg p-5 hover:border-(--color-primary)/30 transition-colors">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="font-semibold text-(--color-text-primary)">{category.title}</h3>
            {category.required && (
              <span className="text-xs bg-(--color-accent-light) text-(--color-accent) px-2 py-1 rounded">
                Requeridas
              </span>
            )}
          </div>
          <p className="text-sm text-(--color-text-secondary) leading-relaxed mb-3">
            {category.description}
          </p>

          {/* Toggle expandir/contraer */}
          {!expanded && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-sm text-(--color-primary) hover:underline font-medium"
            >
              {isExpanded ? "Ver menos" : "Ver más detalles"}
            </button>
          )}

          {/* Ejemplos (expandible) */}
          {(isExpanded || expanded) && (
            <div className="mt-4 p-3 bg-(--color-bg-light) rounded-lg">
              <p className="text-xs font-semibold text-(--color-text-secondary) mb-2">
                Ejemplos de uso:
              </p>
              <ul className="space-y-1">
                {category.examples.map((example, index) => (
                  <li key={index} className="text-xs text-(--color-text-secondary) flex items-start gap-2">
                    <span className="text-(--color-primary) mt-0.5">•</span>
                    <span>{example}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Toggle Switch */}
        <button
          onClick={onToggle}
          disabled={category.required}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-(--color-primary) focus:ring-offset-2 ${
            isEnabled ? "bg-(--color-primary)" : "bg-gray-300"
          } ${category.required ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
          role="switch"
          aria-checked={isEnabled}
          aria-label={`${isEnabled ? "Desactivar" : "Activar"} ${category.title}`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              isEnabled ? "translate-x-6" : "translate-x-1"
            }`}
          />
        </button>
      </div>
    </div>
  );
}
