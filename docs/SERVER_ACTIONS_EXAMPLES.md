# Server Actions - Ejemplos de Uso

## Setup

Las Server Actions en Next.js 15 permiten ejecutar código del servidor directamente desde componentes cliente o servidor.

## Estructura recomendada

```
app/
├── actions/
│   ├── voucher.actions.ts
│   ├── booking.actions.ts
│   ├── catalog.actions.ts
│   └── admin.actions.ts
```

---

## 1. Validar y Aplicar Voucher

```typescript
// app/actions/voucher.actions.ts
'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function validateVoucher(code: string) {
  const voucher = await prisma.voucher.findUnique({
    where: { code },
    include: {
      template: {
        include: {
          restrictedToCategory: true,
          restrictedToService: true,
          restrictedToPackage: true
        }
      }
    }
  })

  if (!voucher) {
    return {
      success: false,
      error: 'Código de bono no válido'
    }
  }

  if (voucher.status === 'EXPIRED') {
    return {
      success: false,
      error: 'Este bono ha expirado'
    }
  }

  if (voucher.status === 'FULLY_REDEEMED') {
    return {
      success: false,
      error: 'Este bono ya ha sido usado completamente'
    }
  }

  if (voucher.status === 'REFUNDED' || voucher.status === 'CANCELLED') {
    return {
      success: false,
      error: 'Este bono no es válido'
    }
  }

  if (voucher.expiresAt < new Date()) {
    await prisma.voucher.update({
      where: { id: voucher.id },
      data: { status: 'EXPIRED' }
    })
    return {
      success: false,
      error: 'Este bono ha expirado'
    }
  }

  if (voucher.sessionsRemaining < 1) {
    return {
      success: false,
      error: 'No quedan sesiones disponibles en este bono'
    }
  }

  return {
    success: true,
    voucher: {
      id: voucher.id,
      code: voucher.code,
      sessionsRemaining: voucher.sessionsRemaining,
      expiresAt: voucher.expiresAt,
      template: {
        name: voucher.template.name,
        restrictionType: voucher.template.restrictionType,
        restrictedToCategory: voucher.template.restrictedToCategory,
        restrictedToService: voucher.template.restrictedToService,
        restrictedToPackage: voucher.template.restrictedToPackage
      }
    }
  }
}

export async function redeemVoucher(
  voucherCode: string,
  bookingId: string,
  valueApplied: number
) {
  'use server'

  try {
    const result = await prisma.$transaction(async (tx) => {
      // 1. Re-verificar disponibilidad (dentro de transacción)
      const voucher = await tx.voucher.findUnique({
        where: { code: voucherCode }
      })

      if (!voucher || voucher.sessionsRemaining < 1) {
        throw new Error('Voucher no disponible')
      }

      // 2. Crear redención
      const redemption = await tx.voucherRedemption.create({
        data: {
          voucherId: voucher.id,
          bookingId,
          valueApplied,
          sessionsUsed: 1,
          redeemedAt: new Date()
        }
      })

      // 3. Actualizar voucher
      const newSessionsRemaining = voucher.sessionsRemaining - 1
      const updatedVoucher = await tx.voucher.update({
        where: { id: voucher.id },
        data: {
          sessionsRemaining: newSessionsRemaining,
          status: newSessionsRemaining === 0 ? 'FULLY_REDEEMED' :
                  voucher.status === 'ACTIVE' ? 'PARTIALLY_USED' : voucher.status,
          firstUsedAt: voucher.firstUsedAt || new Date(),
          fullyRedeemedAt: newSessionsRemaining === 0 ? new Date() : null
        }
      })

      return { redemption, voucher: updatedVoucher }
    })

    revalidatePath('/profile/vouchers')
    revalidatePath('/bookings')

    return {
      success: true,
      data: result
    }

  } catch (error) {
    console.error('Redeem voucher error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error al canjear bono'
    }
  }
}

export async function getCustomerVouchers(customerId: string) {
  'use server'

  const vouchers = await prisma.voucher.findMany({
    where: {
      OR: [
        { purchasedById: customerId },
        { recipientId: customerId }
      ],
      status: {
        in: ['ACTIVE', 'PARTIALLY_USED']
      }
    },
    include: {
      template: {
        select: {
          name: true,
          description: true,
          restrictionType: true
        }
      },
      redemptions: {
        include: {
          booking: {
            select: {
              bookingNumber: true,
              serviceName: true,
              bookingDate: true
            }
          }
        }
      }
    },
    orderBy: {
      expiresAt: 'asc'
    }
  })

  return vouchers
}
```

