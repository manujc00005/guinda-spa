# Arquitectura Backend - Guinda Wellness & Spa

## B) Relaciones y Cardinalidades - Decisiones de Diseño

### 1. **Category → Service** (1:N)
- Una categoría tiene múltiples servicios
- Un servicio pertenece a una sola categoría
- **Por qué**: Simplifica navegación y filtrado. Evita complejidad de muchos-a-muchos.

### 2. **Service → ServiceVariant** (1:N)
- Un servicio puede tener múltiples variantes (duraciones, tipos, áreas)
- Una variante pertenece a un solo servicio
- **Por qué**: Centraliza precios. Cada combinación (30min, 60min, relajante, descontracturante) es una variante independiente con su precio.

### 3. **Service ↔ Addon** (N:M via ServiceAddon)
- Un servicio puede tener múltiples addons aplicables
- Un addon puede aplicar a múltiples servicios
- **Por qué**: Los extras (toalla, IBX, Kerastase) se reutilizan entre servicios. La tabla pivote permite configurar cuáles aplican a cada servicio.

### 4. **Package → PackageItem** (1:N)
- Un paquete contiene múltiples items (servicios/variantes)
- **Por qué**: Un "Ritual Pacific Spirit" incluye: circuito spa + masaje + exfoliación. Cada uno es un item.

### 5. **VoucherTemplate → Voucher** (1:N)
- Una plantilla de bono (3+1, 5+1) genera múltiples vouchers vendidos
- **Por qué**: Separar "producto" (template) de "instancia comprada" (voucher). Permite cambiar precios de templates sin afectar vouchers ya vendidos.

### 6. **Voucher → VoucherRedemption** (1:N)
- Un voucher puede tener múltiples redenciones (una por sesión)
- **Por qué**: Auditoría completa. Sabemos cuándo, dónde y cuánto se usó cada vez.

### 7. **Order → OrderItem** (1:N)
- Un pedido tiene múltiples líneas (servicios, paquetes, vouchers)
- **Por qué**: Un cliente puede comprar 2 masajes + 1 bono + 1 paquete en una sola orden.

### 8. **Order → Payment** (1:N, normalmente 1:1)
- Un pedido puede tener múltiples intentos de pago
- **Por qué**: Si el primer pago falla, el cliente puede reintentar. También soporta reembolsos parciales (pagos negativos).

### 9. **Order → Booking** (1:N)
- Un pedido puede generar múltiples reservas
- **Por qué**: Si compras "2 masajes en pareja", son 2 bookings con fechas diferentes.

### 10. **Voucher → Order** (N:1)
- Múltiples vouchers pueden generarse en una orden (ej: compra de 3 bonos regalo)
- **Por qué**: Facilita tracking de compra masiva de bonos.

---

## C) Estrategia MONEI - Integración Completa

### Decisión Clave: ¿Catálogo en MONEI o solo en DB?

**RECOMENDACIÓN: Solo en DB + Prices dinámicos**

**Razones:**
1. **Flexibilidad**: Tu catálogo es complejo (variantes, áreas, duraciones). Sincronizar con MONEI crea rigidez.
2. **Precios dinámicos**: Puedes cambiar precios en tu admin y revalidar frontend sin tocar MONEI.
3. **Addons variables**: Los extras (+10€ deportivo) son difíciles de modelar como Products en MONEI.
4. **Bonos personalizados**: Los vouchers necesitan lógica custom que MONEI Products no soporta.

**Flujo recomendado:**
```
DB (Prisma) → Next.js Admin → Cambio precio → revalidatePath()
                ↓
         Frontend actualizado
                ↓
    Checkout: crear Price dinámico en MONEI
                ↓
         Checkout Session
                ↓
            Webhook
                ↓
      Actualizar Order/Payment en DB
```

---

## Flujos de Checkout

### **FLUJO 1: Compra de Voucher (Bono Regalo)**

