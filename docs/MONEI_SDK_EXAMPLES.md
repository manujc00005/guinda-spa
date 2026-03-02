# MONEI SDK - Ejemplos Reales de Integración

**Documentación oficial**: https://docs.monei.com/
**SDK Node.js**: https://www.npmjs.com/package/@monei-js/node-sdk
**GitHub**: https://github.com/MONEI/monei-node-sdk

---

## Instalación

```bash
npm install @monei-js/node-sdk
```

---

## Configuración Básica

```typescript
// lib/monei.ts
import Monei from '@monei-js/node-sdk'

if (!process.env.MONEI_API_KEY) {
  throw new Error('MONEI_API_KEY is required')
}

export const monei = new Monei(process.env.MONEI_API_KEY)
```

---

## 1. Crear Pago (Payment)

```typescript
// app/api/checkout/create/route.ts
import { monei } from '@/lib/monei'
import { NextRequest } from 'next/server'

export async function POST(req: NextRequest) {
  const { amount, orderId, customerEmail, customerName } = await req.json()

  try {
    const payment = await monei.payments.create({
      amount: Math.round(amount * 100), // Convertir a céntimos
      currency: 'EUR',
      orderId: orderId,
      description: `Guinda SPA - Order #${orderId}`,
      customer: {
        email: customerEmail,
        name: customerName
      },
      callbackUrl: `${process.env.NEXT_PUBLIC_URL}/api/webhooks/monei`,
      completeUrl: `${process.env.NEXT_PUBLIC_URL}/checkout/success`,
      cancelUrl: `${process.env.NEXT_PUBLIC_URL}/checkout/cancel`
    })

    // El payment incluye nextAction con redirectUrl
    return Response.json({
      paymentId: payment.id,
      redirectUrl: payment.nextAction?.redirectUrl,
      status: payment.status
    })

  } catch (error) {
    console.error('MONEI create payment error:', error)
    return Response.json(
      { error: 'Error creating payment' },
      { status: 500 }
    )
  }
}
```

---

## 2. Webhook Handler (Callback)

```typescript
// app/api/webhooks/monei/route.ts
import { monei } from '@/lib/monei'
import { prisma } from '@/lib/prisma'
import { headers } from 'next/headers'

export async function POST(req: Request) {
  const body = await req.text()
  const signature = headers().get('monei-signature')

  if (!signature) {
    return new Response('No signature', { status: 401 })
  }

  try {
    // Verificar firma y parsear payment
    const payment = monei.verifySignature(body, signature)

    // Buscar orden asociada
    const order = await prisma.order.findFirst({
      where: { orderNumber: payment.orderId }
    })

    if (!order) {
      console.error('Order not found:', payment.orderId)
      return new Response('Order not found', { status: 404 })
    }

    // Actualizar según estado del payment
    if (payment.status === 'SUCCEEDED') {
      await handlePaymentSuccess(payment, order)
    } else if (payment.status === 'FAILED') {
      await handlePaymentFailed(payment, order)
    }

    return new Response('OK', { status: 200 })

  } catch (error) {
    console.error('Webhook verification failed:', error)
    return new Response('Invalid signature', { status: 401 })
  }
}

async function handlePaymentSuccess(payment: any, order: any) {
  await prisma.$transaction(async (tx) => {
    // Actualizar Payment
    await tx.payment.update({
      where: { paymentId: payment.id },
      data: {
        status: 'SUCCEEDED',
        confirmedAt: new Date(),
        paymentMethod: payment.paymentMethod?.method,
        metadata: payment
      }
    })

    // Actualizar Order
    await tx.order.update({
      where: { id: order.id },
      data: {
        status: 'PAYMENT_CONFIRMED',
        completedAt: new Date()
      }
    })

    // Si es compra de voucher, generar códigos
    if (order.isVoucherPurchase) {
      await generateVouchers(tx, order)
    }

    // Si es reserva, confirmar booking
    if (order.isServicePurchase) {
      await tx.booking.updateMany({
        where: { orderId: order.id },
        data: {
          status: 'CONFIRMED',
          confirmedAt: new Date()
        }
      })
    }
  })

  // TODO: Enviar emails de confirmación
  console.log('Payment succeeded for order:', order.orderNumber)
}

