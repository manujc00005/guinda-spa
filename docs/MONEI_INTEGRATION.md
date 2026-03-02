# Integración MONEI - Guía Completa

## Instalación

```bash
npm install @monei-js/node-sdk
```

**Documentación oficial**: https://docs.monei.com/docs/getting-started
**NPM Package**: https://www.npmjs.com/package/@monei-js/node-sdk
**GitHub**: https://github.com/MONEI/monei-node-sdk

## Configuración Inicial

```typescript
// lib/monei.ts
import Monei from '@monei-js/node-sdk'

if (!process.env.MONEI_API_KEY) {
  throw new Error('MONEI_API_KEY is required. Get it from https://dashboard.monei.com/settings/api-keys')
}

export const monei = new Monei(process.env.MONEI_API_KEY)

// Export types for convenience
export type { Payment, PaymentMethod } from '@monei-js/node-sdk'

// Variables de entorno (.env.local)
// MONEI_API_KEY=pk_test_xxxxxxxxxxxxx (test) o pk_live_xxxxxxxxxxxxx (production)
// MONEI_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxx
// MONEI_ACCOUNT_ID=acc_xxxxxxxxxxxxx (opcional)
```

## Estrategia de Catálogo: DB-First (Recomendado)

### ¿Por qué NO sincronizar catálogo con MONEI?

1. **Complejidad del catálogo**:
   - Variantes múltiples (duración + área + tipo)
   - Precios dinámicos según addons
   - Lógica de bonos personalizada

2. **Flexibilidad de precios**:
   - Admin puede cambiar precios en tiempo real
   - No dependes de sincronización con MONEI
   - Revalidación instantánea en frontend

3. **Evitar duplicidad**:
   - Una sola fuente de verdad: PostgreSQL
   - Menos posibilidad de desincronización

### Flujo recomendado

```
┌─────────────────┐
│   PostgreSQL    │  ← FUENTE DE VERDAD (precios, catálogo)
│   (Prisma)      │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Next.js Admin  │  ← Editar precios
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  revalidatePath │  ← Actualizar frontend
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   Frontend      │  ← Usuario ve nuevo precio
│   (Catálogo)    │
└────────┬────────┘
         │
         ▼ Checkout
┌─────────────────┐
│  Crear Price    │  ← Precio dinámico desde DB
│  en MONEI       │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Checkout Session│
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│    Webhook      │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Actualizar DB  │  ← Order/Payment/Voucher
└─────────────────┘
```

---

## API Endpoints Necesarios

### 1. Crear Checkout para Voucher

```typescript
// app/api/checkout/voucher/route.ts
import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { monei } from '@/lib/monei'

export async function POST(req: NextRequest) {
  const { voucherTemplateId, quantity, customerId, recipientEmail, giftMessage } = await req.json()

  // 1. Obtener template
  const template = await prisma.voucherTemplate.findUnique({
    where: { id: voucherTemplateId }
  })

  if (!template || !template.isActive) {
    return Response.json({ error: 'Template inválido' }, { status: 400 })
  }

  // 2. Obtener customer
  const customer = await prisma.customer.findUnique({
    where: { id: customerId }
  })

  // 3. Calcular totales
  const subtotal = template.price * quantity
  const taxRate = 0.21 // IVA 21%
  const taxAmount = subtotal * taxRate
  const total = subtotal + taxAmount

  // 4. Crear Order en estado PENDING
  const order = await prisma.order.create({
    data: {
      orderNumber: generateOrderNumber(),
      customerId,
      isVoucherPurchase: true,
      subtotal,
      taxAmount,
      total,
      status: 'PENDING',
      items: {
        create: {
          itemType: 'voucher',
          voucherTemplateId: template.id,
          name: template.name,
          description: template.description,
          quantity,
          unitPrice: template.price,
          totalPrice: subtotal
        }
      }
    }
  })

  // 5. Crear Checkout Session en MONEI
  try {
    const session = await monei.checkoutSession.create({
      amount: Math.round(total * 100), // Céntimos
      currency: 'EUR',
      orderId: order.orderNumber,
      customer: {
        email: customer?.email || recipientEmail,
        name: customer ? `${customer.firstName} ${customer.lastName}` : undefined
      },
      successUrl: `${process.env.NEXT_PUBLIC_URL}/checkout/success?session_id={checkout_session_id}`,
      cancelUrl: `${process.env.NEXT_PUBLIC_URL}/checkout/cancel?order=${order.id}`,
      callbackUrl: `${process.env.NEXT_PUBLIC_URL}/api/webhooks/monei`,
      metadata: {
        orderId: order.id,
        orderType: 'voucher_purchase',
        quantity: quantity.toString(),
        recipientEmail: recipientEmail || '',
        isGift: recipientEmail ? 'true' : 'false'
      },
      // Configuración adicional
      sessionDetails: {
        billingDetails: {
          name: true,
          email: true,
          phone: false,
          address: false
        }
      }
    })

    // 6. Guardar Payment en DB
    await prisma.payment.create({
      data: {
        orderId: order.id,
        paymentId: session.id,
        sessionId: session.id,
        amount: total,
        currency: 'EUR',
        status: 'PENDING',
        successUrl: session.successUrl,
        cancelUrl: session.cancelUrl
      }
    })

    return Response.json({
      checkoutUrl: session.url,
      sessionId: session.id,
      orderId: order.id
    })

  } catch (error) {
    // Marcar orden como cancelada si falla
    await prisma.order.update({
      where: { id: order.id },
      data: { status: 'CANCELLED' }
    })

    console.error('MONEI checkout error:', error)
    return Response.json({ error: 'Error al crear checkout' }, { status: 500 })
  }
}

function generateOrderNumber(): string {
  const year = new Date().getFullYear()
  const random = Math.floor(Math.random() * 100000).toString().padStart(5, '0')
  return `GND-${year}-${random}`
}
```

