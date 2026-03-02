import { CompanyData } from "../types/company";

/**
 * DATOS CENTRALES DE LA EMPRESA
 *
 * ⚠️ IMPORTANTE: Estos son datos PLACEHOLDER.
 * Debes reemplazar con los datos reales de tu empresa.
 *
 * Estos datos se reutilizan en:
 * - Header (brandName)
 * - Footer (todos los campos)
 * - Aviso Legal (legalName, CIF, address)
 * - Política de Privacidad (responsable del tratamiento)
 * - Todas las páginas legales
 */

export const COMPANY_DATA: CompanyData = {
  // Nombre comercial (aparece en header, hero, etc.)
  brandName: "Guinda Wellness & Spa",

  // Razón social (aparece en textos legales)
  legalName: "Guinda Wellness & Spa S.L.", // ⚠️ CAMBIAR POR RAZÓN SOCIAL REAL

  // CIF/NIF de la empresa
  cif: "B-12345678", // ⚠️ CAMBIAR POR CIF REAL

  // Dirección fiscal completa
  address: {
    street: "Calle del Bienestar, 123", // ⚠️ CAMBIAR
    city: "Madrid", // ⚠️ CAMBIAR
    postalCode: "28001", // ⚠️ CAMBIAR
    province: "Madrid", // ⚠️ CAMBIAR
    country: "España",
  },

  // Datos de contacto
  contact: {
    phone: "+34 900 123 456", // ⚠️ CAMBIAR POR TELÉFONO REAL
    email: "info@guindawellness.es", // ⚠️ CAMBIAR POR EMAIL REAL
    whatsapp: "34900123456", // ⚠️ CAMBIAR (sin +, sin espacios)
  },

  // Horario de atención
  businessHours: {
    weekdays: "Lunes a Viernes: 9:00 - 21:00",
    saturday: "Sábados: 10:00 - 20:00",
    sunday: "Domingos: 10:00 - 19:00",
  },

  // Año de fundación (opcional)
  yearFounded: 2020, // ⚠️ CAMBIAR O ELIMINAR

  // Descripción breve para footer
  description: "Spa privado en Hotel TRH Mijas. Circuito exclusivo, masajes terapéuticos y experiencias wellness en pareja.",
};
