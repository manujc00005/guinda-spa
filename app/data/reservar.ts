import { SectionHeaderData, PreguntaFAQ } from "../types/common";
import { COMPANY_DATA } from "./company";

/**
 * DATOS DE LA SECCIÓN "RESERVAR"
 *
 * ✅ Los datos de contacto ahora se toman de COMPANY_DATA (centralizado)
 * Solo edita aquí los textos de los pasos y el título
 */

export const RESERVAR_DATA = {
  header: {
    eyebrow: "Proceso simple",
    titulo: "Cómo reservar",
    descripcion: "Reserva tu experiencia en 3 pasos sencillos",
  } as SectionHeaderData,
  pasos: [
    {
      numero: 1,
      titulo: "Elige tu servicio",
      descripcion: "Selecciona el tratamiento o pack que prefieras",
    },
    {
      numero: 2,
      titulo: "Contáctanos",
      descripcion: "Por teléfono, email o WhatsApp",
    },
    {
      numero: 3,
      titulo: "Disfruta",
      descripcion: "Llega 10 minutos antes y relájate",
    },
  ],
  contacto: {
    titulo: "Contacta con nosotros",
    telefono: {
      numero: COMPANY_DATA.contact.phone.replace(/\s/g, ""),
      label: `📞 ${COMPANY_DATA.contact.phone}`,
      href: `tel:${COMPANY_DATA.contact.phone.replace(/\s/g, "")}`,
    },
    whatsapp: {
      numero: COMPANY_DATA.contact.whatsapp,
      label: "💬 WhatsApp",
      href: `https://wa.me/${COMPANY_DATA.contact.whatsapp}`,
    },
    email: {
      direccion: COMPANY_DATA.contact.email,
      label: COMPANY_DATA.contact.email,
      href: `mailto:${COMPANY_DATA.contact.email}`,
    },
  },
};

export const FAQ_DATA = {
  header: {
    eyebrow: "Dudas frecuentes",
    titulo: "Preguntas frecuentes",
  } as SectionHeaderData,
  preguntas: [
    {
      pregunta: "¿Cuánto tiempo antes debo reservar?",
      respuesta:
        "Recomendamos reservar con al menos 48 horas de antelación para garantizar disponibilidad, aunque intentamos adaptarnos a tu horario siempre que sea posible.",
    },
    {
      pregunta: "¿Qué debo llevar al spa?",
      respuesta:
        "Nosotros proporcionamos toallas, albornoz y zapatillas. Solo necesitas traer tu bañador y ganas de relajarte.",
    },
    {
      pregunta: "¿Puedo cancelar o modificar mi reserva?",
      respuesta:
        "Sí, puedes cancelar o modificar tu reserva con hasta 24 horas de antelación sin coste adicional. Contacta con nosotros por teléfono o WhatsApp.",
    },
    {
      pregunta: "¿Los bonos regalo tienen caducidad?",
      respuesta:
        "Los bonos regalo tienen validez de 12 meses desde la fecha de compra. Son transferibles y se pueden canjear por cualquier servicio de nuestro spa.",
    },
    {
      pregunta: "¿El circuito spa es privado?",
      respuesta:
        "Sí, todos nuestros circuitos spa son 100% privados. Tendrás el espacio exclusivamente para ti o tu acompañante durante los 60 minutos.",
    },
    {
      pregunta: "¿Hay parking disponible?",
      respuesta:
        "Disponemos de parking gratuito para clientes. Te proporcionaremos información detallada al confirmar tu reserva.",
    },
  ] as PreguntaFAQ[],
};
