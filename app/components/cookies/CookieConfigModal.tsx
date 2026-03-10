"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { CookiePreferences } from "../../hooks/useCookieConsent";

interface CookieConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (preferences: CookiePreferences) => void;
  initialPreferences: CookiePreferences;
}

const CATEGORY_IDS: (keyof CookiePreferences)[] = [
  "necessary",
  "analytics",
  "marketing",
  "personalization",
];

export function CookieConfigModal({
  isOpen,
  onClose,
  onSave,
  initialPreferences,
}: CookieConfigModalProps) {
  const [preferences, setPreferences] = useState<CookiePreferences>(initialPreferences);
  const [activeTab, setActiveTab] = useState<keyof CookiePreferences | "all">("all");
  const t = useTranslations("cookies.modal");
  const tCommon = useTranslations("common");

  useEffect(() => {
    setPreferences(initialPreferences);
  }, [initialPreferences]);

  useEffect(() => {
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
    if (category === "necessary") return;
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
                  {t("title")}
                </h2>
                <p className="text-sm text-(--color-text-secondary) mt-1">
                  {t("activeCount", { active: activeCount, total: totalCount })}
                </p>
              </div>
              <button
                onClick={onClose}
                className="text-(--color-text-secondary) hover:text-(--color-text-primary) transition-colors"
                aria-label={tCommon("aria.closeModal")}
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
                  {t("tabs.all")} ({totalCount})
                </button>
                {CATEGORY_IDS.map((catId) => (
                  <button
                    key={catId}
                    onClick={() => setActiveTab(catId)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                      activeTab === catId
                        ? "bg-(--color-primary) text-white"
                        : "bg-(--color-bg-light) text-(--color-text-secondary) hover:text-(--color-text-primary)"
                    }`}
                  >
                    {t(`categories.${catId}.title`).split(" ").slice(1).join(" ")}
                  </button>
                ))}
              </div>
            </div>

            {/* Content */}
            <div className="px-6 py-6 overflow-y-auto max-h-[calc(90vh-200px)]">
              {activeTab === "all" ? (
                <div className="space-y-6">
                  {CATEGORY_IDS.map((catId) => (
                    <CategoryCard
                      key={catId}
                      categoryId={catId}
                      isRequired={catId === "necessary"}
                      isEnabled={preferences[catId]}
                      onToggle={() => handleToggle(catId)}
                    />
                  ))}
                </div>
              ) : (
                <div>
                  <CategoryCard
                    categoryId={activeTab}
                    isRequired={activeTab === "necessary"}
                    isEnabled={preferences[activeTab]}
                    onToggle={() => handleToggle(activeTab)}
                    expanded
                  />
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
                  {t("rejectAll")}
                </button>
                <button
                  onClick={handleSavePreferences}
                  className="btn-outline px-6 py-3 text-sm whitespace-nowrap"
                >
                  {t("saveSelection")}
                </button>
                <button
                  onClick={handleAcceptAll}
                  className="btn-primary px-6 py-3 text-sm whitespace-nowrap"
                >
                  {t("acceptAll")}
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
  categoryId: keyof CookiePreferences;
  isRequired: boolean;
  isEnabled: boolean;
  onToggle: () => void;
  expanded?: boolean;
}

function CategoryCard({ categoryId, isRequired, isEnabled, onToggle, expanded = false }: CategoryCardProps) {
  const [isExpanded, setIsExpanded] = useState(expanded);
  const t = useTranslations("cookies.modal");
  const tCommon = useTranslations("common");

  // Get examples as an array from translations
  const examples: string[] = [];
  for (let i = 0; i < 3; i++) {
    try {
      examples.push(t(`categories.${categoryId}.examples.${i}`));
    } catch {
      break;
    }
  }

  return (
    <div className="border border-(--color-border) rounded-lg p-5 hover:border-(--color-primary)/30 transition-colors">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="font-semibold text-(--color-text-primary)">
              {t(`categories.${categoryId}.title`)}
            </h3>
            {isRequired && (
              <span className="text-xs bg-(--color-accent-light) text-(--color-accent) px-2 py-1 rounded">
                {tCommon("labels.required")}
              </span>
            )}
          </div>
          <p className="text-sm text-(--color-text-secondary) leading-relaxed mb-3">
            {t(`categories.${categoryId}.description`)}
          </p>

          {!expanded && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-sm text-(--color-primary) hover:underline font-medium"
            >
              {isExpanded ? tCommon("labels.viewLess") : tCommon("labels.viewMore")}
            </button>
          )}

          {(isExpanded || expanded) && (
            <div className="mt-4 p-3 bg-(--color-bg-light) rounded-lg">
              <p className="text-xs font-semibold text-(--color-text-secondary) mb-2">
                {tCommon("labels.usageExamples")}
              </p>
              <ul className="space-y-1">
                {examples.map((example, index) => (
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
          disabled={isRequired}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-(--color-primary) focus:ring-offset-2 ${
            isEnabled ? "bg-(--color-primary)" : "bg-gray-300"
          } ${isRequired ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
          role="switch"
          aria-checked={isEnabled}
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