---

## 2. Crear Booking con Voucher

```typescript
// app/actions/booking.actions.ts
'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function createBookingWithVoucher(data: {
  customerId: string
  voucherCode: string
  variantId?: string
  packageId?: string
  preferredDate: string
  preferredTime: string
  customerNotes?: string
}) {
  try {
    // 1. Validar voucher
    const voucher = await prisma.voucher.findUnique({
      where: { code: data.voucherCode },
      include: { template: true }
    })

    if (!voucher || voucher.status !== 'ACTIVE' && voucher.status !== 'PARTIALLY_USED') {
      return {
        success: false,
        error: 'Voucher inválido o no disponible'
      }
    }

    if (voucher.sessionsRemaining < 1) {
      return {
        success: false,
        error: 'No quedan sesiones en este bono'
      }
    }

    if (voucher.expiresAt < new Date()) {
      return {
        success: false,
        error: 'El bono ha expirado'
      }
    }

    // 2. Obtener servicio/paquete
    let serviceName = ''
    let duration = 0
    let serviceId: string | undefined
    let variantId: string | undefined
    let packageId: string | undefined

    if (data.variantId) {
      const variant = await prisma.serviceVariant.findUnique({
        where: { id: data.variantId },
        include: { service: true }
      })

      if (!variant) {
        return { success: false, error: 'Servicio no encontrado' }
      }

      // Validar restricciones del voucher
      if (voucher.template.restrictionType === 'CATEGORY') {
        if (variant.service.categoryId !== voucher.template.restrictedToCategoryId) {
          return {
            success: false,
            error: 'Este bono no aplica a esta categoría de servicio'
          }
        }
      }

      if (voucher.template.restrictionType === 'SERVICE') {
        if (variant.serviceId !== voucher.template.restrictedToServiceId) {
          return {
            success: false,
            error: 'Este bono no aplica a este servicio'
          }
        }
      }

      serviceName = `${variant.service.name} - ${variant.name}`
      duration = variant.duration || 0
      serviceId = variant.serviceId
      variantId = variant.id

    } else if (data.packageId) {
      const pkg = await prisma.package.findUnique({
        where: { id: data.packageId }
      })

      if (!pkg) {
        return { success: false, error: 'Paquete no encontrado' }
      }

      if (voucher.template.restrictionType === 'PACKAGE') {
        if (pkg.id !== voucher.template.restrictedToPackageId) {
          return {
            success: false,
            error: 'Este bono no aplica a este paquete'
          }
        }
      }

      serviceName = pkg.name
      duration = pkg.totalDuration || 0
      packageId = pkg.id
    }

    // 3. Verificar disponibilidad
    const isAvailable = await checkAvailability(
      serviceId || packageId!,
      data.preferredDate,
      data.preferredTime,
      duration
    )

    if (!isAvailable) {
      return {
        success: false,
        error: 'El horario seleccionado no está disponible'
      }
    }

    // 4. Crear booking y redención en transacción
    const result = await prisma.$transaction(async (tx) => {
      // Crear booking
      const booking = await tx.booking.create({
        data: {
          bookingNumber: generateBookingNumber(),
          customerId: data.customerId,
          serviceId,
          variantId,
          packageId,
          serviceName,
          duration,
          bookingDate: new Date(data.preferredDate),
          startTime: data.preferredTime,
          endTime: calculateEndTime(data.preferredTime, duration),
          numberOfPeople: 1,
          status: 'CONFIRMED',
          confirmedAt: new Date(),
          customerNotes: data.customerNotes
        }
      })

      // Crear redención
      await tx.voucherRedemption.create({
        data: {
          voucherId: voucher.id,
          bookingId: booking.id,
          valueApplied: voucher.template.sessionValue || 0,
          sessionsUsed: 1
        }
      })

      // Actualizar voucher
      const newSessionsRemaining = voucher.sessionsRemaining - 1
      await tx.voucher.update({
        where: { id: voucher.id },
        data: {
          sessionsRemaining: newSessionsRemaining,
          status: newSessionsRemaining === 0 ? 'FULLY_REDEEMED' : 'PARTIALLY_USED',
          firstUsedAt: voucher.firstUsedAt || new Date(),
          fullyRedeemedAt: newSessionsRemaining === 0 ? new Date() : null
        }
      })

      return booking
    })

    revalidatePath('/bookings')
    revalidatePath('/profile/vouchers')

    return {
      success: true,
      booking: result
    }

  } catch (error) {
    console.error('Create booking error:', error)
    return {
      success: false,
      error: 'Error al crear la reserva'
    }
  }
}

async function checkAvailability(
  id: string,
  date: string,
  time: string,
  duration: number
): Promise<boolean> {
  // TODO: Implementar lógica real
  // - Verificar conflictos con otras reservas
  // - Validar horarios de apertura
  // - Comprobar capacidad

  const bookingDate = new Date(date)
  const [hours, minutes] = time.split(':').map(Number)

  // Ejemplo: no permitir reservas en el pasado
  const bookingDateTime = new Date(bookingDate)
  bookingDateTime.setHours(hours, minutes, 0, 0)

  if (bookingDateTime < new Date()) {
    return false
  }

  // Verificar conflictos
  const endTime = calculateEndTime(time, duration)
  const conflicts = await prisma.booking.count({
    where: {
      bookingDate,
      status: {
        in: ['PENDING', 'CONFIRMED', 'IN_PROGRESS']
      },
      OR: [
        {
          AND: [
            { startTime: { lte: time } },
            { endTime: { gt: time } }
          ]
        },
        {
          AND: [
            { startTime: { lt: endTime } },
            { endTime: { gte: endTime } }
          ]
        }
      ]
    }
  })

  return conflicts === 0
}

function calculateEndTime(startTime: string, durationMinutes: number): string {
  const [hours, minutes] = startTime.split(':').map(Number)
  const totalMinutes = hours * 60 + minutes + durationMinutes
  const endHours = Math.floor(totalMinutes / 60) % 24
  const endMinutes = totalMinutes % 60
  return `${endHours.toString().padStart(2, '0')}:${endMinutes.toString().padStart(2, '0')}`
}

function generateBookingNumber(): string {
  const year = new Date().getFullYear()
  const random = Math.floor(Math.random() * 100000).toString().padStart(5, '0')
  return `BKG-${year}-${random}`
}

export async function cancelBooking(bookingId: string, customerId: string) {
  'use server'

  try {
    const booking = await prisma.booking.findFirst({
      where: {
        id: bookingId,
        customerId,
        status: { in: ['PENDING', 'CONFIRMED'] }
      },
      include: {
        voucherRedemptions: true
      }
    })

    if (!booking) {
      return {
        success: false,
        error: 'Reserva no encontrada o no se puede cancelar'
      }
    }

    // Si tiene voucher aplicado, restaurar sesión
    await prisma.$transaction(async (tx) => {
      await tx.booking.update({
        where: { id: bookingId },
        data: {
          status: 'CANCELLED',
          cancelledAt: new Date()
        }
      })

      // Restaurar sesiones de voucher si aplica
      for (const redemption of booking.voucherRedemptions) {
        const voucher = await tx.voucher.findUnique({
          where: { id: redemption.voucherId }
        })

        if (voucher && voucher.status !== 'EXPIRED') {
          await tx.voucher.update({
            where: { id: voucher.id },
            data: {
              sessionsRemaining: { increment: redemption.sessionsUsed },
              status: 'ACTIVE'
            }
          })

          // Eliminar redención
          await tx.voucherRedemption.delete({
            where: { id: redemption.id }
          })
        }
      }
    })

    revalidatePath('/bookings')
    revalidatePath('/profile/vouchers')

    return {
      success: true,
      message: 'Reserva cancelada correctamente'
    }

  } catch (error) {
    console.error('Cancel booking error:', error)
    return {
      success: false,
      error: 'Error al cancelar la reserva'
    }
  }
}
```

