"use client";

import { Fragment } from "react";
import { useLocale } from "next-intl";
import { useRouter, usePathname } from "../../../i18n/routing";

const LOCALE_LABELS: Record<string, string> = {
  es: "ES",
  en: "EN",
  fr: "FR",
};

interface LanguageSelectorProps {
  className?: string;
}

export function LanguageSelector({ className = "" }: LanguageSelectorProps) {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const handleLocaleChange = (newLocale: string) => {
    router.replace(pathname, { locale: newLocale as any });
  };

  return (
    <div
      className={`flex items-center gap-1.5 text-xs tracking-wide ${className}`}
    >
      {Object.entries(LOCALE_LABELS).map(([code, label], index) => (
        <Fragment key={code}>
          {index > 0 && (
            <span className="text-current opacity-30 select-none">/</span>
          )}
          <button
            onClick={() => handleLocaleChange(code)}
            className={[
              "transition-opacity duration-200",
              code === locale
                ? "font-semibold opacity-100"
                : "font-normal opacity-50 hover:opacity-80",
            ].join(" ")}
            aria-label={`Switch to ${label}`}
            aria-current={code === locale ? "true" : undefined}
          >
            {label}
          </button>
        </Fragment>
      ))}
    </div>
  );
}
