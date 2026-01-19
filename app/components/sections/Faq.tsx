/**
 * SECCIÓN FAQ CON CTA WHATSAPP
 *
 * Sección dedicada a preguntas frecuentes con:
 * - Bloque superior: CTA para consultas por WhatsApp
 * - Lista de preguntas con Accordions
 * - Diseño orientado a conversión
 */

import { FAQ_DATA } from "../../data/reservar";
import { WHATSAPP_CONSULTA } from "../../data/social";
import { COMPANY_DATA } from "../../data/company";
import { SectionShell } from "../ui/SectionShell";
import { SectionHeader } from "../ui/SectionHeader";
import { Accordion } from "../ui/Accordion";

export function Faq() {
  return (
    <SectionShell id="faq" bg="white">
      <div className="max-w-3xl mx-auto">
        <SectionHeader {...FAQ_DATA.header} />

        {/* CTA WhatsApp Superior */}
        <div className="mb-12 p-8 md:p-10 bg-(--color-ivory) rounded-2xl border border-(--color-border)">
          <div className="text-center">
            <h3 className="text-xl md:text-2xl font-playfair font-semibold text-(--color-text-primary) mb-3">
              ¿Tienes una consulta?
            </h3>
            <p className="text-sm md:text-base text-(--color-text-secondary) leading-relaxed mb-6 max-w-xl mx-auto">
              Nuestro equipo está disponible para resolver tus dudas de forma rápida y personalizada.
              Escríbenos por WhatsApp y te respondemos en minutos.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-4">
              <a
                href={WHATSAPP_CONSULTA.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={WHATSAPP_CONSULTA.ariaLabel}
                className="btn-primary px-8 py-4 text-base w-full sm:w-auto inline-flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                </svg>
                {WHATSAPP_CONSULTA.label}
              </a>
            </div>

            <p className="text-xs text-(--color-text-secondary)">
              Horario de atención: {COMPANY_DATA.businessHours.weekdays}
            </p>
          </div>
        </div>

        {/* Lista de FAQs */}
        <div className="space-y-4">
          {FAQ_DATA.preguntas.map((pregunta, index) => (
            <Accordion key={index} pregunta={pregunta} />
          ))}
        </div>

        {/* CTA Bottom (opcional, más sutil) */}
        <div className="mt-12 text-center">
          <p className="text-sm text-(--color-text-secondary) mb-4">
            ¿No encuentras lo que buscas?
          </p>
          <a
            href={WHATSAPP_CONSULTA.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-(--color-primary) hover:underline"
          >
            Contáctanos directamente →
          </a>
        </div>
      </div>
    </SectionShell>
  );
}