---

### 2. Crear Checkout para Reserva

```typescript
// app/api/checkout/booking/route.ts
import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { monei } from '@/lib/monei'

export async function POST(req: NextRequest) {
  const {
    customerId,
    variantId,
    serviceId,
    packageId,
    addonIds = [],
    preferredDate,
    preferredTime,
    numberOfPeople = 1,
    guestEmail,
    guestName
  } = await req.json()

  // 1. Validar disponibilidad
  const isAvailable = await checkAvailability(
    serviceId || packageId,
    preferredDate,
    preferredTime
  )

  if (!isAvailable) {
    return Response.json({ error: 'Horario no disponible' }, { status: 409 })
  }

  let serviceName = ''
  let duration = 0
  let subtotal = 0

  // 2. Calcular precio según tipo (service variant o package)
  if (variantId) {
    const variant = await prisma.serviceVariant.findUnique({
      where: { id: variantId },
      include: { service: true }
    })
    if (!variant) {
      return Response.json({ error: 'Variante no encontrada' }, { status: 404 })
    }
    serviceName = `${variant.service.name} - ${variant.name}`
    duration = variant.duration || 0
    subtotal = Number(variant.price) * numberOfPeople
  } else if (packageId) {
    const pkg = await prisma.package.findUnique({
      where: { id: packageId }
    })
    if (!pkg) {
      return Response.json({ error: 'Paquete no encontrado' }, { status: 404 })
    }
    serviceName = pkg.name
    duration = pkg.totalDuration || 0
    subtotal = Number(pkg.price)
  }

  // 3. Añadir addons
  const addons = await prisma.addon.findMany({
    where: { id: { in: addonIds } }
  })

  const addonsTotal = addons.reduce((sum, addon) => {
    const multiplier = addon.applicationType === 'PER_PERSON' ? numberOfPeople : 1
    return sum + (Number(addon.price) * multiplier)
  }, 0)

  subtotal += addonsTotal

  // 4. Calcular IVA
  const taxAmount = subtotal * 0.21
  const total = subtotal + taxAmount

  // 5. Crear Order
  const order = await prisma.order.create({
    data: {
      orderNumber: generateOrderNumber(),
      customerId,
      guestEmail,
      guestName,
      isServicePurchase: true,
      subtotal,
      taxAmount,
      total,
      status: 'PENDING',
      items: {
        create: {
          itemType: variantId ? 'service_variant' : 'package',
          serviceId,
          variantId,
          packageId,
          name: serviceName,
          quantity: 1,
          unitPrice: subtotal - addonsTotal,
          totalPrice: subtotal - addonsTotal,
          preferredDate: new Date(preferredDate),
          preferredTime
        }
      },
      addons: {
        create: addons.map(addon => ({
          addonId: addon.id,
          name: addon.name,
          quantity: addon.applicationType === 'PER_PERSON' ? numberOfPeople : 1,
          unitPrice: Number(addon.price),
          totalPrice: Number(addon.price) * (addon.applicationType === 'PER_PERSON' ? numberOfPeople : 1)
        }))
      },
      bookings: {
        create: {
          bookingNumber: generateBookingNumber(),
          customerId,
          serviceId,
          variantId,
          packageId,
          serviceName,
          duration,
          bookingDate: new Date(preferredDate),
          startTime: preferredTime,
          endTime: calculateEndTime(preferredTime, duration),
          numberOfPeople,
          status: 'PENDING' // Se confirmará tras pago
        }
      }
    },
    include: {
      items: true,
      addons: true,
      bookings: true
    }
  })

  // 6. Crear Checkout Session
  const customer = customerId ? await prisma.customer.findUnique({ where: { id: customerId } }) : null

  const session = await monei.checkoutSession.create({
    amount: Math.round(total * 100),
    currency: 'EUR',
    orderId: order.orderNumber,
    customer: {
      email: customer?.email || guestEmail,
      name: customer ? `${customer.firstName} ${customer.lastName}` : guestName
    },
    successUrl: `${process.env.NEXT_PUBLIC_URL}/checkout/success?session_id={checkout_session_id}`,
    cancelUrl: `${process.env.NEXT_PUBLIC_URL}/checkout/cancel?order=${order.id}`,
    callbackUrl: `${process.env.NEXT_PUBLIC_URL}/api/webhooks/monei`,
    metadata: {
      orderId: order.id,
      orderType: 'booking',
      bookingDate: preferredDate,
      bookingTime: preferredTime
    }
  })

  // 7. Guardar Payment
  await prisma.payment.create({
    data: {
      orderId: order.id,
      paymentId: session.id,
      sessionId: session.id,
      amount: total,
      status: 'PENDING',
      successUrl: session.successUrl,
      cancelUrl: session.cancelUrl
    }
  })

  return Response.json({
    checkoutUrl: session.url,
    sessionId: session.id,
    orderId: order.id,
    booking: order.bookings[0]
  })
}

async function checkAvailability(id: string, date: string, time: string): Promise<boolean> {
  // TODO: Implementar lógica de disponibilidad
  // - Verificar conflictos en DB
  // - Comprobar horario de apertura
  // - Validar capacidad máxima
  return true
}

function calculateEndTime(startTime: string, durationMinutes: number): string {
  const [hours, minutes] = startTime.split(':').map(Number)
  const totalMinutes = hours * 60 + minutes + durationMinutes
  const endHours = Math.floor(totalMinutes / 60)
  const endMinutes = totalMinutes % 60
  return `${endHours.toString().padStart(2, '0')}:${endMinutes.toString().padStart(2, '0')}`
}

function generateBookingNumber(): string {
  const year = new Date().getFullYear()
  const random = Math.floor(Math.random() * 100000).toString().padStart(5, '0')
  return `BKG-${year}-${random}`
}
```