---

## 3. Admin Actions

```typescript
// app/actions/admin.actions.ts
'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function updateServicePrice(
  serviceId: string,
  newPrice: number
) {
  'use server'

  try {
    await prisma.service.update({
      where: { id: serviceId },
      data: { basePrice: newPrice }
    })

    // Revalidar todas las páginas del catálogo
    revalidatePath('/services')
    revalidatePath('/') // Home con servicios destacados

    return {
      success: true,
      message: 'Precio actualizado correctamente'
    }
  } catch (error) {
    return {
      success: false,
      error: 'Error al actualizar precio'
    }
  }
}

export async function updateVariantPrice(
  variantId: string,
  newPrice: number
) {
  'use server'

  try {
    const variant = await prisma.serviceVariant.update({
      where: { id: variantId },
      data: { price: newPrice },
      include: { service: true }
    })

    revalidatePath(`/services/${variant.service.slug}`)
    revalidatePath('/services')

    return {
      success: true,
      message: 'Precio de variante actualizado'
    }
  } catch (error) {
    return {
      success: false,
      error: 'Error al actualizar precio'
    }
  }
}

export async function toggleServiceActive(
  serviceId: string,
  isActive: boolean
) {
  'use server'

  try {
    await prisma.service.update({
      where: { id: serviceId },
      data: { isActive }
    })

    revalidatePath('/services')
    revalidatePath('/admin/services')

    return {
      success: true,
      message: `Servicio ${isActive ? 'activado' : 'desactivado'}`
    }
  } catch (error) {
    return {
      success: false,
      error: 'Error al cambiar estado'
    }
  }
}

export async function getBookingsByDate(date: string) {
  'use server'

  const bookings = await prisma.booking.findMany({
    where: {
      bookingDate: new Date(date),
      status: {
        in: ['PENDING', 'CONFIRMED', 'IN_PROGRESS']
      }
    },
    include: {
      customer: {
        select: {
          firstName: true,
          lastName: true,
          email: true,
          phone: true
        }
      },
      service: {
        select: {
          name: true
        }
      },
      package: {
        select: {
          name: true
        }
      }
    },
    orderBy: {
      startTime: 'asc'
    }
  })

  return bookings
}

export async function completeBooking(bookingId: string) {
  'use server'

  try {
    const booking = await prisma.booking.update({
      where: { id: bookingId },
      data: {
        status: 'COMPLETED',
        completedAt: new Date()
      }
    })

    // Marcar orden asociada como completada si existe
    if (booking.orderId) {
      await prisma.order.update({
        where: { id: booking.orderId },
        data: {
          status: 'COMPLETED',
          completedAt: new Date()
        }
      })
    }

    revalidatePath('/admin/bookings')

    return {
      success: true,
      message: 'Reserva marcada como completada'
    }
  } catch (error) {
    return {
      success: false,
      error: 'Error al completar reserva'
    }
  }
}
```