async function handlePaymentFailed(payment: any, order: any) {
  await prisma.$transaction(async (tx) => {
    await tx.payment.update({
      where: { paymentId: payment.id },
      data: {
        status: 'FAILED',
        failedAt: new Date()
      }
    })

    await tx.order.update({
      where: { id: order.id },
      data: { status: 'CANCELLED' }
    })
  })

  console.log('Payment failed for order:', order.orderNumber)
}

async function generateVouchers(tx: any, order: any) {
  const items = await tx.orderItem.findMany({
    where: {
      orderId: order.id,
      itemType: 'voucher'
    },
    include: {
      voucherTemplate: true
    }
  })

  for (const item of items) {
    for (let i = 0; i < item.quantity; i++) {
      const template = item.voucherTemplate
      const expiresAt = new Date()
      expiresAt.setDate(expiresAt.getDate() + template.validityDays)

      await tx.voucher.create({
        data: {
          code: generateVoucherCode(),
          templateId: template.id,
          purchasedById: order.customerId,
          recipientId: order.customerId,
          orderId: order.id,
          status: 'ACTIVE',
          sessionsRemaining: template.sessionsIncluded,
          expiresAt
        }
      })
    }
  }
}

function generateVoucherCode(): string {
  const part1 = Math.random().toString(36).substring(2, 6).toUpperCase()
  const part2 = Math.random().toString(36).substring(2, 6).toUpperCase()
  return `GUINDA-${part1}-${part2}`
}
```

---

## 3. Verificar Estado de Pago

```typescript
// app/api/payments/[paymentId]/status/route.ts
import { monei } from '@/lib/monei'

export async function GET(
  req: Request,
  { params }: { params: { paymentId: string } }
) {
  try {
    const payment = await monei.payments.get(params.paymentId)

    return Response.json({
      id: payment.id,
      status: payment.status,
      amount: payment.amount,
      orderId: payment.orderId,
      paymentMethod: payment.paymentMethod
    })

  } catch (error) {
    return Response.json(
      { error: 'Payment not found' },
      { status: 404 }
    )
  }
}
```

---

## 4. Crear Reembolso

```typescript
// app/api/admin/refunds/route.ts
import { monei } from '@/lib/monei'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
  const { paymentId, amount, reason } = await req.json()

  try {
    // Buscar payment en DB
    const payment = await prisma.payment.findUnique({
      where: { paymentId },
      include: { order: true }
    })

    if (!payment) {
      return Response.json({ error: 'Payment not found' }, { status: 404 })
    }

    // Crear refund en MONEI
    const refund = await monei.payments.refund(paymentId, {
      amount: amount ? Math.round(amount * 100) : undefined, // Si no se especifica, reembolso total
      refundReason: reason
    })

    // Actualizar DB
    await prisma.$transaction(async (tx) => {
      const isFullRefund = !amount || amount >= Number(payment.amount)

      await tx.payment.update({
        where: { id: payment.id },
        data: {
          status: isFullRefund ? 'REFUNDED' : 'PARTIALLY_REFUNDED',
          refundedAmount: { increment: amount || Number(payment.amount) },
          refundedAt: new Date()
        }
      })

      await tx.order.update({
        where: { id: payment.orderId },
        data: {
          status: isFullRefund ? 'REFUNDED' : 'PAYMENT_CONFIRMED'
        }
      })

      // Si había vouchers, marcarlos como REFUNDED
      if (isFullRefund) {
        await tx.voucher.updateMany({
          where: {
            orderId: payment.orderId,
            status: { in: ['ACTIVE', 'PARTIALLY_USED'] }
          },
          data: { status: 'REFUNDED' }
        })
      }
    })

    return Response.json({
      success: true,
      refund
    })

  } catch (error) {
    console.error('Refund error:', error)
    return Response.json(
      { error: 'Error processing refund' },
      { status: 500 }
    )
  }
}
```

---

## 5. Listar Pagos

```typescript
// app/api/admin/payments/route.ts
import { monei } from '@/lib/monei'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const limit = parseInt(searchParams.get('limit') || '10')
  const startingAfter = searchParams.get('startingAfter')

  try {
    const payments = await monei.payments.list({
      limit,
      ...(startingAfter && { startingAfter })
    })

    return Response.json(payments)

  } catch (error) {
    return Response.json(
      { error: 'Error listing payments' },
      { status: 500 }
    )
  }
}
```

---

## Estados de Payment en MONEI

```typescript
enum PaymentStatus {
  PENDING = 'PENDING',
  AUTHORIZED = 'AUTHORIZED',
  SUCCEEDED = 'SUCCEEDED',
  FAILED = 'FAILED',
  CANCELED = 'CANCELED',
  EXPIRED = 'EXPIRED'
}
```

### Mapeo a tu DB

```typescript
// Mapeo de estados MONEI → OrderStatus
const statusMap = {
  PENDING: 'PAYMENT_PROCESSING',
  AUTHORIZED: 'PAYMENT_PROCESSING',
  SUCCEEDED: 'PAYMENT_CONFIRMED',
  FAILED: 'CANCELLED',
  CANCELED: 'CANCELLED',
  EXPIRED: 'EXPIRED'
}
```

---

## Testing con Tarjetas de Prueba

```typescript
// Test mode - Tarjetas que funcionan
const TEST_CARDS = {
  success: {
    number: '4242 4242 4242 4242',
    expiry: '12/30',
    cvv: '123'
  },
  requires3DS: {
    number: '4000 0027 6000 3184',
    expiry: '12/30',
    cvv: '123'
  },
  declined: {
    number: '4000 0000 0000 9995',
    expiry: '12/30',
    cvv: '123'
  }
}
```

---

## Configuración de Webhooks en MONEI Dashboard

1. Ir a https://dashboard.monei.com/settings/webhooks
2. Añadir endpoint: `https://tu-dominio.com/api/webhooks/monei`
3. Copiar **Signing Secret** a `.env`:
   ```
   MONEI_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxx
   ```

