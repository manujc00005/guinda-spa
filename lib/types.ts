// Tipos útiles para el proyecto

import { Prisma } from '@prisma/client'

// ============================================================================
// SERVICE TYPES
// ============================================================================

export type ServiceWithVariants = Prisma.ServiceGetPayload<{
  include: {
    category: true
    variants: true
    addons: {
      include: {
        addon: true
      }
    }
  }
}>

export type ServiceVariantWithService = Prisma.ServiceVariantGetPayload<{
  include: {
    service: {
      include: {
        category: true
      }
    }
  }
}>

// ============================================================================
// PACKAGE TYPES
// ============================================================================

export type PackageWithItems = Prisma.PackageGetPayload<{
  include: {
    items: {
      include: {
        service: true
        variant: true
      }
    }
    addons: {
      include: {
        addon: true
      }
    }
  }
}>

// ============================================================================
// VOUCHER TYPES
// ============================================================================

export type VoucherWithTemplate = Prisma.VoucherGetPayload<{
  include: {
    template: {
      include: {
        restrictedToCategory: true
        restrictedToService: true
        restrictedToPackage: true
      }
    }
    purchasedBy: {
      select: {
        firstName: true
        lastName: true
        email: true
      }
    }
    recipient: {
      select: {
        firstName: true
        lastName: true
        email: true
      }
    }
    redemptions: {
      include: {
        booking: {
          select: {
            bookingNumber: true
            serviceName: true
            bookingDate: true
            startTime: true
          }
        }
      }
    }
  }
}>

export type VoucherRedemptionWithDetails = Prisma.VoucherRedemptionGetPayload<{
  include: {
    voucher: {
      include: {
        template: true
      }
    }
    booking: {
      include: {
        service: true
        package: true
      }
    }
    order: true
  }
}>

// ============================================================================
// ORDER TYPES
// ============================================================================

export type OrderWithDetails = Prisma.OrderGetPayload<{
  include: {
    customer: {
      select: {
        id: true
        email: true
        firstName: true
        lastName: true
        phone: true
      }
    }
    items: {
      include: {
        service: true
        variant: true
        package: true
        voucherTemplate: true
      }
    }
    addons: {
      include: {
        addon: true
      }
    }
    payments: true
    vouchers: true
    bookings: true
    voucherRedemptions: true
  }
}>

export type OrderItemWithDetails = Prisma.OrderItemGetPayload<{
  include: {
    service: true
    variant: true
    package: true
    voucherTemplate: true
  }
}>

// ============================================================================
// BOOKING TYPES
// ============================================================================

export type BookingWithDetails = Prisma.BookingGetPayload<{
  include: {
    customer: {
      select: {
        firstName: true
        lastName: true
        email: true
        phone: true
      }
    }
    service: {
      include: {
        category: true
      }
    }
    variant: true
    package: true
    order: {
      include: {
        payments: true
      }
    }
    voucherRedemptions: {
      include: {
        voucher: {
          include: {
            template: true
          }
        }
      }
    }
  }
}>

// ============================================================================
// PAYMENT TYPES
// ============================================================================

export type PaymentWithOrder = Prisma.PaymentGetPayload<{
  include: {
    order: {
      include: {
        customer: true
        items: true
      }
    }
  }
}>

// ============================================================================
// CUSTOMER TYPES
// ============================================================================

export type CustomerWithOrders = Prisma.CustomerGetPayload<{
  include: {
    orders: {
      include: {
        items: true
        payments: true
      }
    }
    bookings: {
      include: {
        service: true
        package: true
      }
    }
    purchasedVouchers: {
      include: {
        template: true
      }
    }
    receivedVouchers: {
      include: {
        template: true
      }
    }
  }
}>

// ============================================================================
// CHECKOUT TYPES (Frontend)
// ============================================================================

export interface CheckoutVoucherData {
  voucherTemplateId: string
  quantity: number
  recipientEmail?: string
  recipientName?: string
  giftMessage?: string
}

export interface CheckoutBookingData {
  variantId?: string
  packageId?: string
  serviceId?: string
  preferredDate: string
  preferredTime: string
  numberOfPeople?: number
  addonIds?: string[]
  customerNotes?: string
  applyVoucherCode?: string
}

export interface CheckoutSessionResponse {
  checkoutUrl: string
  sessionId: string
  orderId: string
  bookingId?: string
}

