import { LegalTexts } from "../types/legal";
import { COMPANY_DATA } from "./company";

/**
 * TEXTOS LEGALES
 *
 * ⚠️ IMPORTANTE: Estos textos son plantillas genéricas.
 * DEBES revisarlos con un abogado especializado en RGPD y LSSI-CE.
 *
 * Los campos marcados con {{VARIABLE}} se sustituyen automáticamente
 * desde COMPANY_DATA.
 */

export const LEGAL_TEXTS: LegalTexts = {
  avisoLegal: {
    title: "Aviso Legal",
    lastUpdated: "Última actualización: 19 de enero de 2026", // ⚠️ CAMBIAR FECHA
    sections: [
      {
        title: "1. Identificación del Responsable",
        content: `En cumplimiento del artículo 10 de la Ley 34/2002, de 11 de julio, de Servicios de la Sociedad de la Información y de Comercio Electrónico (LSSI-CE), se informa de los datos del titular de este sitio web:

**Razón Social:** ${COMPANY_DATA.legalName}
**NIF/CIF:** ${COMPANY_DATA.cif}
**Domicilio Social:** ${COMPANY_DATA.address.street}, ${COMPANY_DATA.address.postalCode} ${COMPANY_DATA.address.city}, ${COMPANY_DATA.address.province}, ${COMPANY_DATA.address.country}
**Correo Electrónico:** ${COMPANY_DATA.contact.email}
**Teléfono:** ${COMPANY_DATA.contact.phone}`,
      },
      {
        title: "2. Objeto",
        content: `El presente sitio web tiene por objeto proporcionar información sobre los servicios de spa, masajes y tratamientos de bienestar ofrecidos por ${COMPANY_DATA.brandName}, así como facilitar la reserva de los mismos.`,
      },
      {
        title: "3. Condiciones de Uso",
        content: `El acceso y uso de este sitio web implica la aceptación expresa de las presentes condiciones de uso. El usuario se compromete a hacer un uso adecuado de los contenidos y servicios que ${COMPANY_DATA.brandName} ofrece a través de su sitio web y a no emplearlos para:

- Incurrir en actividades ilícitas, ilegales o contrarias a la buena fe y al orden público.
- Difundir contenidos o propaganda de carácter racista, xenófobo, pornográfico-ilegal, de apología del terrorismo o atentatorio contra los derechos humanos.
- Provocar daños en los sistemas físicos y lógicos de ${COMPANY_DATA.brandName}, de sus proveedores o de terceras personas.`,
      },
      {
        title: "4. Propiedad Intelectual e Industrial",
        content: `Todos los contenidos de este sitio web, incluyendo, de forma enunciativa pero no limitativa, textos, fotografías, gráficos, imágenes, iconos, tecnología, software, así como su diseño gráfico y códigos fuente, constituyen una obra cuya propiedad pertenece a ${COMPANY_DATA.legalName}, sin que puedan entenderse cedidos al usuario ninguno de los derechos de explotación sobre los mismos más allá de lo estrictamente necesario para el correcto uso de la web.

Quedan expresamente prohibidas la reproducción, la distribución y la comunicación pública, incluida su modalidad de puesta a disposición, de la totalidad o parte de los contenidos de esta página web, con fines comerciales, en cualquier soporte y por cualquier medio técnico, sin la autorización de ${COMPANY_DATA.legalName}.`,
      },
      {
        title: "5. Responsabilidad",
        content: `${COMPANY_DATA.legalName} no se hace responsable de los daños y perjuicios de cualquier naturaleza que pudieran derivarse de:

- La falta de disponibilidad, mantenimiento y efectivo funcionamiento de la web o de sus servicios y contenidos.
- La existencia de virus, programas maliciosos o lesivos en los contenidos.
- El uso ilícito, negligente, fraudulento o contrario a las presentes Condiciones Generales.
- La falta de licitud, calidad, fiabilidad, utilidad y disponibilidad de los servicios prestados por terceros y puestos a disposición de los usuarios en el sitio web.

${COMPANY_DATA.legalName} se reserva el derecho de suspender temporalmente, y sin necesidad de previo aviso, la accesibilidad al sitio web con motivo de operaciones de mantenimiento, reparación, actualización o mejora.`,
      },
      {
        title: "6. Ley Aplicable y Jurisdicción",
        content: `Las presentes condiciones se rigen por la legislación española. Para la resolución de cualquier conflicto derivado del uso de este sitio web, las partes se someten a los Juzgados y Tribunales de ${COMPANY_DATA.address.city}, renunciando expresamente a cualquier otro fuero que pudiera corresponderles.`,
      },
    ],
  },

  privacidad: {
    title: "Política de Privacidad",
    lastUpdated: "Última actualización: 19 de enero de 2026", // ⚠️ CAMBIAR FECHA
    sections: [
      {
        title: "1. Responsable del Tratamiento",
        content: `De conformidad con el Reglamento (UE) 2016/679 del Parlamento Europeo y del Consejo de 27 de abril de 2016 (RGPD) y la Ley Orgánica 3/2018, de 5 de diciembre, de Protección de Datos Personales y garantía de los derechos digitales (LOPDGDD), informamos que:

**Responsable:** ${COMPANY_DATA.legalName}
**NIF/CIF:** ${COMPANY_DATA.cif}
**Domicilio:** ${COMPANY_DATA.address.street}, ${COMPANY_DATA.address.postalCode} ${COMPANY_DATA.address.city}, ${COMPANY_DATA.address.province}, ${COMPANY_DATA.address.country}
**Correo Electrónico:** ${COMPANY_DATA.contact.email}
**Teléfono:** ${COMPANY_DATA.contact.phone}`,
      },
      {
        title: "2. Datos que Recogemos",
        content: `Podemos recoger y tratar las siguientes categorías de datos personales:

**Datos de identificación:** nombre, apellidos, DNI/NIE.
**Datos de contacto:** dirección de correo electrónico, número de teléfono, dirección postal.
**Datos de navegación:** dirección IP, cookies, datos de navegación y geolocalización.
**Datos de transacciones:** información sobre reservas, pagos y servicios contratados.`,
      },
      {
        title: "3. Finalidad del Tratamiento",
        content: `Los datos personales que nos facilite serán tratados con las siguientes finalidades:

- **Gestión de reservas:** tramitar y gestionar las reservas de servicios de spa y tratamientos.
- **Comunicaciones comerciales:** envío de información sobre promociones, novedades y servicios (con su consentimiento previo).
- **Mejora del servicio:** análisis estadístico del uso del sitio web y personalización de la experiencia.
- **Cumplimiento legal:** cumplir con las obligaciones legales aplicables (facturación, contabilidad, etc.).`,
      },
      {
        title: "4. Legitimación",
        content: `La base legal para el tratamiento de sus datos personales es:

- **Ejecución de un contrato:** cuando realiza una reserva o contrata nuestros servicios.
- **Consentimiento expreso:** para el envío de comunicaciones comerciales.
- **Interés legítimo:** para la mejora de nuestros servicios y análisis estadístico.
- **Obligación legal:** para cumplir con obligaciones fiscales y contables.`,
      },
      {
        title: "5. Conservación de los Datos",
        content: `Los datos personales se conservarán durante el tiempo necesario para cumplir con la finalidad para la que se recabaron y para determinar las posibles responsabilidades que se pudieran derivar de dicha finalidad y del tratamiento de los datos. Posteriormente, se conservarán bloqueados durante los plazos legales de prescripción de responsabilidades.`,
      },
      {
        title: "6. Destinatarios de los Datos",
        content: `Sus datos personales no serán cedidos a terceros, salvo obligación legal. Podrán ser comunicados a:

- Proveedores de servicios tecnológicos (hosting, email marketing, pasarelas de pago).
- Administraciones públicas cuando exista una obligación legal.

Todos los proveedores cumplen con el RGPD y garantizan medidas de seguridad adecuadas.`,
      },
      {
        title: "7. Derechos del Usuario",
        content: `Puede ejercer los siguientes derechos en relación con sus datos personales:

- **Derecho de acceso:** conocer qué datos personales tenemos sobre usted.
- **Derecho de rectificación:** corregir datos inexactos o incompletos.
- **Derecho de supresión:** solicitar la eliminación de sus datos ("derecho al olvido").
- **Derecho de oposición:** oponerse al tratamiento de sus datos.
- **Derecho de limitación:** solicitar la limitación del tratamiento.
- **Derecho de portabilidad:** recibir sus datos en formato estructurado.

Para ejercer estos derechos, puede enviar un correo electrónico a ${COMPANY_DATA.contact.email} adjuntando una copia de su DNI/NIE.

Asimismo, tiene derecho a presentar una reclamación ante la Agencia Española de Protección de Datos (www.aepd.es).`,
      },
      {
        title: "8. Medidas de Seguridad",
        content: `${COMPANY_DATA.legalName} ha adoptado las medidas técnicas y organizativas necesarias para garantizar la seguridad de los datos personales y evitar su alteración, pérdida, tratamiento o acceso no autorizado, habida cuenta del estado de la tecnología, la naturaleza de los datos almacenados y los riesgos a que están expuestos.`,
      },
    ],
  },

  cookies: {
    title: "Política de Cookies",
    lastUpdated: "Última actualización: 19 de enero de 2026", // ⚠️ CAMBIAR FECHA
    sections: [
      {
        title: "1. ¿Qué son las cookies?",
        content: `Una cookie es un pequeño archivo de texto que un sitio web almacena en su ordenador, tableta o teléfono móvil cuando lo visita. Las cookies permiten que el sitio web recuerde sus acciones y preferencias durante un periodo de tiempo, para que no tenga que volver a configurarlas cada vez que regrese al sitio o navegue de una página a otra.`,
      },
      {
        title: "2. Tipos de cookies que utilizamos",
        content: `**Cookies técnicas (estrictamente necesarias):** Son imprescindibles para el funcionamiento del sitio web y no pueden desactivarse. Permiten la navegación y uso de las diferentes opciones o servicios que ofrece la web.

**Cookies analíticas:** Permiten cuantificar el número de usuarios y realizar análisis estadísticos del uso que hacen los usuarios del sitio web. Con esta información mejoramos el funcionamiento de la página web.

**Cookies de personalización:** Permiten recordar información para que el usuario acceda al servicio con determinadas características que pueden diferenciar su experiencia de la de otros usuarios (idioma, preferencias, etc.).

**Cookies publicitarias:** Permiten gestionar eficazmente los espacios publicitarios incluidos en nuestro sitio web, adecuando el contenido del anuncio al contenido del servicio solicitado o al uso que realice de nuestra web.`,
      },
      {
        title: "3. Cookies de terceros",
        content: `Este sitio web puede utilizar servicios de terceros que instalan cookies propias:

- **Google Analytics:** para análisis estadístico del tráfico web.
- **Google Tag Manager:** para gestión de etiquetas de marketing.
- **Redes sociales:** si compartimos contenido en redes sociales (Instagram, TikTok, etc.).

Estas cookies están sujetas a las políticas de privacidad de cada proveedor externo.`,
      },
      {
        title: "4. Cómo gestionar las cookies",
        content: `Puede configurar su navegador para aceptar o rechazar las cookies. Si rechaza las cookies, podrá seguir navegando por el sitio web, aunque el uso de algunos de sus servicios podrá ser limitado.

Puede obtener más información sobre cómo gestionar las cookies en su navegador en los siguientes enlaces:

- Chrome: https://support.google.com/chrome/answer/95647
- Firefox: https://support.mozilla.org/es/kb/habilitar-y-deshabilitar-cookies-sitios-web-rastrear-preferencias
- Safari: https://support.apple.com/es-es/guide/safari/sfri11471/mac
- Edge: https://support.microsoft.com/es-es/microsoft-edge/eliminar-las-cookies-en-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09

También puede gestionar sus preferencias de cookies en cualquier momento haciendo clic en "Configurar cookies" en el footer de nuestro sitio web.`,
      },
      {
        title: "5. Actualizaciones",
        content: `${COMPANY_DATA.legalName} puede modificar esta Política de Cookies en función de exigencias legislativas, reglamentarias, o con la finalidad de adaptar dicha política a las instrucciones dictadas por la Agencia Española de Protección de Datos.`,
      },
    ],
  },

  cancelaciones: {
    title: "Política de Cancelaciones y Devoluciones",
    lastUpdated: "Última actualización: 19 de enero de 2026", // ⚠️ CAMBIAR FECHA
    sections: [
      {
        title: "1. Cancelación de Reservas",
        content: `Las reservas de servicios de spa y tratamientos pueden cancelarse o modificarse sin coste adicional con un mínimo de **48 horas de antelación** respecto a la fecha y hora reservadas.

**Cancelaciones con menos de 48 horas de antelación:**
- Si cancela con menos de 48 horas pero más de 24 horas de antelación: se cobrará el **50% del importe** del servicio reservado.
- Si cancela con menos de 24 horas de antelación o no se presenta: se cobrará el **100% del importe** del servicio reservado.

Para cancelar o modificar una reserva, puede contactarnos:
- Por teléfono: ${COMPANY_DATA.contact.phone}
- Por email: ${COMPANY_DATA.contact.email}
- Por WhatsApp: +${COMPANY_DATA.contact.whatsapp}`,
      },
      {
        title: "2. Bonos Regalo",
        content: `**Validez:** Los bonos regalo tienen una validez de **12 meses** desde la fecha de compra.

**Devoluciones:** Los bonos regalo no son reembolsables una vez adquiridos. Sin embargo, son **transferibles**, lo que significa que pueden ser utilizados por otra persona si el comprador original no puede hacerlo.

**Canje:** Para canjear un bono regalo, debe presentarlo en el momento de realizar la reserva. Los bonos pueden canjearse por cualquier servicio de nuestro spa hasta el importe del bono. Si el servicio elegido es de menor importe, no se devuelve la diferencia. Si es de mayor importe, deberá abonar la diferencia.`,
      },
      {
        title: "3. Reembolsos",
        content: `En caso de cancelación con más de 48 horas de antelación, se procederá al reembolso del **100% del importe** pagado en un plazo máximo de **14 días naturales** desde la fecha de cancelación.

El reembolso se realizará mediante el mismo método de pago utilizado en la compra original.

**Excepciones:** No se realizarán reembolsos en los siguientes casos:
- Cuando el cliente no se presente a la cita sin previo aviso.
- Cuando el cliente cancele con menos de 24 horas de antelación.
- Para bonos regalo (no reembolsables, pero transferibles).`,
      },
      {
        title: "4. Modificaciones de Reserva",
        content: `Puede modificar la fecha u hora de su reserva sin coste adicional siempre que lo comunique con un mínimo de **48 horas de antelación** y exista disponibilidad en la nueva fecha/hora solicitada.

Para modificar su reserva, contacte con nosotros por teléfono, email o WhatsApp.`,
      },
      {
        title: "5. Causas de Fuerza Mayor",
        content: `En caso de causas de fuerza mayor que impidan la prestación del servicio (condiciones meteorológicas extremas, emergencias sanitarias, etc.), ${COMPANY_DATA.brandName} se pondrá en contacto con el cliente para reprogramar el servicio o proceder al reembolso íntegro del importe pagado.`,
      },
      {
        title: "6. Derecho de Desistimiento",
        content: `De acuerdo con el artículo 103 del Real Decreto Legislativo 1/2007, de 16 de noviembre, por el que se aprueba el texto refundido de la Ley General para la Defensa de los Consumidores y Usuarios, **el derecho de desistimiento no aplica a la prestación de servicios de esparcimiento o recreo cuando el contrato prevea una fecha o un período de ejecución específicos**.

Por tanto, una vez confirmada la reserva y fijada la fecha y hora del servicio, no aplica el derecho de desistimiento de 14 días establecido para compras online. No obstante, puede cancelar su reserva según las condiciones indicadas en el punto 1 de esta política.`,
      },
      {
        title: "7. Contacto",
        content: `Para cualquier consulta relacionada con cancelaciones, modificaciones o devoluciones, puede contactarnos:

**Teléfono:** ${COMPANY_DATA.contact.phone}
**Email:** ${COMPANY_DATA.contact.email}
**WhatsApp:** +${COMPANY_DATA.contact.whatsapp}
**Horario de atención:** ${COMPANY_DATA.businessHours.weekdays}`,
      },
    ],
  },
};
