# Guinda Wellness & Spa - Arquitectura Backend

Sistema completo de gestión de SPA con **Next.js 15 App Router + Prisma + PostgreSQL + MONEI**.

## 📋 Índice

1. [Características](#características)
2. [Stack Tecnológico](#stack-tecnológico)
3. [Instalación](#instalación)
4. [Estructura del Proyecto](#estructura-del-proyecto)
5. [Modelos de Datos](#modelos-de-datos)
6. [Flujos Principales](#flujos-principales)
7. [Documentación Técnica](#documentación-técnica)

---

## ✨ Características

### Gestión de Catálogo
- ✅ Servicios con variantes (duración, área, tipo)
- ✅ Paquetes/experiencias combinadas
- ✅ Addons/extras configurables
- ✅ Precios dinámicos desde DB
- ✅ Categorización jerárquica

### Sistema de Bonos (Vouchers)
- ✅ Bonos personalizables (3+1, 5+1, etc.)
- ✅ Restricciones por categoría/servicio/paquete
- ✅ Caducidad automática
- ✅ Redenciones auditadas
- ✅ Bonos regalo con destinatario

### Pagos con MONEI
- ✅ Checkout Sessions
- ✅ Webhooks idempotentes
- ✅ Gestión de reembolsos
- ✅ Estados de pago sincronizados
- ✅ Metadata completa

### Reservas (Bookings)
- ✅ Sistema de disponibilidad
- ✅ Confirmación post-pago
- ✅ Canje de vouchers
- ✅ Cancelaciones con restauración
- ✅ Calendario de reservas

### Admin Dashboard
- ✅ CRUD de servicios y precios
- ✅ Revalidación en tiempo real
- ✅ Gestión de bonos
- ✅ Agenda de reservas
- ✅ Reportes de ventas

---

## 🛠 Stack Tecnológico

| Tecnología | Versión | Uso |
|-----------|---------|-----|
| **Next.js** | 15+ | Framework React con App Router |
| **React** | 19+ | UI Library |
| **TypeScript** | 5+ | Tipado estático |
| **Prisma** | 6+ | ORM para PostgreSQL |
| **PostgreSQL** | 14+ | Base de datos relacional |
| **MONEI** | API v1 | Procesamiento de pagos |
| **Tailwind CSS** | 4+ | Estilos |

---

## 🚀 Instalación

### 1. Clonar e Instalar Dependencias

```bash
# Instalar dependencias
npm install

# O con pnpm
pnpm install
```

### 2. Configurar Variables de Entorno

```bash
cp .env.example .env.local
```

Editar `.env.local`:

```env
# PostgreSQL (Railway, Supabase, local, etc.)
DATABASE_URL="postgresql://user:password@localhost:5432/guinda_spa"

# MONEI (obtener en https://dashboard.monei.com)
MONEI_API_KEY="pk_test_xxxxxxxxxxxxx"
MONEI_WEBHOOK_SECRET="whsec_xxxxxxxxxxxxx"
MONEI_ACCOUNT_ID="acc_xxxxxxxxxxxxx"

# App
NEXT_PUBLIC_URL="http://localhost:3000"

# Cron (para jobs de expiración)
CRON_SECRET="generar-random-secret"
```

### 3. Inicializar Base de Datos

```bash
# Ejecutar migraciones
npm run db:migrate

# Seed con datos de ejemplo
npm run db:seed

# Abrir Prisma Studio (opcional)
npm run db:studio
```

### 4. Ejecutar en Desarrollo

```bash
npm run dev
```

Aplicación disponible en: `http://localhost:3000`

---

## 📁 Estructura del Proyecto

```
guinda-spa/
├── app/
│   ├── (public)/               # Rutas públicas
│   │   ├── page.tsx            # Home
│   │   ├── services/           # Catálogo de servicios
│   │   ├── vouchers/           # Compra de bonos
│   │   └── checkout/           # Proceso de pago
│   ├── (protected)/            # Rutas autenticadas
│   │   ├── profile/            # Perfil de usuario
│   │   └── bookings/           # Mis reservas
│   ├── admin/                  # Dashboard admin
│   │   ├── services/           # Gestión de servicios
│   │   ├── bookings/           # Agenda
│   │   ├── vouchers/           # Bonos emitidos
│   │   └── reports/            # Reportes
│   ├── api/
│   │   ├── checkout/           # Crear sesiones MONEI
│   │   ├── webhooks/monei/     # Handler de webhooks
│   │   └── cron/               # Jobs programados
│   └── actions/                # Server Actions
│       ├── voucher.actions.ts
│       ├── booking.actions.ts
│       └── admin.actions.ts
├── lib/
│   ├── prisma.ts               # Cliente Prisma
│   └── monei.ts                # Cliente MONEI
├── prisma/
│   ├── schema.prisma           # Modelos de datos
│   └── seed.ts                 # Datos iniciales
└── docs/                       # Documentación técnica
    ├── ARCHITECTURE.md         # Decisiones arquitectónicas
    ├── MONEI_INTEGRATION.md    # Integración de pagos
    └── SERVER_ACTIONS_EXAMPLES.md
```

---

## 🗄️ Modelos de Datos

### Diagrama Simplificado

```
Category
   ↓ 1:N
Service → ServiceVariant (precios/duraciones)
   ↓ N:M
Addon (extras)

Package → PackageItem (servicios incluidos)

VoucherTemplate → Voucher → VoucherRedemption
                     ↓
                  Booking

Customer → Order → OrderItem
             ↓
          Payment (MONEI)
             ↓
        MoneiEvent (webhooks)

Booking ← Order (si es compra con reserva)
```

### Entidades Principales

#### **Category**
Agrupa servicios (SPA, Masajes, Rituales, Faciales, etc.)

#### **Service**
Servicio base con precio y duración base. Puede tener variantes.

#### **ServiceVariant**
Variantes de un servicio: duraciones (30/60/90min), áreas (cuello/cuerpo completo), tipos (relajante/deportivo).

#### **Addon**
Extras aplicables: toalla, IBX, Kerastase, infusión, etc.

#### **Package**
Experiencias combinadas: "Spa + Masaje Pareja", "Ritual Pacific Spirit".

#### **VoucherTemplate**
Plantilla de bono: 3+1, 5+1, personalizados. Define restricciones y caducidad.

#### **Voucher**
Instancia de un bono comprado. Código único, sesiones restantes, estado.

#### **Order**
Pedido de compra (voucher o reserva). Totales, estado, customer.

#### **Payment**
Información del pago MONEI. PaymentId, sessionId, estado, metadata.

#### **Booking**
Reserva confirmada con fecha/hora. Puede estar ligada a un voucher.

Ver schema completo en: `prisma/schema.prisma`

---

## 🔄 Flujos Principales

### 1️⃣ Compra de Voucher (Bono)

```
Usuario elige bono 3+1
    ↓
Añade a carrito
    ↓
Checkout → Crea Order (PENDING)
    ↓
Redirect a MONEI Checkout Session
    ↓
Usuario paga con tarjeta
    ↓
MONEI envía webhook checkout.session.completed
    ↓
Backend:
  - Actualiza Order (PAYMENT_CONFIRMED)
  - Actualiza Payment (SUCCEEDED)
  - Genera Voucher con código único
  - Envía email con código
    ↓
Usuario recibe código GUINDA-XXXX-XXXX
```

### 2️⃣ Compra de Servicio con Reserva

```
Usuario elige servicio + variante + fecha/hora
    ↓
Validar disponibilidad
    ↓
Checkout → Crea Order + Booking (PENDING)
    ↓
Redirect a MONEI
    ↓
Usuario paga
    ↓
Webhook checkout.session.completed
    ↓
Backend:
  - Confirma Order
  - Confirma Booking (CONFIRMED)
  - Envía email de confirmación
    ↓
Reserva confirmada en calendario
```

### 3️⃣ Canje de Voucher para Reservar

```
Usuario con voucher activo
    ↓
Elige servicio compatible con restricciones
    ↓
Selecciona fecha/hora
    ↓
Aplicar voucher (sin pago)
    ↓
Backend (transacción):
  - Crea Booking (CONFIRMED)
  - Crea VoucherRedemption
  - Decrementa sessionsRemaining
  - Actualiza estado voucher
    ↓
Reserva confirmada sin pago
```

### 4️⃣ Webhook de Reembolso

```
Admin procesa reembolso en MONEI
    ↓
MONEI envía webhook charge.refunded
    ↓
Backend:
  - Actualiza Payment (REFUNDED)
  - Actualiza Order (REFUNDED)
  - Marca Vouchers como REFUNDED
  - Cancela Bookings asociados
    ↓
Vouchers quedan inutilizables
```

---

## 📚 Documentación Técnica

### Documentos Principales

1. **[ARCHITECTURE.md](./docs/ARCHITECTURE.md)**
   - Relaciones y cardinalidades
   - Estrategia MONEI
   - Webhooks idempotentes
   - Reglas de caducidad
   - Seed completo

2. **[MONEI_INTEGRATION.md](./docs/MONEI_INTEGRATION.md)**
   - Setup de MONEI
   - Flujos de checkout
   - Testing con tarjetas
   - Seguridad y firmas
   - Troubleshooting

3. **[SERVER_ACTIONS_EXAMPLES.md](./docs/SERVER_ACTIONS_EXAMPLES.md)**
   - Validar vouchers
   - Crear bookings
   - Cancelar reservas
   - Admin actions
   - Ejemplos de uso

### Scripts Disponibles

```bash
# Desarrollo
npm run dev              # Iniciar servidor de desarrollo

# Base de datos
npm run db:migrate       # Ejecutar migraciones
npm run db:push          # Push schema sin migración
npm run db:seed          # Seed con datos de ejemplo
npm run db:studio        # Abrir Prisma Studio
npm run db:reset         # Reset completo de DB

# Build
npm run build            # Build para producción
npm run start            # Servidor de producción
```

---

## 🔐 Seguridad

### Webhooks
- ✅ Verificación de firma MONEI
- ✅ Idempotencia con `eventId`
- ✅ Rate limiting (opcional con Upstash)
- ✅ Logs completos

### Pagos
- ✅ Importes en céntimos (sin decimales)
- ✅ Metadata completa
- ✅ Estados sincronizados
- ✅ No se guardan tarjetas

### Vouchers
- ✅ Códigos únicos generados
- ✅ Validación de expiración
- ✅ Redenciones auditadas
- ✅ Prevención de uso duplicado

### Transacciones
- ✅ Prisma transactions para operaciones críticas
- ✅ Rollback automático en errores
- ✅ Locks optimistas

---

## 🚢 Deployment

### Vercel (Recomendado)

```bash
# Conectar con Vercel
vercel

# Configurar variables de entorno en Vercel Dashboard:
# - DATABASE_URL (Railway, Supabase, etc.)
# - MONEI_API_KEY
# - MONEI_WEBHOOK_SECRET
# - NEXT_PUBLIC_URL

# Configurar Cron Jobs en vercel.json
```

### Railway (Base de datos)

1. Crear proyecto PostgreSQL en Railway
2. Copiar `DATABASE_URL`
3. Ejecutar migraciones: `npm run db:migrate`

### MONEI Webhooks

Configurar en Dashboard MONEI:
- URL: `https://tu-dominio.com/api/webhooks/monei`
- Eventos: `checkout.session.completed`, `payment_intent.succeeded`, `charge.refunded`

---

## 📞 Soporte

Para dudas sobre:

- **Prisma**: https://www.prisma.io/docs
- **MONEI**: https://docs.monei.com
- **Next.js**: https://nextjs.org/docs

---

## 📄 Licencia

Proyecto privado - Guinda Wellness & Spa © 2024

---

## 🎯 Próximos Pasos

1. ✅ Configurar PostgreSQL en Railway/Supabase
2. ✅ Crear cuenta MONEI (test mode)
3. ✅ Ejecutar migraciones y seed
4. ✅ Probar checkout con tarjeta de prueba
5. ✅ Configurar webhooks con ngrok localmente
6. ✅ Implementar frontend del catálogo
7. ✅ Dashboard admin básico
8. ✅ Sistema de emails (Resend)
9. ✅ Testing E2E (Playwright)
10. ✅ Deploy a producción

---

## 👨‍💻 Arquitecto

Sistema diseñado por Claude (Sonnet 4.5) especializado en:
- Next.js App Router + Server Actions
- Prisma ORM + PostgreSQL
- MONEI Payments Integration
- E-commerce SaaS Architecture

Fecha: Enero 2026