---

## 4. Uso en Componentes

### Componente de validación de voucher

```typescript
// app/components/voucher-validator.tsx
'use client'

import { useState } from 'react'
import { validateVoucher } from '@/app/actions/voucher.actions'

export function VoucherValidator({ onValidated }: { onValidated: (voucher: any) => void }) {
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleValidate() {
    setLoading(true)
    setError('')

    const result = await validateVoucher(code)

    setLoading(false)

    if (result.success) {
      onValidated(result.voucher)
    } else {
      setError(result.error || 'Error desconocido')
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="voucher-code" className="block text-sm font-medium">
          Código del bono
        </label>
        <input
          id="voucher-code"
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          placeholder="GUINDA-XXXX-XXXX"
          className="mt-1 block w-full rounded-md border px-3 py-2"
        />
      </div>

      {error && (
        <div className="text-sm text-red-600">{error}</div>
      )}

      <button
        onClick={handleValidate}
        disabled={loading || !code}
        className="w-full bg-primary text-white py-2 px-4 rounded disabled:opacity-50"
      >
        {loading ? 'Validando...' : 'Validar bono'}
      </button>
    </div>
  )
}
```

### Componente de cancelación de booking

```typescript
// app/components/booking-cancel-button.tsx
'use client'

import { useState } from 'react'
import { cancelBooking } from '@/app/actions/booking.actions'

export function BookingCancelButton({
  bookingId,
  customerId
}: {
  bookingId: string
  customerId: string
}) {
  const [loading, setLoading] = useState(false)

  async function handleCancel() {
    if (!confirm('¿Estás seguro de que quieres cancelar esta reserva?')) {
      return
    }

    setLoading(true)

    const result = await cancelBooking(bookingId, customerId)

    setLoading(false)

    if (result.success) {
      alert(result.message)
    } else {
      alert(result.error)
    }
  }

  return (
    <button
      onClick={handleCancel}
      disabled={loading}
      className="text-red-600 hover:text-red-800 disabled:opacity-50"
    >
      {loading ? 'Cancelando...' : 'Cancelar reserva'}
    </button>
  )
}
```

---

## Resumen

Las Server Actions proporcionan:

✅ Ejecución segura del lado del servidor
✅ Validación y lógica de negocio centralizada
✅ Transacciones atómicas con Prisma
✅ Revalidación automática de caché
✅ Manejo de errores consistente
✅ TypeScript end-to-end

Puedes llamarlas desde:
- Componentes cliente (con `'use client'`)
- Componentes servidor
- Route Handlers
- Middleware