```typescript
// 1. Frontend: Usuario elige bono 3+1
POST /api/cart/add
{
  type: "voucher",
  voucherTemplateId: "bono-3-plus-1",
  quantity: 2, // Compra 2 bonos
  recipientEmail?: "regalo@example.com",
  giftMessage?: "¡Feliz cumpleaños!"
}

// 2. Backend: Crear Order pendiente
const order = await prisma.order.create({
  data: {
    orderNumber: generateOrderNumber(), // "GND-2024-0001"
    customerId,
    isVoucherPurchase: true,
    subtotal: 199.98, // 99.99 * 2
    taxAmount: 41.99,  // IVA 21%
    total: 241.97,
    status: "PENDING",
    items: {
      create: {
        itemType: "voucher",
        voucherTemplateId: "bono-3-plus-1",
        name: "Bono 3+1 Gratis",
        quantity: 2,
        unitPrice: 99.99,
        totalPrice: 199.98
      }
    }
  }
})

// 3. Crear Checkout Session en MONEI
const session = await monei.checkoutSession.create({
  amount: Math.round(order.total * 100), // Céntimos
  currency: "EUR",
  orderId: order.orderNumber,
  customer: {
    email: customer.email,
    name: `${customer.firstName} ${customer.lastName}`
  },
  successUrl: `${process.env.NEXT_PUBLIC_URL}/checkout/success?session_id={checkout_session_id}`,
  cancelUrl: `${process.env.NEXT_PUBLIC_URL}/checkout/cancel`,
  metadata: {
    orderId: order.id,
    orderType: "voucher_purchase"
  }
})

// 4. Guardar Payment pendiente
await prisma.payment.create({
  data: {
    orderId: order.id,
    paymentId: session.id,
    sessionId: session.id,
    amount: order.total,
    status: "PENDING",
    successUrl: session.successUrl,
    cancelUrl: session.cancelUrl
  }
})

// 5. Redirigir a MONEI
return { checkoutUrl: session.url }

// 6. WEBHOOK: checkout.session.completed
// Ver sección de webhooks más abajo
```

---

### **FLUJO 2: Compra de Servicio con Reserva**

```typescript
// 1. Frontend: Usuario elige masaje 60min + addon
POST /api/cart/add
{
  type: "service_booking",
  variantId: "masaje-relajante-60min",
  addons: ["toalla-chanclas"],
  preferredDate: "2024-06-15",
  preferredTime: "10:00",
  numberOfPeople: 1
}

// 2. Backend: Verificar disponibilidad
const isAvailable = await checkAvailability(
  variant.serviceId,
  preferredDate,
  preferredTime,
  variant.duration
)

if (!isAvailable) {
  throw new Error("Horario no disponible")
}

// 3. Crear Order + Booking temporal
const order = await prisma.order.create({
  data: {
    orderNumber: generateOrderNumber(),
    customerId,
    isServicePurchase: true,
    subtotal: 55.00,  // 50€ masaje + 5€ addon
    taxAmount: 11.55,
    total: 66.55,
    status: "PENDING",
    items: {
      create: {
        itemType: "service_variant",
        variantId: variant.id,
        serviceId: variant.serviceId,
        name: "Masaje Relajante 60 minutos",
        quantity: 1,
        unitPrice: 50.00,
        totalPrice: 50.00,
        preferredDate: new Date("2024-06-15T10:00:00Z"),
        preferredTime: "10:00"
      }
    },
    addons: {
      create: {
        addonId: "toalla-chanclas",
        name: "Toalla y chanclas",
        quantity: 1,
        unitPrice: 5.00,
        totalPrice: 5.00
      }
    },
    bookings: {
      create: {
        bookingNumber: generateBookingNumber(),
        customerId,
        variantId: variant.id,
        serviceId: variant.serviceId,
        serviceName: "Masaje Relajante 60 minutos",
        duration: 60,
        bookingDate: new Date("2024-06-15"),
        startTime: "10:00",
        endTime: "11:00",
        numberOfPeople: 1,
        status: "PENDING" // Se confirma tras pago
      }
    }
  }
})

// 4. Crear Checkout Session (igual que voucher)
// 5. Webhook confirma → Booking.status = "CONFIRMED"
```

---

### **FLUJO 3: Canje de Voucher en Reserva**