// ============================================================================
// API RESPONSE TYPES
// ============================================================================

export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    pageSize: number
    total: number
    totalPages: number
  }
}

// ============================================================================
// WEBHOOK TYPES (MONEI)
// ============================================================================

export interface MoneiWebhookEvent {
  id: string
  type: string
  data: {
    object: MoneiCheckoutSession | MoneiPaymentIntent | MoneiCharge
  }
  created: number
}

export interface MoneiCheckoutSession {
  id: string
  status: 'open' | 'complete' | 'expired'
  amount: number
  currency: string
  orderId: string
  customer: {
    email: string
    name?: string
  }
  paymentMethod?: string
  chargeId?: string
  metadata?: Record<string, string>
}

export interface MoneiPaymentIntent {
  id: string
  status: 'requires_payment_method' | 'requires_confirmation' | 'requires_action' | 'processing' | 'succeeded' | 'canceled'
  amount: number
  currency: string
  orderId: string
}

export interface MoneiCharge {
  id: string
  status: 'pending' | 'succeeded' | 'failed'
  amount: number
  amountRefunded: number
  currency: string
  refunded: boolean
  refunds?: {
    id: string
    amount: number
    created: number
  }[]
}

// ============================================================================
// AVAILABILITY TYPES
// ============================================================================

export interface TimeSlot {
  time: string // "10:00"
  available: boolean
  reason?: string // "Reservado", "Fuera de horario", etc.
}

export interface DayAvailability {
  date: string // "2024-06-15"
  slots: TimeSlot[]
  isFullyBooked: boolean
  isClosed: boolean
}

// ============================================================================
// ADMIN DASHBOARD TYPES
// ============================================================================

export interface DashboardStats {
  todayBookings: number
  todayRevenue: number
  pendingBookings: number
  activeVouchers: number
  monthlyRevenue: number
  monthlyBookings: number
}

export interface RevenueByCategory {
  categoryName: string
  total: number
  count: number
}

export interface BookingCalendarEvent {
  id: string
  title: string
  start: Date
  end: Date
  customer: string
  status: string
  notes?: string
}

// ============================================================================
// FORM TYPES
// ============================================================================

export interface ServiceFormData {
  categoryId: string
  slug: string
  name: string
  description?: string
  shortDescription?: string
  type: string
  basePrice?: number
  isPriceFrom?: boolean
  baseDuration?: number
  maxCapacity?: number
  isActive?: boolean
  isFeatured?: boolean
}

export interface VariantFormData {
  serviceId: string
  slug: string
  name: string
  description?: string
  duration?: number
  durationUnit?: string
  area?: string
  variantType?: string
  price: number
  extraCharge?: number
  isActive?: boolean
}

export interface VoucherTemplateFormData {
  slug: string
  name: string
  description?: string
  sessionsIncluded: number
  sessionsBonus?: number
  price: number
  validityDays: number
  restrictionType: string
  restrictedToCategoryId?: string
  restrictedToServiceId?: string
  restrictedToPackageId?: string
  sessionValue?: number
  isActive?: boolean
  isGiftable?: boolean
}

// ============================================================================
// FILTER TYPES
// ============================================================================

export interface ServiceFilters {
  categoryId?: string
  type?: string
  priceMin?: number
  priceMax?: number
  isActive?: boolean
  isFeatured?: boolean
  search?: string
}

export interface BookingFilters {
  startDate?: string
  endDate?: string
  status?: string
  customerId?: string
  serviceId?: string
}

export interface OrderFilters {
  startDate?: string
  endDate?: string
  status?: string
  customerId?: string
  isVoucherPurchase?: boolean
  isServicePurchase?: boolean
}

// ============================================================================
// UTILITY TYPES
// ============================================================================

export type ServiceStatus = 'active' | 'inactive' | 'draft'
export type BookingStatusType = 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled' | 'no_show'
export type OrderStatusType = 'pending' | 'payment_processing' | 'payment_confirmed' | 'completed' | 'cancelled' | 'refunded' | 'expired'
export type VoucherStatusType = 'active' | 'partially_used' | 'fully_redeemed' | 'expired' | 'refunded' | 'cancelled'
export type PaymentStatusType = 'pending' | 'processing' | 'succeeded' | 'failed' | 'cancelled' | 'refunded' | 'partially_refunded'