---

### 3. Webhook Handler (Ya incluido en ARCHITECTURE.md)

Ver `app/api/webhooks/monei/route.ts` en ARCHITECTURE.md

---

## Estados y Transiciones

### Flujo de Estados de Order

```
PENDING → PAYMENT_PROCESSING → PAYMENT_CONFIRMED → COMPLETED
   ↓                                    ↓
CANCELLED                           REFUNDED
   ↓
EXPIRED (cron job tras 24h sin pago)
```

### Flujo de Estados de Payment

```
PENDING → PROCESSING → SUCCEEDED
   ↓                        ↓
FAILED               PARTIALLY_REFUNDED
                             ↓
                        REFUNDED
```

### Flujo de Estados de Booking

```
PENDING → CONFIRMED → IN_PROGRESS → COMPLETED
   ↓          ↓
CANCELLED  NO_SHOW
```

### Flujo de Estados de Voucher

```
ACTIVE → PARTIALLY_USED → FULLY_REDEEMED
   ↓            ↓
EXPIRED      EXPIRED
   ↓
REFUNDED / CANCELLED
```

---

## Testing con MONEI

### Tarjetas de Prueba

```javascript
// app/tests/monei.test.ts

// Tarjeta de éxito
const CARD_SUCCESS = {
  number: '4242 4242 4242 4242',
  expiry: '12/30',
  cvc: '123'
}

// Tarjeta que requiere autenticación 3DS
const CARD_3DS = {
  number: '4000 0027 6000 3184',
  expiry: '12/30',
  cvc: '123'
}

// Tarjeta rechazada (fondos insuficientes)
const CARD_DECLINED = {
  number: '4000 0000 0000 9995',
  expiry: '12/30',
  cvc: '123'
}

// Tarjeta que falla
const CARD_FAIL = {
  number: '4000 0000 0000 0002',
  expiry: '12/30',
  cvc: '123'
}
```

### Test de Webhooks localmente

```bash
# Instalar MONEI CLI (si existe) o usar ngrok
ngrok http 3000

# Configurar webhook en MONEI Dashboard
# Endpoint: https://xxxx.ngrok.io/api/webhooks/monei

# Simular evento (con curl)
curl -X POST https://localhost:3000/api/webhooks/monei \
  -H "Content-Type: application/json" \
  -H "monei-signature: xxxx" \
  -d @test-event.json
```

### Test End-to-End