```typescript
// 1. Usuario tiene voucher activo, quiere reservar
POST /api/bookings/create-with-voucher
{
  voucherCode: "GUINDA-1234-5678",
  variantId: "masaje-relajante-60min",
  preferredDate: "2024-06-20",
  preferredTime: "14:00"
}

// 2. Backend: Validar voucher
const voucher = await prisma.voucher.findUnique({
  where: { code: "GUINDA-1234-5678" },
  include: { template: true }
})

if (!voucher || voucher.status !== "ACTIVE") {
  throw new Error("Voucher inválido o expirado")
}

if (voucher.sessionsRemaining < 1) {
  throw new Error("No quedan sesiones en este bono")
}

if (voucher.expiresAt < new Date()) {
  await prisma.voucher.update({
    where: { id: voucher.id },
    data: { status: "EXPIRED" }
  })
  throw new Error("Voucher expirado")
}

// 3. Validar restricciones del voucher
const variant = await prisma.serviceVariant.findUnique({
  where: { id: variantId },
  include: { service: true }
})

if (voucher.template.restrictionType === "CATEGORY") {
  if (variant.service.categoryId !== voucher.template.restrictedToCategoryId) {
    throw new Error("Este bono no aplica a esta categoría")
  }
}

if (voucher.template.restrictionType === "SERVICE") {
  if (variant.serviceId !== voucher.template.restrictedToServiceId) {
    throw new Error("Este bono no aplica a este servicio")
  }
}

// 4. Crear Booking sin pago
const booking = await prisma.booking.create({
  data: {
    bookingNumber: generateBookingNumber(),
    customerId: voucher.recipientId,
    variantId,
    serviceId: variant.serviceId,
    serviceName: variant.service.name + " - " + variant.name,
    duration: variant.duration,
    bookingDate: new Date(preferredDate),
    startTime: preferredTime,
    endTime: calculateEndTime(preferredTime, variant.duration),
    numberOfPeople: 1,
    status: "CONFIRMED" // Confirmado directamente
  }
})

// 5. Crear redención
await prisma.voucherRedemption.create({
  data: {
    voucherId: voucher.id,
    bookingId: booking.id,
    valueApplied: voucher.template.sessionValue || variant.price,
    sessionsUsed: 1,
    redeemedAt: new Date()
  }
})

// 6. Actualizar voucher
const newSessionsRemaining = voucher.sessionsRemaining - 1
await prisma.voucher.update({
  where: { id: voucher.id },
  data: {
    sessionsRemaining: newSessionsRemaining,
    status: newSessionsRemaining === 0 ? "FULLY_REDEEMED" :
            voucher.status === "ACTIVE" ? "PARTIALLY_USED" : voucher.status,
    firstUsedAt: voucher.firstUsedAt || new Date(),
    fullyRedeemedAt: newSessionsRemaining === 0 ? new Date() : null
  }
})

return { booking, voucher }
```

---

## Webhooks MONEI - Handler Idempotente

