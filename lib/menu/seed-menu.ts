import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import { serializeDraft } from './serialize'

// Re-create prisma for serialization (seed runs standalone)
const serializePrisma = new PrismaClient()

export async function seedMenuData(prisma: PrismaClient) {
  console.log('🍽️  Seeding menu data...')

  // ============================================================================
  // 0. ADMIN USER
  // ============================================================================
  const adminUser = await prisma.adminUser.upsert({
    where: { email: 'admin@guindawellness.es' },
    update: {},
    create: {
      email: 'admin@guindawellness.es',
      passwordHash: await bcrypt.hash('changeme123', 12),
      name: 'Administrador',
      role: 'ADMIN',
      isActive: true,
    },
  })
  console.log('✅ Admin user created')

  // Clean existing menu data for idempotency
  await prisma.menuNote.deleteMany()
  await prisma.menuItemVariant.deleteMany()
  await prisma.menuItem.deleteMany()
  await prisma.menuSection.deleteMany()

  // ============================================================================
  // SECTION 1: Circuito SPA en Privado
  // ============================================================================
  const s1 = await prisma.menuSection.create({
    data: {
      slug: 'circuito-spa-privado',
      name: { es: 'Circuito SPA en Privado' },
      description: { es: 'Jácuzzi · Sauna Finlandesa · Sauna Vapor · Duchas Sensoriales · Área Relax' },
      type: 'SINGLE_SERVICE',
      displayOrder: 1,
      isActive: true,
      items: {
        create: [{
          slug: 'circuito-spa',
          name: { es: 'Circuito SPA en Privado' },
          displayOrder: 1,
          isActive: true,
          variants: {
            create: [{
              label: { es: '60 min' },
              duration: 60,
              price: 38,
              displayOrder: 1,
              isActive: true,
            }],
          },
        }],
      },
      notes: {
        create: [
          { parentType: 'SECTION', content: { es: 'Copa de cava & chocolate' }, displayOrder: 1, style: 'highlight' },
          { parentType: 'SECTION', content: { es: 'Alquiler toalla + chanclas incluidas' }, displayOrder: 2, style: 'info' },
        ],
      },
    },
  })
  console.log('✅ Section 1: Circuito SPA')

  // ============================================================================
  // SECTION 2: Masajes Terapéuticos
  // ============================================================================
  const s2 = await prisma.menuSection.create({
    data: {
      slug: 'masajes-terapeuticos',
      name: { es: 'Masajes' },
      subtitle: { es: 'Terapéuticos' },
      type: 'STANDARD',
      displayOrder: 2,
      isActive: true,
      items: {
        create: [
          {
            slug: 'relajante',
            name: { es: 'Relajante' },
            shortDescription: { es: 'Cuello y espalda o pies y piernas' },
            displayOrder: 1,
            isActive: true,
            variants: {
              create: [
                { label: { es: '30 min' }, duration: 30, price: 45, displayOrder: 1, isActive: true },
                { label: { es: '60 min' }, duration: 60, price: 70, notes: { es: 'Cuerpo completo' }, displayOrder: 2, isActive: true },
                { label: { es: '90 min' }, duration: 90, price: 90, notes: { es: 'Cuerpo completo, cabeza y rostro' }, displayOrder: 3, isActive: true },
              ],
            },
          },
          {
            slug: 'descontracturante',
            name: { es: 'Descontracturante' },
            shortDescription: { es: 'Cuello y espalda' },
            displayOrder: 2,
            isActive: true,
            variants: {
              create: [
                { label: { es: '30 min' }, duration: 30, price: 50, displayOrder: 1, isActive: true },
                { label: { es: '60 min' }, duration: 60, price: 80, notes: { es: 'Cuerpo completo' }, displayOrder: 2, isActive: true },
              ],
            },
          },
        ],
      },
    },
  })
  console.log('✅ Section 2: Masajes Terapéuticos')

  // ============================================================================
  // SECTION 3: Masajes del Mundo
  // ============================================================================
  const s3 = await prisma.menuSection.create({
    data: {
      slug: 'masajes-del-mundo',
      name: { es: 'Masajes del Mundo' },
      subtitle: { es: 'Holísticos' },
      type: 'STANDARD',
      displayOrder: 3,
      isActive: true,
      items: {
        create: [
          {
            slug: 'lava-shell',
            name: { es: 'Lava Shell' },
            description: { es: 'Conchas calientes de Filipina' },
            displayOrder: 1,
            isActive: true,
            variants: { create: [{ label: { es: '60 min' }, duration: 60, price: 80, displayOrder: 1, isActive: true }] },
          },
          {
            slug: 'ayurvedico',
            name: { es: 'Ayurvédico' },
            description: { es: 'Pindas herbales de la India' },
            displayOrder: 2,
            isActive: true,
            variants: { create: [{ label: { es: '60 min' }, duration: 60, price: 80, displayOrder: 1, isActive: true }] },
          },
          {
            slug: 'hindu',
            name: { es: 'Hindú' },
            description: { es: 'Cabeza, cuello y rostro' },
            displayOrder: 3,
            isActive: true,
            variants: { create: [{ label: { es: '30 min' }, duration: 30, price: 50, displayOrder: 1, isActive: true }] },
          },
          {
            slug: 'kobido-facial',
            name: { es: 'Kobido Facial' },
            description: { es: 'Japonés' },
            displayOrder: 4,
            isActive: true,
            variants: { create: [{ label: { es: '30 min' }, duration: 30, price: 50, displayOrder: 1, isActive: true }] },
          },
        ],
      },
    },
  })
  console.log('✅ Section 3: Masajes del Mundo')

  // ============================================================================
  // SECTION 4: Exfoliaciones y Envolturas Corporales
  // ============================================================================
  const s4 = await prisma.menuSection.create({
    data: {
      slug: 'exfoliaciones-envolturas',
      name: { es: 'Exfoliaciones y Envolturas Corporales' },
      type: 'STANDARD',
      displayOrder: 4,
      isActive: true,
      items: {
        create: [
          {
            slug: 'algoterapia',
            name: { es: 'Algoterapia' },
            description: { es: 'Tesoros del mar (exfoliación & envoltura)' },
            displayOrder: 1,
            isActive: true,
            variants: { create: [{ label: { es: '60 min' }, duration: 60, price: 65, displayOrder: 1, isActive: true }] },
          },
          {
            slug: 'sales-y-aroma',
            name: { es: 'Sales y Aroma' },
            description: { es: 'Ritual detox (masaje exfoliante)' },
            displayOrder: 2,
            isActive: true,
            variants: { create: [{ label: { es: '30 min' }, duration: 30, price: 55, displayOrder: 1, isActive: true }] },
          },
          {
            slug: 'puro-aloe-vera',
            name: { es: 'Puro Aloe Vera' },
            description: { es: 'Superalimenta tu piel (envoltura)' },
            displayOrder: 3,
            isActive: true,
            variants: { create: [{ label: { es: '30 min' }, duration: 30, price: 45, displayOrder: 1, isActive: true }] },
          },
        ],
      },
    },
  })
  console.log('✅ Section 4: Exfoliaciones y Envolturas')

  // ============================================================================
  // SECTION 5: Packs Exclusivos
  // ============================================================================
  const s5 = await prisma.menuSection.create({
    data: {
      slug: 'packs-exclusivos',
      name: { es: 'Packs Exclusivos' },
      type: 'PACKAGES',
      displayOrder: 5,
      isActive: true,
      notes: {
        create: [
          { parentType: 'SECTION', content: { es: 'Favoritos de nuestros clientes' }, displayOrder: 1, style: 'highlight' },
        ],
      },
      items: {
        create: [
          {
            slug: 'pacific-spirit',
            name: { es: 'Pacific Spirit' },
            description: { es: 'Masaje Lava Shell + Kobido Facial Japonés (efecto lifting)' },
            savingsLabel: { es: 'Ahorra 35€' },
            totalDuration: '90 min',
            displayOrder: 1,
            isActive: true,
            variants: { create: [{ label: { es: '90 min' }, duration: 90, price: 95, displayOrder: 1, isActive: true }] },
          },
          {
            slug: 'india-ancestral',
            name: { es: 'India Ancestral' },
            description: { es: 'Masaje Ayurvédico + Hindú (cabeza, cuello y rostro)' },
            savingsLabel: { es: 'Ahorra 35€' },
            totalDuration: '90 min',
            displayOrder: 2,
            isActive: true,
            variants: { create: [{ label: { es: '90 min' }, duration: 90, price: 95, displayOrder: 1, isActive: true }] },
          },
          {
            slug: 'algoterapia-facial',
            name: { es: 'Algoterapia + Facial' },
            description: { es: 'A medida' },
            displayOrder: 3,
            isActive: true,
            variants: { create: [{ label: { es: '60 min' }, duration: 60, price: 85, displayOrder: 1, isActive: true }] },
          },
          {
            slug: 'sales-aromas-masaje',
            name: { es: 'Sales & Aromas + Masaje Hidratante' },
            description: { es: 'Cuerpo completo' },
            displayOrder: 4,
            isActive: true,
            variants: { create: [{ label: { es: '60 min' }, duration: 60, price: 85, displayOrder: 1, isActive: true }] },
          },
        ],
      },
    },
  })
  console.log('✅ Section 5: Packs Exclusivos')

  // ============================================================================
  // SECTION 6: Tratamientos a Medida (parent with sub-sections)
  // ============================================================================
  const s6 = await prisma.menuSection.create({
    data: {
      slug: 'tratamientos-a-medida',
      name: { es: 'Tratamientos a Medida' },
      subtitle: { es: 'Personalizados' },
      type: 'SUBSECTION',
      displayOrder: 6,
      isActive: true,
    },
  })

  // 6a: Faciales
  await prisma.menuSection.create({
    data: {
      slug: 'faciales',
      name: { es: 'Faciales' },
      type: 'STANDARD',
      displayOrder: 1,
      isActive: true,
      parentId: s6.id,
      items: {
        create: [{
          slug: 'rejuvenecimiento',
          name: { es: 'Rejuvenecimiento' },
          description: { es: 'Equilibrio | Firmeza | Luminosidad | Hidratación' },
          displayOrder: 1,
          isActive: true,
          variants: {
            create: [
              { label: { es: '30 min' }, duration: 30, price: 55, displayOrder: 1, isActive: true },
              { label: { es: '60 min' }, duration: 60, price: 75, displayOrder: 2, isActive: true },
              { label: { es: '90 min' }, duration: 90, price: 90, displayOrder: 3, isActive: true },
            ],
          },
        }],
      },
    },
  })

  // 6b: Corporales
  await prisma.menuSection.create({
    data: {
      slug: 'corporales',
      name: { es: 'Corporales' },
      type: 'STANDARD',
      displayOrder: 2,
      isActive: true,
      parentId: s6.id,
      items: {
        create: [{
          slug: 'masaje-estetico',
          name: { es: 'Masaje Estético' },
          description: { es: 'Drenaje linfático | Anticelulítico | Tonificación' },
          displayOrder: 1,
          isActive: true,
          variants: {
            create: [
              { label: { es: '30 min' }, duration: 30, price: 50, displayOrder: 1, isActive: true },
              { label: { es: '60 min' }, duration: 60, price: 80, displayOrder: 2, isActive: true },
            ],
          },
        }],
      },
    },
  })

  // 6c: Manos & Pies
  const s6c = await prisma.menuSection.create({
    data: {
      slug: 'manos-y-pies',
      name: { es: 'Manos & Pies' },
      type: 'STANDARD',
      displayOrder: 3,
      isActive: true,
      parentId: s6.id,
      items: {
        create: [
          {
            slug: 'manicura-spa',
            name: { es: 'Manicura SPA' },
            displayOrder: 1,
            isActive: true,
            variants: {
              create: [
                { label: { es: 'Esmaltado tradicional' }, price: 45, displayOrder: 1, isActive: true },
                { label: { es: 'Esmaltado semipermanente' }, price: 50, displayOrder: 2, isActive: true },
                { label: { es: 'Gel de construcción' }, price: 60, displayOrder: 3, isActive: true },
              ],
            },
          },
          {
            slug: 'pedicura-spa',
            name: { es: 'Pedicura SPA' },
            displayOrder: 2,
            isActive: true,
            variants: {
              create: [
                { label: { es: 'Esmaltado tradicional' }, price: 55, displayOrder: 1, isActive: true },
                { label: { es: 'Esmaltado semipermanente' }, price: 65, displayOrder: 2, isActive: true },
              ],
            },
          },
        ],
      },
      notes: {
        create: [
          { parentType: 'SECTION', content: { es: 'Tratamiento IBX — Repara & fortalece 15€' }, displayOrder: 1, style: 'info' },
        ],
      },
    },
  })
  console.log('✅ Section 6: Tratamientos a Medida (con subsecciones)')

  // ============================================================================
  // SECTION 7: Peluquería
  // ============================================================================
  const s7 = await prisma.menuSection.create({
    data: {
      slug: 'peluqueria',
      name: { es: 'Peluquería' },
      type: 'STANDARD',
      displayOrder: 7,
      isActive: true,
      notes: {
        create: [
          { parentType: 'SECTION', content: { es: '*Servicios de coloración disponibles' }, displayOrder: 1, style: 'asterisk' },
          { parentType: 'SECTION', content: { es: '*Todos los trabajos se realizan con productos naturales respetuosos con el medio ambiente' }, displayOrder: 2, style: 'asterisk' },
        ],
      },
      items: {
        create: [
          {
            slug: 'lavado-peinado',
            name: { es: 'Lavado & Peinado' },
            displayOrder: 1,
            isActive: true,
            variants: {
              create: [
                { label: { es: 'Corto' }, price: 35, displayOrder: 1, isActive: true },
                { label: { es: 'Medio' }, price: 45, displayOrder: 2, isActive: true },
                { label: { es: 'Largo' }, price: 55, displayOrder: 3, isActive: true },
              ],
            },
          },
          {
            slug: 'corte-y-secado',
            name: { es: 'Corte y Secado' },
            displayOrder: 3,
            isActive: true,
            variants: {
              create: [
                { label: { es: 'Natural' }, price: 45, displayOrder: 1, isActive: true },
                { label: { es: 'Corto' }, price: 55, displayOrder: 2, isActive: true },
                { label: { es: 'Medio' }, price: 65, displayOrder: 3, isActive: true },
                { label: { es: 'Largo' }, price: 75, displayOrder: 4, isActive: true },
              ],
            },
          },
          {
            slug: 'corte-lavado-caballero',
            name: { es: 'Corte & Lavado de Caballero' },
            displayOrder: 4,
            isActive: true,
            variants: { create: [{ label: { es: 'Corte & Lavado' }, price: 35, displayOrder: 1, isActive: true }] },
          },
          {
            slug: 'tinte-cejas-pestanas',
            name: { es: 'Tinte de Cejas o Pestañas' },
            displayOrder: 5,
            isActive: true,
            variants: { create: [{ label: { es: 'Tinte' }, price: 25, displayOrder: 1, isActive: true }] },
          },
        ],
      },
    },
  })

  // Add note to lavado-peinado item
  const lavadoPeinado = await prisma.menuItem.findFirst({
    where: { sectionId: s7.id, slug: 'lavado-peinado' },
  })
  if (lavadoPeinado) {
    await prisma.menuNote.create({
      data: {
        parentType: 'ITEM',
        itemId: lavadoPeinado.id,
        content: { es: 'Tratamiento Fusio-Dose Kérastase 15€' },
        displayOrder: 1,
        style: 'info',
      },
    })
  }
  console.log('✅ Section 7: Peluquería')

  // ============================================================================
  // SECTION 8: Wellness en Pareja
  // ============================================================================
  const s8 = await prisma.menuSection.create({
    data: {
      slug: 'wellness-en-pareja',
      name: { es: 'Wellness en Pareja' },
      type: 'COUPLES',
      displayOrder: 8,
      isActive: true,
      items: {
        create: [
          {
            slug: 'circuito-spa-pareja',
            name: { es: 'Circuito SPA en Privado' },
            description: { es: 'Jácuzzi · Sauna Finlandesa · Sauna Vapor · Duchas Sensoriales · Área Relax' },
            displayOrder: 1,
            isActive: true,
            variants: {
              create: [{ label: { es: '60 min' }, duration: 60, price: 75, notes: { es: 'Pareja' }, displayOrder: 1, isActive: true }],
            },
          },
          {
            slug: 'experiencia-wellness',
            name: { es: 'Experiencia Wellness (SPA + Masaje)' },
            description: { es: 'Circuito SPA en Privado 60 min +' },
            displayOrder: 2,
            isActive: true,
            variants: {
              create: [
                { label: { es: '+Relajante Cuello y Espalda 30 min' }, duration: 30, price: 140, notes: { es: 'Pareja' }, displayOrder: 1, isActive: true },
                { label: { es: '+Relajante Cuerpo Completo 60 min' }, duration: 60, price: 180, notes: { es: 'Pareja' }, displayOrder: 2, isActive: true },
              ],
            },
          },
          {
            slug: 'masajes-en-pareja',
            name: { es: 'Masajes en Pareja' },
            shortDescription: { es: 'Relajante' },
            displayOrder: 3,
            isActive: true,
            variants: {
              create: [
                { label: { es: '30 min Cuello y espalda o pies y piernas' }, duration: 30, price: 85, notes: { es: 'Pareja' }, displayOrder: 1, isActive: true },
                { label: { es: '60 min Cuerpo completo' }, duration: 60, price: 130, notes: { es: 'Pareja' }, displayOrder: 2, isActive: true },
                { label: { es: '90 min Cuerpo completo, cabeza y rostro' }, duration: 90, price: 165, notes: { es: 'Pareja' }, displayOrder: 3, isActive: true },
              ],
            },
          },
          {
            slug: 'experiencia-cabina-privada',
            name: { es: 'Experiencia en Cabina Privada' },
            description: { es: 'Un viaje distinto cada mes (consúltenos)' },
            displayOrder: 4,
            isActive: true,
            variants: {
              create: [{ label: { es: '60 min' }, duration: 60, price: 95, notes: { es: 'Pareja' }, displayOrder: 1, isActive: true }],
            },
          },
        ],
      },
    },
  })

  // Add notes to couple items
  const circuitoPareja = await prisma.menuItem.findFirst({ where: { sectionId: s8.id, slug: 'circuito-spa-pareja' } })
  if (circuitoPareja) {
    await prisma.menuNote.createMany({
      data: [
        { parentType: 'ITEM', itemId: circuitoPareja.id, content: { es: 'Copa de cava & chocolate' }, displayOrder: 1, style: 'highlight' },
        { parentType: 'ITEM', itemId: circuitoPareja.id, content: { es: 'Alquiler toalla + chanclas incluidas' }, displayOrder: 2, style: 'info' },
      ],
    })
  }
  const expWellness = await prisma.menuItem.findFirst({ where: { sectionId: s8.id, slug: 'experiencia-wellness' } })
  if (expWellness) {
    await prisma.menuNote.createMany({
      data: [
        { parentType: 'ITEM', itemId: expWellness.id, content: { es: 'Suplemento por descontracturante' }, displayOrder: 1, style: 'info' },
        { parentType: 'ITEM', itemId: expWellness.id, content: { es: 'Albornoz + toallas + chanclas incluidas' }, displayOrder: 2, style: 'info' },
      ],
    })
  }
  const masajesPareja = await prisma.menuItem.findFirst({ where: { sectionId: s8.id, slug: 'masajes-en-pareja' } })
  if (masajesPareja) {
    await prisma.menuNote.create({
      data: { parentType: 'ITEM', itemId: masajesPareja.id, content: { es: 'Suplemento por descontracturante' }, displayOrder: 1, style: 'info' },
    })
  }
  console.log('✅ Section 8: Wellness en Pareja')

  // ============================================================================
  // SECTION 9: Bonos Personalizados
  // ============================================================================
  const s9 = await prisma.menuSection.create({
    data: {
      slug: 'bonos-personalizados',
      name: { es: 'Bonos Personalizados' },
      type: 'INFO',
      displayOrder: 9,
      isActive: true,
      notes: {
        create: [
          { parentType: 'SECTION', content: { es: 'Con cualquiera de nuestros servicios' }, displayOrder: 1, style: 'info' },
        ],
      },
      items: {
        create: [
          {
            slug: 'bono-3-plus-1',
            name: { es: 'Bono 3+1' },
            description: { es: '3 + 1 gratis a disfrutar en 1 mes' },
            displayOrder: 1,
            isActive: true,
          },
          {
            slug: 'bono-5-plus-1',
            name: { es: 'Bono 5+1' },
            description: { es: '5 + 1 gratis a disfrutar en 3 meses' },
            displayOrder: 2,
            isActive: true,
          },
        ],
      },
    },
  })
  console.log('✅ Section 9: Bonos Personalizados')

  // ============================================================================
  // CREATE INITIAL PUBLISHED VERSION
  // ============================================================================
  console.log('📸 Creating initial published version...')

  // Manually build the snapshot by querying all data
  const allSections = await prisma.menuSection.findMany({
    where: { parentId: null, deletedAt: null },
    orderBy: { displayOrder: 'asc' },
    include: {
      items: {
        where: { deletedAt: null },
        orderBy: { displayOrder: 'asc' },
        include: {
          variants: { orderBy: { displayOrder: 'asc' } },
          notes: { orderBy: { displayOrder: 'asc' } },
        },
      },
      notes: { orderBy: { displayOrder: 'asc' } },
      children: {
        where: { deletedAt: null },
        orderBy: { displayOrder: 'asc' },
        include: {
          items: {
            where: { deletedAt: null },
            orderBy: { displayOrder: 'asc' },
            include: {
              variants: { orderBy: { displayOrder: 'asc' } },
              notes: { orderBy: { displayOrder: 'asc' } },
            },
          },
          notes: { orderBy: { displayOrder: 'asc' } },
        },
      },
    },
  })

  // Build snapshot JSON
  function buildSectionSnapshot(section: typeof allSections[0]): Record<string, unknown> {
    return {
      id: section.id,
      slug: section.slug,
      name: section.name,
      description: section.description,
      subtitle: section.subtitle,
      displayOrder: section.displayOrder,
      isActive: section.isActive,
      type: section.type,
      icon: section.icon,
      parentId: section.parentId,
      items: section.items.map((item) => ({
        id: item.id,
        slug: item.slug,
        name: item.name,
        description: item.description,
        shortDescription: item.shortDescription,
        displayOrder: item.displayOrder,
        isActive: item.isActive,
        tags: item.tags,
        savingsLabel: item.savingsLabel,
        totalDuration: item.totalDuration,
        operationalServiceId: item.operationalServiceId,
        operationalPackageId: item.operationalPackageId,
        variants: item.variants.map((v) => ({
          id: v.id,
          label: v.label,
          duration: v.duration,
          durationUnit: v.durationUnit,
          price: Number(v.price),
          notes: v.notes,
          displayOrder: v.displayOrder,
          isActive: v.isActive,
        })),
        notes: item.notes.map((n) => ({
          id: n.id,
          content: n.content,
          displayOrder: n.displayOrder,
          style: n.style,
        })),
      })),
      notes: section.notes.map((n) => ({
        id: n.id,
        content: n.content,
        displayOrder: n.displayOrder,
        style: n.style,
      })),
      children: ('children' in section && Array.isArray(section.children))
        ? (section.children as typeof allSections).map(buildSectionSnapshot)
        : [],
    }
  }

  const snapshot = {
    version: 1,
    publishedAt: new Date().toISOString(),
    sections: allSections.map(buildSectionSnapshot),
    metadata: {
      totalSections: allSections.length,
      totalItems: allSections.reduce((acc, s) => acc + s.items.length + (s.children?.reduce((a: number, c: { items: unknown[] }) => a + c.items.length, 0) || 0), 0),
      totalVariants: allSections.reduce((acc, s) =>
        acc + s.items.reduce((a, i) => a + i.variants.length, 0) +
        (s.children?.reduce((a: number, c: { items: Array<{ variants: unknown[] }> }) =>
          a + c.items.reduce((a2: number, i: { variants: unknown[] }) => a2 + i.variants.length, 0), 0) || 0),
      0),
      generatedAt: new Date().toISOString(),
    },
  }

  // Delete old versions if reseeding
  await prisma.menuVersion.deleteMany()

  const version = await prisma.menuVersion.create({
    data: {
      version: 1,
      status: 'PUBLISHED',
      data: JSON.parse(JSON.stringify(snapshot)),
      changelog: 'Carga inicial de la carta de precios',
      publishedAt: new Date(),
      publishedBy: adminUser.id,
    },
  })

  // Upsert settings
  await prisma.menuSettings.upsert({
    where: { id: 'singleton' },
    update: { currentPublishedVersionId: version.id },
    create: { id: 'singleton', currentPublishedVersionId: version.id },
  })

  console.log(`✅ Published version v1 (${version.id})`)
  console.log('🎉 Menu seed completed!')
}
