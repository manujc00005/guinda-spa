import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting seed...')

  // ============================================================================
  // 1. CATEGORÍAS
  // ============================================================================

  const categorySpa = await prisma.category.upsert({
    where: { slug: 'circuito-spa' },
    update: {},
    create: {
      slug: 'circuito-spa',
      name: 'Circuito SPA',
      description: 'Circuito spa privado con piscina climatizada, jacuzzi, sauna y ducha sensaciones',
      displayOrder: 1,
      isActive: true,
    },
  })

  const categoryMasajes = await prisma.category.upsert({
    where: { slug: 'masajes' },
    update: {},
    create: {
      slug: 'masajes',
      name: 'Masajes Terapéuticos',
      description: 'Masajes relajantes, descontracturantes y deportivos',
      displayOrder: 2,
      isActive: true,
    },
  })

  const categoryMasajesDelMundo = await prisma.category.upsert({
    where: { slug: 'masajes-del-mundo' },
    update: {},
    create: {
      slug: 'masajes-del-mundo',
      name: 'Masajes del Mundo',
      description: 'Técnicas ancestrales de masaje de diferentes culturas',
      displayOrder: 3,
      isActive: true,
    },
  })

  const categoryRituales = await prisma.category.upsert({
    where: { slug: 'rituales' },
    update: {},
    create: {
      slug: 'rituales',
      name: 'Rituales del Mundo',
      description: 'Experiencias completas que combinan exfoliación, masaje y envoltura',
      displayOrder: 4,
      isActive: true,
    },
  })

  const categoryExfoliaciones = await prisma.category.upsert({
    where: { slug: 'exfoliaciones-envolturas' },
    update: {},
    create: {
      slug: 'exfoliaciones-envolturas',
      name: 'Exfoliaciones y Envolturas',
      description: 'Tratamientos corporales para renovar y nutrir la piel',
      displayOrder: 5,
      isActive: true,
    },
  })

  const categoryFaciales = await prisma.category.upsert({
    where: { slug: 'tratamientos-faciales' },
    update: {},
    create: {
      slug: 'tratamientos-faciales',
      name: 'Tratamientos Faciales',
      description: 'Faciales personalizados con tecnología avanzada',
      displayOrder: 6,
      isActive: true,
    },
  })

  const categoryCorporales = await prisma.category.upsert({
    where: { slug: 'tratamientos-corporales' },
    update: {},
    create: {
      slug: 'tratamientos-corporales',
      name: 'Tratamientos Corporales',
      description: 'Estética corporal avanzada',
      displayOrder: 7,
      isActive: true,
    },
  })

  const categoryManicura = await prisma.category.upsert({
    where: { slug: 'manicura' },
    update: {},
    create: {
      slug: 'manicura',
      name: 'Manicura',
      description: 'Cuidado profesional de manos y uñas',
      displayOrder: 8,
      isActive: true,
    },
  })

  const categoryPedicura = await prisma.category.upsert({
    where: { slug: 'pedicura' },
    update: {},
    create: {
      slug: 'pedicura',
      name: 'Pedicura',
      description: 'Cuidado profesional de pies y uñas',
      displayOrder: 9,
      isActive: true,
    },
  })

  const categoryPeluqueria = await prisma.category.upsert({
    where: { slug: 'peluqueria' },
    update: {},
    create: {
      slug: 'peluqueria',
      name: 'Peluquería',
      description: 'Servicios de corte, color y peinado',
      displayOrder: 10,
      isActive: true,
    },
  })

  const categoryPareja = await prisma.category.upsert({
    where: { slug: 'experiencias-pareja' },
    update: {},
    create: {
      slug: 'experiencias-pareja',
      name: 'Wellness en Pareja',
      description: 'Experiencias románticas para dos',
      displayOrder: 11,
      isActive: true,
    },
  })

  console.log('✅ Categories created')

  // ============================================================================
  // 2. ADDONS (EXTRAS)
  // ============================================================================

  const addonToalla = await prisma.addon.upsert({
    where: { slug: 'toalla-chanclas' },
    update: {},
    create: {
      slug: 'toalla-chanclas',
      name: 'Toalla y chanclas',
      description: 'Set de toalla y chanclas para el circuito',
      price: 5.00,
      applicationType: 'PER_PERSON',
      isActive: true,
    },
  })

  const addonInfusion = await prisma.addon.upsert({
    where: { slug: 'infusion' },
    update: {},
    create: {
      slug: 'infusion',
      name: 'Infusión relajante',
      description: 'Infusión de hierbas después del tratamiento',
      price: 3.00,
      applicationType: 'PER_PERSON',
      isActive: true,
    },
  })

  const addonDeportivo = await prisma.addon.upsert({
    where: { slug: 'masaje-deportivo-extra' },
    update: {},
    create: {
      slug: 'masaje-deportivo-extra',
      name: 'Masaje deportivo intenso',
      description: 'Incremento por técnica deportiva intensiva',
      price: 10.00,
      applicationType: 'PER_PERSON',
      isActive: true,
    },
  })

  const addonIBX = await prisma.addon.upsert({
    where: { slug: 'tratamiento-ibx' },
    update: {},
    create: {
      slug: 'tratamiento-ibx',
      name: 'Tratamiento IBX',
      description: 'Tratamiento fortalecedor de uñas IBX',
      price: 15.00,
      applicationType: 'PER_PERSON',
      isActive: true,
    },
  })

  const addonKerastase = await prisma.addon.upsert({
    where: { slug: 'tratamiento-kerastase' },
    update: {},
    create: {
      slug: 'tratamiento-kerastase',
      name: 'Tratamiento Kérastase',
      description: 'Tratamiento capilar premium Kérastase',
      price: 20.00,
      applicationType: 'PER_PERSON',
      isActive: true,
    },
  })

  console.log('✅ Addons created')

  // ============================================================================
  // 3. SERVICIOS - CIRCUITO SPA
  // ============================================================================

  const circuitoSpa = await prisma.service.upsert({
    where: { slug: 'circuito-spa-privado' },
    update: {},
    create: {
      slug: 'circuito-spa-privado',
      name: 'Circuito SPA Privado',
      description: 'Disfruta de nuestro circuito spa privado con piscina climatizada, jacuzzi, sauna finlandesa, baño turco y ducha de sensaciones. Experiencia relajante completa.',
      shortDescription: 'Circuito completo en instalaciones privadas',
      type: 'SPA_CIRCUIT',
      categoryId: categorySpa.id,
      baseDuration: 60,
      basePrice: 25.00,
      isPriceFrom: false,
      maxCapacity: 2,
      isActive: true,
      isFeatured: true,
      requiresBooking: true,
      displayOrder: 1,
    },
  })

  await prisma.serviceAddon.upsert({
    where: {
      serviceId_addonId: {
        serviceId: circuitoSpa.id,
        addonId: addonToalla.id,
      },
    },
    update: {},
    create: {
      serviceId: circuitoSpa.id,
      addonId: addonToalla.id,
      isRecommended: true,
      displayOrder: 1,
    },
  })

  // ============================================================================
  // 4. SERVICIOS - MASAJES TERAPÉUTICOS
  // ============================================================================

  const masajeRelajante = await prisma.service.upsert({
    where: { slug: 'masaje-relajante' },
    update: {},
    create: {
      slug: 'masaje-relajante',
      name: 'Masaje Relajante',
      description: 'Masaje suave y envolvente diseñado para aliviar el estrés y la tensión acumulada. Ideal para desconectar y relajar cuerpo y mente.',
      shortDescription: 'Relájate con nuestro masaje más solicitado',
      type: 'MASSAGE',
      categoryId: categoryMasajes.id,
      basePrice: 40.00,
      isPriceFrom: true, // "Desde 40€" porque hay varias duraciones
      maxCapacity: 1,
      isActive: true,
      isFeatured: true,
      requiresBooking: true,
      displayOrder: 1,
    },
  })

  // Variantes de duración para Masaje Relajante
  await prisma.serviceVariant.create({
    data: {
      serviceId: masajeRelajante.id,
      slug: '30-minutos',
      name: '30 minutos',
      description: 'Masaje express',
      duration: 30,
      durationUnit: 'MINUTES',
      price: 40.00,
      isActive: true,
      displayOrder: 1,
    },
  })

  await prisma.serviceVariant.create({
    data: {
      serviceId: masajeRelajante.id,
      slug: '60-minutos',
      name: '60 minutos',
      description: 'Masaje completo',
      duration: 60,
      durationUnit: 'MINUTES',
      price: 55.00,
      isActive: true,
      displayOrder: 2,
    },
  })

  await prisma.serviceVariant.create({
    data: {
      serviceId: masajeRelajante.id,
      slug: '90-minutos',
      name: '90 minutos',
      description: 'Masaje premium extendido',
      duration: 90,
      durationUnit: 'MINUTES',
      price: 75.00,
      isActive: true,
      displayOrder: 3,
    },
  })

  const masajeDescontracturante = await prisma.service.upsert({
    where: { slug: 'masaje-descontracturante' },
    update: {},
    create: {
      slug: 'masaje-descontracturante',
      name: 'Masaje Descontracturante',
      description: 'Masaje profundo focalizado en zonas de tensión muscular. Técnicas específicas para liberar contracturas y nudos musculares.',
      shortDescription: 'Libera tensiones y contracturas',
      type: 'MASSAGE',
      categoryId: categoryMasajes.id,
      basePrice: 45.00,
      isPriceFrom: true,
      maxCapacity: 1,
      isActive: true,
      requiresBooking: true,
      displayOrder: 2,
    },
  })

  await prisma.serviceVariant.create({
    data: {
      serviceId: masajeDescontracturante.id,
      slug: '30-minutos',
      name: '30 minutos',
      description: 'Zona localizada',
      duration: 30,
      price: 45.00,
      area: 'cuello_espalda',
      isActive: true,
      displayOrder: 1,
    },
  })

  await prisma.serviceVariant.create({
    data: {
      serviceId: masajeDescontracturante.id,
      slug: '60-minutos',
      name: '60 minutos',
      description: 'Cuerpo completo',
      duration: 60,
      price: 60.00,
      area: 'cuerpo_completo',
      isActive: true,
      displayOrder: 2,
    },
  })

  // Variante deportiva (con cargo extra)
  await prisma.serviceVariant.create({
    data: {
      serviceId: masajeDescontracturante.id,
      slug: '60-minutos-deportivo',
      name: '60 minutos - Deportivo',
      description: 'Técnica intensiva para deportistas',
      duration: 60,
      price: 70.00,
      area: 'cuerpo_completo',
      variantType: 'deportivo',
      extraCharge: 10.00,
      isActive: true,
      displayOrder: 3,
    },
  })

  console.log('✅ Therapeutic massages created')

  // ============================================================================
  // 5. SERVICIOS - MASAJES DEL MUNDO
  // ============================================================================

  const masajeLavaShell = await prisma.service.upsert({
    where: { slug: 'masaje-lava-shell' },
    update: {},
    create: {
      slug: 'masaje-lava-shell',
      name: 'Masaje Lava Shell',
      description: 'Masaje con conchas marinas calientes que liberan calor de forma natural. Profunda relajación y alivio muscular.',
      shortDescription: 'Masaje con conchas marinas calientes',
      type: 'MASSAGE',
      categoryId: categoryMasajesDelMundo.id,
      baseDuration: 60,
      basePrice: 65.00,
      maxCapacity: 1,
      isActive: true,
      requiresBooking: true,
      displayOrder: 1,
    },
  })

  const masajeAyurvedico = await prisma.service.upsert({
    where: { slug: 'masaje-ayurvedico' },
    update: {},
    create: {
      slug: 'masaje-ayurvedico',
      name: 'Masaje Ayurvédico',
      description: 'Técnica milenaria india que equilibra los doshas con aceites aromáticos y movimientos fluidos.',
      shortDescription: 'Equilibrio ayurvédico con aceites',
      type: 'MASSAGE',
      categoryId: categoryMasajesDelMundo.id,
      baseDuration: 75,
      basePrice: 70.00,
      maxCapacity: 1,
      isActive: true,
      isFeatured: true,
      requiresBooking: true,
      displayOrder: 2,
    },
  })

  const masajeHindu = await prisma.service.upsert({
    where: { slug: 'masaje-hindu-craneal' },
    update: {},
    create: {
      slug: 'masaje-hindu-craneal',
      name: 'Masaje Hindú Craneal',
      description: 'Masaje de cabeza, cuello y hombros que alivia tensión y favorece la claridad mental.',
      shortDescription: 'Masaje de cabeza y cuello',
      type: 'MASSAGE',
      categoryId: categoryMasajesDelMundo.id,
      baseDuration: 30,
      basePrice: 40.00,
      maxCapacity: 1,
      isActive: true,
      requiresBooking: true,
      displayOrder: 3,
    },
  })

  const kobidoFacial = await prisma.service.upsert({
    where: { slug: 'kobido-facial' },
    update: {},
    create: {
      slug: 'kobido-facial',
      name: 'Kobido Facial',
      description: 'Lifting facial japonés ancestral. Técnica que rejuvenece y tonifica los músculos faciales de forma natural.',
      shortDescription: 'Lifting facial japonés',
      type: 'MASSAGE',
      categoryId: categoryMasajesDelMundo.id,
      baseDuration: 30,
      basePrice: 45.00,
      maxCapacity: 1,
      isActive: true,
      isFeatured: true,
      requiresBooking: true,
      displayOrder: 4,
    },
  })

  console.log('✅ World massages created')

  // ============================================================================
  // 6. SERVICIOS - RITUALES DEL MUNDO
  // ============================================================================

  const ritualPacificSpirit = await prisma.service.upsert({
    where: { slug: 'ritual-pacific-spirit' },
    update: {},
    create: {
      slug: 'ritual-pacific-spirit',
      name: 'Ritual Pacific Spirit',
      description: 'Viaje sensorial al Pacífico. Exfoliación con arenas volcánicas, masaje relajante con aceites de monoi y envoltura nutritiva. Experiencia completa de 2 horas.',
      shortDescription: 'Viaje sensorial al Pacífico (2h)',
      type: 'RITUAL',
      categoryId: categoryRituales.id,
      baseDuration: 120,
      basePrice: 95.00,
      maxCapacity: 1,
      isActive: true,
      isFeatured: true,
      requiresBooking: true,
      displayOrder: 1,
    },
  })

  const ritualIndiaAncestral = await prisma.service.upsert({
    where: { slug: 'ritual-india-ancestral' },
    update: {},
    create: {
      slug: 'ritual-india-ancestral',
      name: 'Ritual India Ancestral',
      description: 'Ritual ayurvédico completo. Exfoliación con especias, masaje abhyanga con aceites dosha y envoltura de hierbas medicinales.',
      shortDescription: 'Ritual ayurvédico completo (2h)',
      type: 'RITUAL',
      categoryId: categoryRituales.id,
      baseDuration: 120,
      basePrice: 98.00,
      maxCapacity: 1,
      isActive: true,
      isFeatured: true,
      requiresBooking: true,
      displayOrder: 2,
    },
  })

  console.log('✅ World rituals created')

  // ============================================================================
  // 7. SERVICIOS - EXFOLIACIONES Y ENVOLTURAS
  // ============================================================================

  const exfoliacionAlgoterapia = await prisma.service.upsert({
    where: { slug: 'exfoliacion-algoterapia' },
    update: {},
    create: {
      slug: 'exfoliacion-algoterapia',
      name: 'Exfoliación y Envoltura de Algoterapia',
      description: 'Tratamiento con algas marinas que remineralizan, drenan y reafirman la piel.',
      shortDescription: 'Algas marinas remineralizantes',
      type: 'EXFOLIATION',
      categoryId: categoryExfoliaciones.id,
      baseDuration: 45,
      basePrice: 55.00,
      maxCapacity: 1,
      isActive: true,
      requiresBooking: true,
      displayOrder: 1,
    },
  })

  const exfoliacionSalesAroma = await prisma.service.upsert({
    where: { slug: 'exfoliacion-sales-aroma' },
    update: {},
    create: {
      slug: 'exfoliacion-sales-aroma',
      name: 'Exfoliación Sales & Aroma',
      description: 'Exfoliación corporal con sales marinas y aceites esenciales que renueva la piel y estimula la circulación.',
      shortDescription: 'Sales marinas y aceites esenciales',
      type: 'EXFOLIATION',
      categoryId: categoryExfoliaciones.id,
      baseDuration: 30,
      basePrice: 40.00,
      maxCapacity: 1,
      isActive: true,
      requiresBooking: true,
      displayOrder: 2,
    },
  })

  const envolturaAloeVera = await prisma.service.upsert({
    where: { slug: 'envoltura-aloe-vera' },
    update: {},
    create: {
      slug: 'envoltura-aloe-vera',
      name: 'Envoltura de Aloe Vera',
      description: 'Envoltura hidratante y calmante perfecta después del sol o para pieles sensibles.',
      shortDescription: 'Hidratación y calma intensa',
      type: 'EXFOLIATION',
      categoryId: categoryExfoliaciones.id,
      baseDuration: 30,
      basePrice: 45.00,
      maxCapacity: 1,
      isActive: true,
      requiresBooking: true,
      displayOrder: 3,
    },
  })

  console.log('✅ Exfoliations created')

  // ============================================================================
  // 8. SERVICIOS - TRATAMIENTOS FACIALES
  // ============================================================================

  const facialCoctelVitaminas = await prisma.service.upsert({
    where: { slug: 'facial-coctel-vitaminas' },
    update: {},
    create: {
      slug: 'facial-coctel-vitaminas',
      name: 'Facial Cóctel de Vitaminas',
      description: 'Tratamiento revitalizante con vitaminas C, E y ácido hialurónico. Luminosidad instantánea.',
      shortDescription: 'Vitaminas y luminosidad',
      type: 'FACIAL',
      categoryId: categoryFaciales.id,
      baseDuration: 50,
      basePrice: 65.00,
      maxCapacity: 1,
      isActive: true,
      isFeatured: true,
      requiresBooking: true,
      displayOrder: 1,
    },
  })

  const facialFlashGlow = await prisma.service.upsert({
    where: { slug: 'facial-flash-glow' },
    update: {},
    create: {
      slug: 'facial-flash-glow',
      name: 'Facial Flash Glow',
      description: 'Tratamiento express para eventos especiales. Piel radiante en 30 minutos.',
      shortDescription: 'Radiancia instantánea (30min)',
      type: 'FACIAL',
      categoryId: categoryFaciales.id,
      baseDuration: 30,
      basePrice: 50.00,
      maxCapacity: 1,
      isActive: true,
      requiresBooking: true,
      displayOrder: 2,
    },
  })

  const facialRadiofrecuencia = await prisma.service.upsert({
    where: { slug: 'facial-radiofrecuencia-rejuvenecimiento' },
    update: {},
    create: {
      slug: 'facial-radiofrecuencia-rejuvenecimiento',
      name: 'Facial Rejuvenecimiento con Radiofrecuencia',
      description: 'Tecnología avanzada que estimula colágeno y elastina. Efecto tensor y reafirmante.',
      shortDescription: 'Tecnología antiedad avanzada',
      type: 'FACIAL',
      categoryId: categoryFaciales.id,
      baseDuration: 60,
      basePrice: 80.00,
      maxCapacity: 1,
      isActive: true,
      isFeatured: true,
      requiresBooking: true,
      displayOrder: 3,
    },
  })

  console.log('✅ Facial treatments created')

  // ============================================================================
  // 9. SERVICIOS - TRATAMIENTOS CORPORALES
  // ============================================================================

  const corporalMasajeEstetico = await prisma.service.upsert({
    where: { slug: 'masaje-estetico-reductivo' },
    update: {},
    create: {
      slug: 'masaje-estetico-reductivo',
      name: 'Masaje Estético Reductivo',
      description: 'Masaje especializado para reducir medidas y mejorar la textura de la piel.',
      shortDescription: 'Reduce medidas y reafirma',
      type: 'BODY_TREATMENT',
      categoryId: categoryCorporales.id,
      baseDuration: 45,
      basePrice: 55.00,
      maxCapacity: 1,
      isActive: true,
      requiresBooking: true,
      displayOrder: 1,
    },
  })

  const corporalRadiofrecuencia = await prisma.service.upsert({
    where: { slug: 'radiofrecuencia-corporal' },
    update: {},
    create: {
      slug: 'radiofrecuencia-corporal',
      name: 'Radiofrecuencia Corporal',
      description: 'Tratamiento con radiofrecuencia para reafirmar y mejorar la elasticidad de la piel.',
      shortDescription: 'Reafirmante corporal avanzado',
      type: 'BODY_TREATMENT',
      categoryId: categoryCorporales.id,
      baseDuration: 60,
      basePrice: 70.00,
      maxCapacity: 1,
      isActive: true,
      requiresBooking: true,
      displayOrder: 2,
    },
  })

  const presoterapia = await prisma.service.upsert({
    where: { slug: 'presoterapia' },
    update: {},
    create: {
      slug: 'presoterapia',
      name: 'Presoterapia',
      description: 'Drenaje linfático mecánico que reduce retención de líquidos y mejora la circulación.',
      shortDescription: 'Drenaje linfático mecánico',
      type: 'BODY_TREATMENT',
      categoryId: categoryCorporales.id,
      baseDuration: 30,
      basePrice: 35.00,
      maxCapacity: 1,
      isActive: true,
      requiresBooking: true,
      displayOrder: 3,
    },
  })

  console.log('✅ Body treatments created')

  // ============================================================================
  // 10. SERVICIOS - MANICURA Y PEDICURA
  // ============================================================================

  const manicuraSpa = await prisma.service.upsert({
    where: { slug: 'manicura-spa' },
    update: {},
    create: {
      slug: 'manicura-spa',
      name: 'Manicura SPA',
      description: 'Manicura completa con exfoliación, masaje de manos y esmaltado.',
      shortDescription: 'Cuidado completo de manos',
      type: 'MANICURE',
      categoryId: categoryManicura.id,
      basePrice: 25.00,
      isPriceFrom: true,
      baseDuration: 45,
      maxCapacity: 1,
      isActive: true,
      requiresBooking: true,
      displayOrder: 1,
    },
  })

  await prisma.serviceVariant.create({
    data: {
      serviceId: manicuraSpa.id,
      slug: 'tradicional',
      name: 'Manicura Tradicional',
      description: 'Esmaltado tradicional',
      duration: 45,
      price: 25.00,
      variantType: 'tradicional',
      isActive: true,
      displayOrder: 1,
    },
  })

  await prisma.serviceVariant.create({
    data: {
      serviceId: manicuraSpa.id,
      slug: 'semipermanente',
      name: 'Manicura Semipermanente',
      description: 'Duración 2-3 semanas',
      duration: 60,
      price: 35.00,
      variantType: 'semipermanente',
      isActive: true,
      displayOrder: 2,
    },
  })

  await prisma.serviceVariant.create({
    data: {
      serviceId: manicuraSpa.id,
      slug: 'gel',
      name: 'Manicura Gel',
      description: 'Uñas de gel con construcción',
      duration: 90,
      price: 45.00,
      variantType: 'gel',
      isActive: true,
      displayOrder: 3,
    },
  })

  // Asociar addon IBX a manicura
  await prisma.serviceAddon.upsert({
    where: {
      serviceId_addonId: {
        serviceId: manicuraSpa.id,
        addonId: addonIBX.id,
      },
    },
    update: {},
    create: {
      serviceId: manicuraSpa.id,
      addonId: addonIBX.id,
      isRecommended: true,
      displayOrder: 1,
    },
  })

  const pedicuraSpa = await prisma.service.upsert({
    where: { slug: 'pedicura-spa' },
    update: {},
    create: {
      slug: 'pedicura-spa',
      name: 'Pedicura SPA',
      description: 'Pedicura completa con exfoliación, masaje de piernas y esmaltado.',
      shortDescription: 'Cuidado completo de pies',
      type: 'PEDICURE',
      categoryId: categoryPedicura.id,
      basePrice: 30.00,
      isPriceFrom: true,
      baseDuration: 60,
      maxCapacity: 1,
      isActive: true,
      requiresBooking: true,
      displayOrder: 1,
    },
  })

  await prisma.serviceVariant.create({
    data: {
      serviceId: pedicuraSpa.id,
      slug: 'tradicional',
      name: 'Pedicura Tradicional',
      duration: 60,
      price: 30.00,
      variantType: 'tradicional',
      isActive: true,
      displayOrder: 1,
    },
  })

  await prisma.serviceVariant.create({
    data: {
      serviceId: pedicuraSpa.id,
      slug: 'semipermanente',
      name: 'Pedicura Semipermanente',
      duration: 75,
      price: 40.00,
      variantType: 'semipermanente',
      isActive: true,
      displayOrder: 2,
    },
  })

  const duoManicuraPedicura = await prisma.service.upsert({
    where: { slug: 'duo-manicura-pedicura' },
    update: {},
    create: {
      slug: 'duo-manicura-pedicura',
      name: 'DUO Manicura + Pedicura',
      description: 'Pack combinado con descuento. Manicura y pedicura spa completas.',
      shortDescription: 'Pack con descuento',
      type: 'MANICURE', // O crear nuevo tipo "COMBO"
      categoryId: categoryManicura.id,
      basePrice: 50.00,
      baseDuration: 120,
      maxCapacity: 1,
      isActive: true,
      requiresBooking: true,
      displayOrder: 3,
    },
  })

  console.log('✅ Manicure & pedicure created')

  // ============================================================================
  // 11. SERVICIOS - PELUQUERÍA
  // ============================================================================

  const peluqueriaLavado = await prisma.service.upsert({
    where: { slug: 'lavado-peinado' },
    update: {},
    create: {
      slug: 'lavado-peinado',
      name: 'Lavado y Peinado',
      description: 'Lavado profesional y peinado según preferencias.',
      shortDescription: 'Lavado y acabado profesional',
      type: 'HAIRDRESSING',
      categoryId: categoryPeluqueria.id,
      basePrice: 20.00,
      isPriceFrom: true,
      baseDuration: 30,
      maxCapacity: 1,
      isActive: true,
      requiresBooking: true,
      displayOrder: 1,
    },
  })

  await prisma.serviceVariant.create({
    data: {
      serviceId: peluqueriaLavado.id,
      slug: 'pelo-corto',
      name: 'Pelo corto',
      duration: 30,
      price: 20.00,
      area: 'corto',
      isActive: true,
      displayOrder: 1,
    },
  })

  await prisma.serviceVariant.create({
    data: {
      serviceId: peluqueriaLavado.id,
      slug: 'pelo-largo',
      name: 'Pelo largo',
      duration: 45,
      price: 28.00,
      area: 'largo',
      isActive: true,
      displayOrder: 2,
    },
  })

  const corteSeñora = await prisma.service.upsert({
    where: { slug: 'corte-señora' },
    update: {},
    create: {
      slug: 'corte-señora',
      name: 'Corte Señora',
      description: 'Corte personalizado con lavado y acabado.',
      shortDescription: 'Corte y acabado profesional',
      type: 'HAIRDRESSING',
      categoryId: categoryPeluqueria.id,
      baseDuration: 45,
      basePrice: 35.00,
      maxCapacity: 1,
      isActive: true,
      requiresBooking: true,
      displayOrder: 2,
    },
  })

  const corteCaballero = await prisma.service.upsert({
    where: { slug: 'corte-caballero' },
    update: {},
    create: {
      slug: 'corte-caballero',
      name: 'Corte Caballero',
      description: 'Corte masculino con lavado y acabado.',
      shortDescription: 'Corte masculino profesional',
      type: 'HAIRDRESSING',
      categoryId: categoryPeluqueria.id,
      baseDuration: 30,
      basePrice: 25.00,
      maxCapacity: 1,
      isActive: true,
      requiresBooking: true,
      displayOrder: 3,
    },
  })

  const recogidos = await prisma.service.upsert({
    where: { slug: 'recogidos' },
    update: {},
    create: {
      slug: 'recogidos',
      name: 'Recogidos',
      description: 'Recogido personalizado para eventos especiales.',
      shortDescription: 'Peinado para eventos',
      type: 'HAIRDRESSING',
      categoryId: categoryPeluqueria.id,
      baseDuration: 60,
      basePrice: 45.00,
      maxCapacity: 1,
      isActive: true,
      requiresBooking: true,
      displayOrder: 4,
    },
  })

  const coloracion = await prisma.service.upsert({
    where: { slug: 'coloracion' },
    update: {},
    create: {
      slug: 'coloracion',
      name: 'Coloración',
      description: 'Servicio de color personalizado (tinte, mechas, balayage).',
      shortDescription: 'Color personalizado',
      type: 'HAIRDRESSING',
      categoryId: categoryPeluqueria.id,
      baseDuration: 120,
      basePrice: 60.00,
      isPriceFrom: true,
      maxCapacity: 1,
      isActive: true,
      requiresBooking: true,
      displayOrder: 5,
    },
  })

  await prisma.serviceAddon.upsert({
    where: {
      serviceId_addonId: {
        serviceId: coloracion.id,
        addonId: addonKerastase.id,
      },
    },
    update: {},
    create: {
      serviceId: coloracion.id,
      addonId: addonKerastase.id,
      isRecommended: true,
      displayOrder: 1,
    },
  })

  console.log('✅ Hairdressing services created')

  // ============================================================================
  // 12. PAQUETES - EXPERIENCIAS EN PAREJA
  // ============================================================================

  const packageCircuitoPareja = await prisma.package.upsert({
    where: { slug: 'circuito-spa-pareja' },
    update: {},
    create: {
      slug: 'circuito-spa-pareja',
      name: 'Circuito SPA en Pareja',
      description: 'Disfruta del circuito spa privado con tu pareja. 60 minutos de relax compartido.',
      shortDescription: 'Circuito privado para dos',
      price: 45.00,
      originalPrice: 50.00,
      totalDuration: 60,
      capacity: 2,
      isActive: true,
      isFeatured: true,
      displayOrder: 1,
    },
  })

  await prisma.packageItem.create({
    data: {
      packageId: packageCircuitoPareja.id,
      serviceId: circuitoSpa.id,
      quantity: 1,
      description: 'Circuito spa 60 minutos para 2 personas',
      displayOrder: 1,
    },
  })

  const packageSpaMasajePareja60 = await prisma.package.upsert({
    where: { slug: 'experiencia-spa-masaje-pareja-60' },
    update: {},
    create: {
      slug: 'experiencia-spa-masaje-pareja-60',
      name: 'Experiencia SPA + Masaje Pareja (60min)',
      description: 'Circuito spa privado + masaje relajante de 60 minutos para dos personas.',
      shortDescription: 'Spa + masaje 60min para dos',
      price: 150.00,
      originalPrice: 165.00,
      totalDuration: 180,
      capacity: 2,
      isActive: true,
      isFeatured: true,
      displayOrder: 2,
    },
  })

  await prisma.packageItem.create({
    data: {
      packageId: packageSpaMasajePareja60.id,
      serviceId: circuitoSpa.id,
      quantity: 1,
      description: 'Circuito spa 60min',
      displayOrder: 1,
    },
  })

  await prisma.packageItem.create({
    data: {
      packageId: packageSpaMasajePareja60.id,
      serviceId: masajeRelajante.id,
      quantity: 2,
      description: 'Masaje relajante 60min x 2 personas',
      displayOrder: 2,
    },
  })

  const packageSpaMasajePareja90 = await prisma.package.upsert({
    where: { slug: 'experiencia-spa-masaje-pareja-90' },
    update: {},
    create: {
      slug: 'experiencia-spa-masaje-pareja-90',
      name: 'Experiencia SPA + Masaje Pareja (90min)',
      description: 'Circuito spa privado + masaje relajante de 90 minutos para dos personas. Máximo relax.',
      shortDescription: 'Spa + masaje 90min para dos',
      price: 195.00,
      originalPrice: 215.00,
      totalDuration: 210,
      capacity: 2,
      isActive: true,
      isFeatured: true,
      displayOrder: 3,
    },
  })

  await prisma.packageItem.create({
    data: {
      packageId: packageSpaMasajePareja90.id,
      serviceId: circuitoSpa.id,
      quantity: 1,
      description: 'Circuito spa 60min',
      displayOrder: 1,
    },
  })

  await prisma.packageItem.create({
    data: {
      packageId: packageSpaMasajePareja90.id,
      serviceId: masajeRelajante.id,
      quantity: 2,
      description: 'Masaje relajante 90min x 2 personas',
      displayOrder: 2,
    },
  })

  const packageCabinaPrivada = await prisma.package.upsert({
    where: { slug: 'experiencia-cabina-privada-pareja' },
    update: {},
    create: {
      slug: 'experiencia-cabina-privada-pareja',
      name: 'Experiencia Cabina Privada Pareja',
      description: 'Circuito spa + masajes simultáneos en cabina privada con música ambiente y velas aromáticas.',
      shortDescription: 'Cabina privada romántica',
      price: 180.00,
      totalDuration: 180,
      capacity: 2,
      isActive: true,
      isFeatured: true,
      displayOrder: 4,
    },
  })

  await prisma.packageItem.create({
    data: {
      packageId: packageCabinaPrivada.id,
      serviceId: circuitoSpa.id,
      quantity: 1,
      displayOrder: 1,
    },
  })

  await prisma.packageItem.create({
    data: {
      packageId: packageCabinaPrivada.id,
      serviceId: masajeRelajante.id,
      quantity: 2,
      description: 'Masaje 60min simultáneo en cabina privada',
      displayOrder: 2,
    },
  })

  console.log('✅ Couple packages created')

  // ============================================================================
  // 13. VOUCHER TEMPLATES (BONOS)
  // ============================================================================

  const voucherTemplate3Plus1 = await prisma.voucherTemplate.upsert({
    where: { slug: 'bono-3-plus-1' },
    update: {},
    create: {
      slug: 'bono-3-plus-1',
      name: 'Bono 3+1 Gratis',
      description: 'Compra 3 sesiones y llévate 1 gratis. Válido para cualquier servicio de masajes. A disfrutar en 1 mes.',
      sessionsIncluded: 4,
      sessionsBonus: 1,
      price: 150.00,
      validityDays: 30, // 1 mes
      restrictionType: 'CATEGORY',
      restrictedToCategoryId: categoryMasajes.id, // Solo masajes
      sessionValue: 50.00, // Valor aprox por sesión
      isActive: true,
      isGiftable: true,
    },
  })

  const voucherTemplate5Plus1 = await prisma.voucherTemplate.upsert({
    where: { slug: 'bono-5-plus-1' },
    update: {},
    create: {
      slug: 'bono-5-plus-1',
      name: 'Bono 5+1 Gratis',
      description: 'Compra 5 sesiones y llévate 1 gratis. Válido para cualquier servicio. A disfrutar en 3 meses.',
      sessionsIncluded: 6,
      sessionsBonus: 1,
      price: 280.00,
      validityDays: 90, // 3 meses
      restrictionType: 'ANY_SERVICE',
      sessionValue: 50.00,
      isActive: true,
      isGiftable: true,
    },
  })

  const voucherTemplateCircuitoSpa = await prisma.voucherTemplate.upsert({
    where: { slug: 'bono-circuito-spa' },
    update: {},
    create: {
      slug: 'bono-circuito-spa',
      name: 'Bono Circuito SPA',
      description: 'Bono regalo para 1 circuito spa privado. Válido 6 meses.',
      sessionsIncluded: 1,
      sessionsBonus: 0,
      price: 25.00,
      validityDays: 180, // 6 meses
      restrictionType: 'SERVICE',
      restrictedToServiceId: circuitoSpa.id,
      sessionValue: 25.00,
      isActive: true,
      isGiftable: true,
    },
  })

  const voucherTemplatePareja = await prisma.voucherTemplate.upsert({
    where: { slug: 'bono-experiencia-pareja' },
    update: {},
    create: {
      slug: 'bono-experiencia-pareja',
      name: 'Bono Experiencia Pareja',
      description: 'Vale regalo para experiencia spa + masaje en pareja. Elige tu pack al reservar.',
      sessionsIncluded: 1,
      sessionsBonus: 0,
      price: 150.00,
      validityDays: 180,
      restrictionType: 'CATEGORY',
      restrictedToCategoryId: categoryPareja.id,
      sessionValue: 150.00,
      isActive: true,
      isGiftable: true,
    },
  })

  console.log('✅ Voucher templates created')

  // ============================================================================
  // 14. CLIENTE DE EJEMPLO
  // ============================================================================

  const customerExample = await prisma.customer.upsert({
    where: { email: 'cliente@example.com' },
    update: {},
    create: {
      email: 'cliente@example.com',
      firstName: 'María',
      lastName: 'García',
      phone: '+34 600 123 456',
      marketingConsent: true,
      language: 'es',
    },
  })

  console.log('✅ Example customer created')

  // ============================================================================
  // 15. ORDEN DE EJEMPLO CON VOUCHER
  // ============================================================================

  const exampleOrder = await prisma.order.create({
    data: {
      orderNumber: 'GND-2024-0001',
      customerId: customerExample.id,
      isVoucherPurchase: true,
      subtotal: 150.00,
      taxAmount: 31.50, // IVA 21%
      total: 181.50,
      status: 'PAYMENT_CONFIRMED',
      items: {
        create: {
          itemType: 'voucher',
          voucherTemplateId: voucherTemplate3Plus1.id,
          name: 'Bono 3+1 Gratis',
          description: '4 sesiones de masaje',
          quantity: 1,
          unitPrice: 150.00,
          totalPrice: 150.00,
        },
      },
    },
  })

  // Crear voucher asociado
  const expiresAt = new Date()
  expiresAt.setDate(expiresAt.getDate() + 30)

  const exampleVoucher = await prisma.voucher.create({
    data: {
      code: 'GUINDA-DEMO-1234',
      templateId: voucherTemplate3Plus1.id,
      purchasedById: customerExample.id,
      recipientId: customerExample.id,
      orderId: exampleOrder.id,
      status: 'ACTIVE',
      sessionsRemaining: 4,
      expiresAt,
    },
  })

  console.log('✅ Example order and voucher created')

  // ============================================================================
  // 16. BOOKING DE EJEMPLO
  // ============================================================================

  const masajeRelajante60Variant = await prisma.serviceVariant.findFirst({
    where: {
      serviceId: masajeRelajante.id,
      slug: '60-minutos',
    },
  })

  const exampleBooking = await prisma.booking.create({
    data: {
      bookingNumber: 'BKG-2024-0001',
      customerId: customerExample.id,
      serviceId: masajeRelajante.id,
      variantId: masajeRelajante60Variant?.id,
      serviceName: 'Masaje Relajante 60 minutos',
      duration: 60,
      bookingDate: new Date('2024-06-15T10:00:00Z'),
      startTime: '10:00',
      endTime: '11:00',
      numberOfPeople: 1,
      status: 'CONFIRMED',
      confirmedAt: new Date(),
    },
  })

  console.log('✅ Example booking created')

  console.log('🎉 Seed completed successfully!')
  console.log('\nCreated:')
  console.log('- 11 categories')
  console.log('- 5 addons')
  console.log('- 30+ services with variants')
  console.log('- 4 couple packages')
  console.log('- 4 voucher templates')
  console.log('- 1 example customer')
  console.log('- 1 example order with voucher')
  console.log('- 1 example booking')
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