```typescript
// app/api/webhooks/monei/route.ts
import { headers } from 'next/headers'
import { prisma } from '@/lib/prisma'
import { monei } from '@/lib/monei'

export async function POST(req: Request) {
  const body = await req.text()
  const signature = headers().get('monei-signature')

  // 1. Verificar firma (seguridad)
  const event = monei.webhooks.constructEvent(
    body,
    signature,
    process.env.MONEI_WEBHOOK_SECRET!
  )

  // 2. Idempotencia: verificar si ya procesamos este evento
  const existingEvent = await prisma.moneiEvent.findUnique({
    where: { eventId: event.id }
  })

  if (existingEvent?.processed) {
    console.log(`Event ${event.id} already processed`)
    return new Response('OK', { status: 200 })
  }

  // 3. Guardar evento (aunque falle el procesamiento)
  await prisma.moneiEvent.create({
    data: {
      eventId: event.id,
      eventType: event.type,
      payload: event.data as any,
      processed: false
    }
  })

  // 4. Procesar según tipo
  try {
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutCompleted(event)
        break

      case 'payment_intent.succeeded':
        await handlePaymentSucceeded(event)
        break

      case 'payment_intent.failed':
        await handlePaymentFailed(event)
        break

      case 'charge.refunded':
        await handleChargeRefunded(event)
        break

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    // 5. Marcar como procesado
    await prisma.moneiEvent.update({
      where: { eventId: event.id },
      data: {
        processed: true,
        processedAt: new Date()
      }
    })

  } catch (error) {
    // 6. Guardar error para debug
    await prisma.moneiEvent.update({
      where: { eventId: event.id },
      data: {
        processingError: error.message
      }
    })

    // IMPORTANTE: Devolver 500 para que MONEI reintente
    return new Response('Processing failed', { status: 500 })
  }

  return new Response('OK', { status: 200 })
}

// ============================================================================
// HANDLERS DE EVENTOS
// ============================================================================

async function handleCheckoutCompleted(event: any) {
  const session = event.data.object
  const orderId = session.metadata.orderId

  // 1. Encontrar orden
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      items: true,
      bookings: true
    }
  })

  if (!order) {
    throw new Error(`Order ${orderId} not found`)
  }

  // 2. Actualizar Payment
  await prisma.payment.update({
    where: { sessionId: session.id },
    data: {
      status: 'SUCCEEDED',
      paymentMethod: session.paymentMethod,
      chargeId: session.chargeId,
      confirmedAt: new Date(),
      metadata: session
    }
  })

  // 3. Actualizar Order
  await prisma.order.update({
    where: { id: order.id },
    data: {
      status: 'PAYMENT_CONFIRMED'
    }
  })

  // 4. Si es compra de voucher, generar códigos
  const voucherItems = order.items.filter(item => item.itemType === 'voucher')

  for (const item of voucherItems) {
    for (let i = 0; i < item.quantity; i++) {
      const template = await prisma.voucherTemplate.findUnique({
        where: { id: item.voucherTemplateId! }
      })

      const expiresAt = new Date()
      expiresAt.setDate(expiresAt.getDate() + template!.validityDays)

      await prisma.voucher.create({
        data: {
          code: generateVoucherCode(), // "GUINDA-XXXX-XXXX"
          templateId: template!.id,
          purchasedById: order.customerId!,
          recipientId: order.customerId!, // Por defecto, el mismo
          orderId: order.id,
          status: 'ACTIVE',
          sessionsRemaining: template!.sessionsIncluded,
          expiresAt
        }
      })
    }
  }

  // 5. Si es compra de servicio, confirmar bookings
  if (order.bookings.length > 0) {
    await prisma.booking.updateMany({
      where: { orderId: order.id },
      data: {
        status: 'CONFIRMED',
        confirmedAt: new Date()
      }
    })
  }

  // 6. Enviar emails de confirmación
  // await sendOrderConfirmationEmail(order)
  // await sendVoucherEmails(vouchers)
}

async function handlePaymentSucceeded(event: any) {
  const paymentIntent = event.data.object

  await prisma.payment.updateMany({
    where: { paymentId: paymentIntent.id },
    data: {
      status: 'SUCCEEDED',
      confirmedAt: new Date()
    }
  })
}

async function handlePaymentFailed(event: any) {
  const paymentIntent = event.data.object

  await prisma.payment.updateMany({
    where: { paymentId: paymentIntent.id },
    data: {
      status: 'FAILED',
      failedAt: new Date()
    }
  })

  // Marcar orden como fallida
  const payment = await prisma.payment.findFirst({
    where: { paymentId: paymentIntent.id },
    include: { order: true }
  })

  if (payment) {
    await prisma.order.update({
      where: { id: payment.orderId },
      data: { status: 'CANCELLED' }
    })
  }
}

async function handleChargeRefunded(event: any) {
  const charge = event.data.object

  const payment = await prisma.payment.findFirst({
    where: { chargeId: charge.id }
  })

  if (!payment) return

  await prisma.payment.update({
    where: { id: payment.id },
    data: {
      status: charge.amountRefunded === charge.amount ? 'REFUNDED' : 'PARTIALLY_REFUNDED',
      refundedAmount: charge.amountRefunded / 100, // Céntimos a euros
      refundedAt: new Date()
    }
  })

  await prisma.order.update({
    where: { id: payment.orderId },
    data: {
      status: charge.amountRefunded === charge.amount ? 'REFUNDED' : 'PAYMENT_CONFIRMED'
    }
  })

  // Si había vouchers generados, marcarlos como REFUNDED
  if (charge.amountRefunded === charge.amount) {
    await prisma.voucher.updateMany({
      where: {
        orderId: payment.orderId,
        status: 'ACTIVE'
      },
      data: {
        status: 'REFUNDED'
      }
    })
  }
}

// ============================================================================
// HELPERS
// ============================================================================

function generateVoucherCode(): string {
  // GUINDA-XXXX-XXXX
  const part1 = Math.random().toString(36).substring(2, 6).toUpperCase()
  const part2 = Math.random().toString(36).substring(2, 6).toUpperCase()
  return `GUINDA-${part1}-${part2}`
}

function generateOrderNumber(): string {
  const year = new Date().getFullYear()
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0')
  return `GND-${year}-${random}`
}

function generateBookingNumber(): string {
  const year = new Date().getFullYear()
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0')
  return `BKG-${year}-${random}`
}
```