---

## Ejemplo Completo: Flujo de Compra de Voucher

```typescript
// app/api/checkout/voucher/route.ts
import { monei } from '@/lib/monei'
import { prisma } from '@/lib/prisma'
import { NextRequest } from 'next/server'

export async function POST(req: NextRequest) {
  const { voucherTemplateId, quantity, customerId } = await req.json()

  // 1. Obtener template
  const template = await prisma.voucherTemplate.findUnique({
    where: { id: voucherTemplateId }
  })

  if (!template?.isActive) {
    return Response.json({ error: 'Invalid template' }, { status: 400 })
  }

  // 2. Obtener customer
  const customer = await prisma.customer.findUnique({
    where: { id: customerId }
  })

  if (!customer) {
    return Response.json({ error: 'Customer not found' }, { status: 404 })
  }

  // 3. Calcular totales
  const subtotal = Number(template.price) * quantity
  const taxAmount = subtotal * 0.21
  const total = subtotal + taxAmount

  // 4. Crear Order
  const order = await prisma.order.create({
    data: {
      orderNumber: `GND-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
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

  // 5. Crear Payment en MONEI
  try {
    const payment = await monei.payments.create({
      amount: Math.round(total * 100),
      currency: 'EUR',
      orderId: order.orderNumber,
      description: `Guinda SPA - ${template.name} x${quantity}`,
      customer: {
        email: customer.email,
        name: `${customer.firstName} ${customer.lastName}`
      },
      callbackUrl: `${process.env.NEXT_PUBLIC_URL}/api/webhooks/monei`,
      completeUrl: `${process.env.NEXT_PUBLIC_URL}/checkout/success?order=${order.id}`,
      cancelUrl: `${process.env.NEXT_PUBLIC_URL}/checkout/cancel?order=${order.id}`
    })

    // 6. Guardar Payment en DB
    await prisma.payment.create({
      data: {
        orderId: order.id,
        paymentId: payment.id,
        amount: total,
        currency: 'EUR',
        status: 'PENDING',
        successUrl: payment.completeUrl,
        cancelUrl: payment.cancelUrl
      }
    })

    // 7. Retornar URL de pago
    return Response.json({
      checkoutUrl: payment.nextAction?.redirectUrl,
      paymentId: payment.id,
      orderId: order.id
    })

  } catch (error) {
    // Marcar orden como cancelada
    await prisma.order.update({
      where: { id: order.id },
      data: { status: 'CANCELLED' }
    })

    console.error('MONEI error:', error)
    return Response.json(
      { error: 'Error creating payment' },
      { status: 500 }
    )
  }
}
```

---

## Referencias

- **Build Custom Checkout**: https://docs.monei.com/integrations/build-custom-checkout/
- **Use Payment Modal**: https://docs.monei.com/integrations/use-payment-modal/
- **REST API Reference**: https://docs.monei.com/apis/rest/
- **Webhooks**: https://docs.monei.com/guides/webhooks/

---

**Última actualización**: Enero 2026
