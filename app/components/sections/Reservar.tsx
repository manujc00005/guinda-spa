"use client";

import { useTranslations } from "next-intl";
import { RESERVAR_DATA } from "../../data/reservar";
import { SectionShell } from "../ui/SectionShell";
import { SectionHeader } from "../ui/SectionHeader";
import { Card } from "../ui/Card";

/**
 * SECCIÓN RESERVAR — i18n
 *
 * Textos vienen de traducciones, hrefs del data file.
 */

const STEP_KEYS = ["1", "2", "3"] as const;

export function Reservar() {
  const t = useTranslations("reservar");
  const tCommon = useTranslations("common");

  return (
    <SectionShell id="reservar" bg="ivory">
      <div className="max-w-4xl mx-auto">
        <SectionHeader
          eyebrow={t("header.eyebrow")}
          titulo={t("header.title")}
          descripcion={t("header.description")}
        />

        {/* 3 Pasos */}
        <div className="grid md:grid-cols-3 gap-8 mb-14">
          {RESERVAR_DATA.pasos.map((paso) => (
            <div key={paso.numero} className="text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-(--color-primary) text-white flex items-center justify-center text-2xl font-playfair font-semibold mx-auto shadow-[var(--shadow-soft)]">
                {paso.numero}
              </div>
              <h3 className="font-semibold text-lg text-(--color-text-primary)">
                {t(`steps.${paso.numero}.title`)}
              </h3>
              <p className="text-sm text-(--color-text-secondary) leading-relaxed">
                {t(`steps.${paso.numero}.description`)}
              </p>
            </div>
          ))}
        </div>

        {/* Contacto Card */}
        <Card className="p-10 md:p-12 text-center space-y-6">
          <h3 className="text-2xl font-playfair font-semibold text-(--color-text-primary)">
            {t("contactTitle")}
          </h3>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href={RESERVAR_DATA.contacto.telefono.href}
              className="btn-primary px-10 py-4 text-base w-full sm:w-auto inline-flex items-center justify-center gap-2"
            >
              <span>{RESERVAR_DATA.contacto.telefono.label}</span>
            </a>
            <a
              href={RESERVAR_DATA.contacto.whatsapp.href}
              className="btn-outline px-10 py-4 text-base w-full sm:w-auto inline-flex items-center justify-center gap-2"
            >
              <span>{t("whatsappLabel")}</span>
            </a>
          </div>
          <p className="text-sm text-(--color-text-secondary)">
            {tCommon("labels.alsoWriteUs")}{" "}
            <a
              href={RESERVAR_DATA.contacto.email.href}
              className="text-(--color-primary) hover:underline font-medium"
            >
              {RESERVAR_DATA.contacto.email.label}
            </a>
          </p>
        </Card>
      </div>
    </SectionShell>
  );
}