---

## Mapeo de Estados

### OrderStatus

| Estado | Descripción | Cuándo |
|--------|-------------|--------|
| `PENDING` | Creado, esperando pago | Al crear Order |
| `PAYMENT_PROCESSING` | Pago en proceso | Usuario redirigido a MONEI |
| `PAYMENT_CONFIRMED` | Pago exitoso | Webhook `checkout.session.completed` |
| `COMPLETED` | Servicio entregado/reserva completada | Tras booking completado |
| `CANCELLED` | Cancelado | Usuario cancela o pago falla |
| `REFUNDED` | Reembolsado | Webhook `charge.refunded` |
| `EXPIRED` | Sin pago tras 24h | Cron job diario |

### PaymentStatus

| Estado | Descripción | Webhook |
|--------|-------------|---------|
| `PENDING` | Esperando pago | - |
| `PROCESSING` | En proceso | - |
| `SUCCEEDED` | Confirmado | `payment_intent.succeeded` |
| `FAILED` | Fallido | `payment_intent.failed` |
| `REFUNDED` | Reembolsado completamente | `charge.refunded` (full) |
| `PARTIALLY_REFUNDED` | Reembolsado parcialmente | `charge.refunded` (partial) |

### VoucherStatus

| Estado | Descripción | Cuándo |
|--------|-------------|--------|
| `ACTIVE` | Sin usar, válido | Tras compra |
| `PARTIALLY_USED` | Tiene sesiones restantes | Primera redención |
| `FULLY_REDEEMED` | Todas las sesiones usadas | Última redención |
| `EXPIRED` | Caducado | `expiresAt` < now |
| `REFUNDED` | Reembolsado (anulado) | Reembolso de orden |
| `CANCELLED` | Cancelado antes de usar | Admin/usuario |

---

## D) Reglas de Caducidad de Bonos

### Regla 1: Caducidad desde compra

```typescript
// Al crear voucher tras pago
const template = await prisma.voucherTemplate.findUnique({
  where: { id: voucherTemplateId }
})

const expiresAt = new Date()
expiresAt.setDate(expiresAt.getDate() + template.validityDays)
// 3+1 → validityDays=30 (1 mes)
// 5+1 → validityDays=90 (3 meses)

await prisma.voucher.create({
  data: {
    // ...
    expiresAt,
    status: 'ACTIVE'
  }
})
```

### Regla 2: Validación pre-canje

```typescript
// Antes de permitir reserva con voucher
async function validateVoucher(voucherCode: string) {
  const voucher = await prisma.voucher.findUnique({
    where: { code: voucherCode }
  })

  if (!voucher) {
    throw new Error("Voucher no encontrado")
  }

  if (voucher.status === 'EXPIRED') {
    throw new Error("Este bono ha expirado")
  }

  if (voucher.status === 'FULLY_REDEEMED') {
    throw new Error("Este bono ya ha sido usado completamente")
  }

  if (voucher.status === 'REFUNDED' || voucher.status === 'CANCELLED') {
    throw new Error("Este bono no es válido")
  }

  // Validar fecha de expiración
  if (voucher.expiresAt < new Date()) {
    // Marcar como expirado
    await prisma.voucher.update({
      where: { id: voucher.id },
      data: { status: 'EXPIRED' }
    })
    throw new Error("Este bono ha expirado")
  }

  if (voucher.sessionsRemaining < 1) {
    throw new Error("No quedan sesiones en este bono")
  }

  return voucher
}
```