```typescript
// app/tests/e2e/checkout.test.ts
import { test, expect } from '@playwright/test'

test('compra de voucher completa', async ({ page }) => {
  // 1. Ir a catálogo
  await page.goto('http://localhost:3000/vouchers')

  // 2. Seleccionar bono 3+1
  await page.click('[data-voucher="bono-3-plus-1"]')

  // 3. Añadir a carrito
  await page.click('button:has-text("Comprar")')

  // 4. Checkout
  await page.fill('input[name="email"]', 'test@example.com')
  await page.click('button:has-text("Pagar")')

  // 5. Esperar redirect a MONEI
  await page.waitForURL(/monei.com\/checkout/)

  // 6. Rellenar formulario de MONEI
  await page.fill('input[name="cardNumber"]', '4242424242424242')
  await page.fill('input[name="expiryDate"]', '1230')
  await page.fill('input[name="cvv"]', '123')
  await page.click('button[type="submit"]')

  // 7. Verificar redirect a success
  await page.waitForURL(/checkout\/success/)
  await expect(page.locator('h1')).toContainText('¡Pago exitoso!')

  // 8. Verificar código de voucher visible
  await expect(page.locator('[data-voucher-code]')).toBeVisible()
})
```

---

## Seguridad

### Verificación de Firma de Webhook

```typescript
// lib/monei-webhook-verify.ts
import crypto from 'crypto'

export function verifyWebhookSignature(
  payload: string,
  signature: string,
  secret: string
): boolean {
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex')

  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  )
}

// Uso en webhook handler
export async function POST(req: Request) {
  const body = await req.text()
  const signature = req.headers.get('monei-signature')

  if (!signature) {
    return new Response('No signature', { status: 401 })
  }

  const isValid = verifyWebhookSignature(
    body,
    signature,
    process.env.MONEI_WEBHOOK_SECRET!
  )

  if (!isValid) {
    return new Response('Invalid signature', { status: 401 })
  }

  // Procesar evento...
}
```

### Rate Limiting en Webhooks

```typescript
// lib/rate-limit.ts
import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!
})

export const webhookRatelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(100, '1 m'), // 100 req/min
  analytics: true
})

// Uso en webhook
const identifier = req.headers.get('x-forwarded-for') || 'anonymous'
const { success } = await webhookRatelimit.limit(identifier)

if (!success) {
  return new Response('Rate limit exceeded', { status: 429 })
}
```

---

## Monitorización y Logs

### Logging de Eventos

```typescript
// lib/logger.ts
import pino from 'pino'

export const logger = pino({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  transport: process.env.NODE_ENV === 'development' ? {
    target: 'pino-pretty',
    options: { colorize: true }
  } : undefined
})

// Uso en webhook
logger.info({
  eventId: event.id,
  eventType: event.type,
  orderId: order.id,
  amount: payment.amount
}, 'Payment succeeded')
```

### Dashboard de MONEI

Configurar webhooks en: https://dashboard.monei.com/webhooks

Eventos a suscribir:
- ✅ `checkout.session.completed`
- ✅ `payment_intent.succeeded`
- ✅ `payment_intent.failed`
- ✅ `charge.refunded`
- ✅ `charge.partially_refunded`

---

## Troubleshooting

### Error: "Webhook signature verification failed"

**Causa**: Secret incorrecto o formato de firma inválido

**Solución**:
```bash
# Verificar secret en .env
MONEI_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxx

# Logs en webhook
console.log('Received signature:', signature)
console.log('Expected secret:', process.env.MONEI_WEBHOOK_SECRET)
```

### Error: "Payment already processed"

**Causa**: Webhook duplicado (MONEI reintenta si no recibe 200)

**Solución**: Ya implementada con `MoneiEvent.eventId` único

### Error: "Order not found in webhook"

**Causa**: Race condition - webhook llega antes de guardar Order

**Solución**:
```typescript
// Esperar un poco y reintentar
let order = await prisma.order.findUnique({ where: { id: orderId } })

if (!order) {
  await new Promise(resolve => setTimeout(resolve, 2000)) // 2s
  order = await prisma.order.findUnique({ where: { id: orderId } })
}

if (!order) {
  throw new Error('Order still not found')
}
```

---

## Próximos Pasos

1. **Configurar cuenta MONEI**: https://dashboard.monei.com
2. **Obtener API keys**: Test y Production
3. **Configurar webhooks**: Apuntar a tu endpoint
4. **Migrar DB**: `npx prisma migrate dev`
5. **Ejecutar seed**: `npx prisma db seed`
6. **Probar checkout**: Usar tarjeta de prueba
7. **Verificar webhook**: Revisar logs en MONEI Dashboard
8. **Producción**: Cambiar a `pk_live_` y configurar dominio real