### Regla 3: Cron job diario para expirar bonos

```typescript
// app/api/cron/expire-vouchers/route.ts
export async function GET() {
  // Seguridad: validar cron secret
  if (req.headers.get('authorization') !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized', { status: 401 })
  }

  const expiredVouchers = await prisma.voucher.updateMany({
    where: {
      expiresAt: { lt: new Date() },
      status: { in: ['ACTIVE', 'PARTIALLY_USED'] }
    },
    data: {
      status: 'EXPIRED'
    }
  })

  return Response.json({
    expired: expiredVouchers.count
  })
}

// Configurar en Vercel Cron:
// vercel.json
{
  "crons": [
    {
      "path": "/api/cron/expire-vouchers",
      "schedule": "0 0 * * *" // Diario a medianoche
    }
  ]
}
```

### Regla 4: Prevenir uso duplicado

```typescript
// Al crear redención, usar transacción
await prisma.$transaction(async (tx) => {
  // 1. Re-verificar sesiones disponibles (lock)
  const voucher = await tx.voucher.findUnique({
    where: { id: voucherId }
  })

  if (voucher.sessionsRemaining < 1) {
    throw new Error("No hay sesiones disponibles")
  }

  // 2. Crear redención
  await tx.voucherRedemption.create({
    data: {
      voucherId,
      bookingId,
      valueApplied,
      sessionsUsed: 1
    }
  })

  // 3. Decrementar sesiones (atomically)
  await tx.voucher.update({
    where: { id: voucherId },
    data: {
      sessionsRemaining: { decrement: 1 }
    }
  })
})
```

### Regla 5: No permitir múltiples vouchers por booking

```typescript
// Validación en API de creación de booking
const existingRedemptions = await prisma.voucherRedemption.findMany({
  where: { bookingId }
})

if (existingRedemptions.length > 0) {
  throw new Error("Esta reserva ya tiene un bono aplicado")
}
```

---

## Índices y Performance

El schema ya incluye índices estratégicos:

```prisma
// Búsquedas frecuentes
@@index([slug])           // Navegación por URL
@@index([isActive])       // Filtrar activos
@@index([status])         // Dashboard de estados
@@index([createdAt])      // Ordenar por fecha

// Relaciones N:1
@@index([categoryId])     // JOIN category
@@index([serviceId])      // JOIN service
@@index([customerId])     // Pedidos de cliente

// Búsquedas de negocio
@@index([code])           // Validar voucher
@@index([expiresAt])      // Cron de expiración
@@index([bookingDate])    // Calendario de reservas
@@index([orderNumber])    // Buscar pedidos

// Compuestos para queries complejas
@@index([isActive, displayOrder])  // Listados ordenados
@@index([isActive, isFeatured])    // Home destacados
```

---

## Soft Delete

Servicios, paquetes y clientes tienen `deletedAt`:

```typescript
// No eliminar físicamente, marcar como eliminado
await prisma.service.update({
  where: { id },
  data: { deletedAt: new Date() }
})

// Queries excluyen eliminados por defecto
const services = await prisma.service.findMany({
  where: { deletedAt: null, isActive: true }
})

// Auditoría: historial completo sigue disponible
const allOrders = await prisma.order.findMany({
  include: {
    items: {
      include: {
        service: true // Incluye eliminados para historial
      }
    }
  }
})
```

---

## Próximos pasos recomendados

1. **Migraciones**: `npx prisma migrate dev --name init`
2. **Seed**: Ver archivo `seed.ts` en próximo documento
3. **API Routes**: Crear endpoints REST en `/app/api`
4. **Server Actions**: Para formularios (crear booking, aplicar voucher)
5. **Admin Dashboard**: CRUD de servicios/precios con revalidación
6. **Frontend**: Catálogo público + checkout
7. **Emails**: Confirmaciones con Resend o similar
8. **Testing**: Tests de webhooks con MONEI test mode

