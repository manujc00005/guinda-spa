# Resumen Ejecutivo - Sistema Guinda Wellness & Spa

## 🎯 Objetivo

Sistema completo de gestión para SPA que permite:
1. **Vender servicios online** con reserva de cita
2. **Vender bonos/vouchers** (3+1, 5+1, personalizados)
3. **Gestionar reservas** con calendario integrado
4. **Procesar pagos** de forma segura con MONEI
5. **Administrar catálogo** con precios dinámicos

---

## 📊 Arquitectura de Alto Nivel

```
┌─────────────────────────────────────────────────────────────┐
│                    FRONTEND (Next.js 15)                     │
│  - Catálogo público                                          │
│  - Checkout con MONEI                                        │
│  - Dashboard cliente (mis reservas, mis bonos)               │
│  - Dashboard admin (gestión completa)                        │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────┐
│              BACKEND (Next.js API + Server Actions)          │
│  - Lógica de negocio                                         │
│  - Validaciones                                              │
│  - Integración MONEI                                         │
│  - Webhooks                                                  │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────┐
│               BASE DE DATOS (PostgreSQL + Prisma)            │
│  - Catálogo (servicios, paquetes, addons)                   │
│  - Bonos (templates, instancias, redenciones)               │
│  - Pedidos y pagos                                           │
│  - Reservas                                                  │
│  - Clientes                                                  │
└─────────────────────────────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────┐
│                      MONEI (Pagos)                           │
│  - Checkout Sessions                                         │
│  - Procesamiento de tarjetas                                │
│  - Webhooks de confirmación                                 │
│  - Gestión de reembolsos                                    │
└─────────────────────────────────────────────────────────────┘
```

---

## 🗃️ Modelo de Datos - Vista Simplificada

### Catálogo
- **Category**: SPA, Masajes, Rituales, Faciales, Corporales, Manicura, Pedicura, Peluquería, Pareja
- **Service**: Servicio base (ej: "Masaje Relajante")
- **ServiceVariant**: Variantes con precio específico (30min/60min/90min)
- **Addon**: Extras (toalla, IBX, Kerastase)
- **Package**: Experiencias combinadas (Spa + Masaje Pareja)

### Bonos
- **VoucherTemplate**: Plantilla (3+1, 5+1, personalizado)
- **Voucher**: Instancia comprada con código único
- **VoucherRedemption**: Registro de cada canje

### Ventas
- **Order**: Pedido (voucher o reserva)
- **Payment**: Información de pago MONEI
- **MoneiEvent**: Webhooks recibidos (idempotencia)

### Reservas
- **Booking**: Cita confirmada con fecha/hora
- **Customer**: Cliente registrado

---

## 💳 Flujo de Pagos con MONEI

### Estrategia: DB-First (Sin sincronización de catálogo)

**✅ Ventajas:**
- Precios siempre actualizados desde DB
- No hay desincronización
- Flexibilidad total para cambios
- Addons y variantes fáciles de gestionar

**❌ No usar Products de MONEI:**
- Catálogo demasiado complejo para sincronizar
- Variantes múltiples (duración + área + tipo)
- Precios dinámicos según addons

### Proceso:

```
1. Usuario elige servicio/bono en frontend
2. Backend crea Order en DB (PENDING)
3. Backend crea Checkout Session en MONEI con precio dinámico
4. Usuario redirigido a MONEI
5. Usuario paga con tarjeta
6. MONEI envía webhook → Backend
7. Backend actualiza Order (CONFIRMED)
8. Backend genera Voucher (si es bono) o confirma Booking
9. Email de confirmación al cliente
```

---

## 🎫 Sistema de Bonos

### Tipos de Bonos

1. **Bono 3+1 (30 días)**
   - 3 sesiones compradas + 1 gratis
   - Válido 1 mes
   - Precio: 150€
   - Restricción: Solo masajes

2. **Bono 5+1 (90 días)**
   - 5 sesiones compradas + 1 gratis
   - Válido 3 meses
   - Precio: 280€
   - Restricción: Cualquier servicio

3. **Bonos Personalizados**
   - Configurables por admin
   - Restricciones por categoría/servicio/paquete
   - Caducidad personalizada

### Características

- ✅ Código único generado: `GUINDA-XXXX-XXXX`
- ✅ Estados: Activo, Parcialmente usado, Totalmente canjeado, Expirado, Reembolsado
- ✅ Auditoría completa de redenciones
- ✅ Validación de restricciones pre-canje
- ✅ Caducidad automática (cron job)
- ✅ Posibilidad de regalo (destinatario diferente)

### Canje de Bono

1. Cliente con bono activo elige servicio compatible
2. Valida disponibilidad de fecha/hora
3. Backend verifica restricciones y sesiones disponibles
4. Crea Booking sin pago
5. Registra redención y decrementa sesiones
6. Confirmación inmediata

---

## 📅 Sistema de Reservas

### Flujo Normal (Con Pago)

```
1. Usuario elige servicio + variante + fecha/hora
2. Valida disponibilidad en tiempo real
3. Añade addons opcionales (toalla, IBX, etc.)
4. Checkout → Pago con MONEI
5. Webhook confirma pago
6. Booking pasa de PENDING a CONFIRMED
7. Email de confirmación
8. Aparece en calendario admin
```

### Flujo con Voucher (Sin Pago)

```
1. Usuario aplica código de bono válido
2. Valida restricciones (categoría/servicio)
3. Elige fecha/hora
4. Booking creado directamente como CONFIRMED
5. Voucher decrementado automáticamente
6. Email de confirmación
```

### Cancelaciones

- Cliente puede cancelar si estado es PENDING o CONFIRMED
- Si se usó voucher, sesión se restaura automáticamente
- Si se pagó con tarjeta, admin puede procesar reembolso en MONEI

---

## 🔧 Admin Dashboard

### Gestión de Servicios
- CRUD completo de servicios y variantes
- Cambiar precios en tiempo real
- Activar/desactivar servicios
- Gestionar addons aplicables
- Revalidación automática de frontend

### Gestión de Bonos
- Crear plantillas de bonos
- Ver bonos emitidos y su estado
- Marcar bonos como expirados manualmente
- Reporte de canjes por periodo

### Agenda de Reservas
- Vista calendario por día/semana/mes
- Filtros por estado, servicio, cliente
- Marcar como completada, cancelar, no show
- Notas del staff por reserva

### Reportes
- Ventas por categoría
- Ingresos por periodo
- Bonos más vendidos
- Servicios más reservados
- Tasa de conversión

---

## 🔐 Seguridad y Validaciones

### Webhooks MONEI
- ✅ Verificación de firma con secret
- ✅ Idempotencia con eventId único
- ✅ Logs completos de eventos
- ✅ Reintentos automáticos si falla

### Transacciones Atómicas
- ✅ Prisma transactions para operaciones críticas
- ✅ Rollback automático en errores
- ✅ Prevención de race conditions

### Bonos
- ✅ Código único no predecible
- ✅ Validación de expiración en tiempo real
- ✅ Lock optimista para evitar doble canje
- ✅ Auditoría completa de uso

### Pagos
- ✅ No se guardan datos de tarjetas
- ✅ Importes en céntimos (sin decimales)
- ✅ Metadata completa para reconciliación
- ✅ Estados sincronizados con MONEI

---

## 🚀 Despliegue y Escalabilidad

### Stack Recomendado

| Componente | Servicio | Coste aprox. |
|-----------|----------|--------------|
| **Frontend + Backend** | Vercel | $20/mes (Pro) |
| **Base de Datos** | Railway PostgreSQL | $5-20/mes |
| **Pagos** | MONEI | 1.5% + 0.25€/transacción |
| **Emails** | Resend | Gratis (3k/mes) |

### Performance

- **Prisma ORM**: Queries optimizadas con índices
- **Next.js 15**: ISR para catálogo (revalidación on-demand)
- **Server Actions**: Menos latencia que API routes
- **PostgreSQL**: Índices en campos críticos (slug, status, date)

### Escalabilidad

- **Horizontal**: Vercel escala automáticamente
- **Database**: Railway soporta hasta 10GB (planes superiores si crece)
- **Cache**: Implementar Redis (Upstash) si tráfico > 10k usuarios/día
- **CDN**: Vercel Edge Network incluido

---

## 📈 Métricas de Éxito

### KPIs Principales

1. **Tasa de conversión**: Visitas → Compras
2. **Valor medio de pedido**: Ticket promedio
3. **Bonos vendidos vs canjeados**: % de uso
4. **Ocupación de agenda**: % de slots reservados
5. **Tiempo medio de reserva**: Días de antelación

### Analytics Recomendado

- **Google Analytics 4**: Comportamiento usuarios
- **Vercel Analytics**: Performance web
- **Prisma Insights**: Queries lentas
- **MONEI Dashboard**: Reportes de ventas

---

## 🛠️ Mantenimiento

### Tareas Automáticas (Cron Jobs)

```javascript
// Vercel Cron en vercel.json
{
  "crons": [
    {
      "path": "/api/cron/expire-vouchers",
      "schedule": "0 0 * * *" // Diario a medianoche
    },
    {
      "path": "/api/cron/reminder-bookings",
      "schedule": "0 9 * * *" // Diario a las 9am
    },
    {
      "path": "/api/cron/cleanup-pending-orders",
      "schedule": "0 2 * * *" // Diario a las 2am
    }
  ]
}
```

### Backups

- **Railway**: Backups automáticos diarios (retención 7 días)
- **Manual**: `pg_dump` semanal a S3/Backblaze

### Logs

- **Vercel**: Logs de requests y errores
- **MONEI**: Dashboard con historial de webhooks
- **Prisma**: Query logs en desarrollo

---

## 📋 Checklist de Implementación

### Fase 1: Setup Base (Semana 1)
- [ ] Configurar PostgreSQL (Railway/Supabase)
- [ ] Ejecutar migraciones Prisma
- [ ] Seed con datos de ejemplo
- [ ] Crear cuenta MONEI (test mode)
- [ ] Configurar variables de entorno

### Fase 2: Frontend Público (Semana 2-3)
- [ ] Home con servicios destacados
- [ ] Catálogo de servicios por categoría
- [ ] Detalle de servicio con variantes
- [ ] Página de bonos
- [ ] Carrito y checkout

### Fase 3: Integración MONEI (Semana 4)
- [ ] Checkout Sessions para vouchers
- [ ] Checkout Sessions para reservas
- [ ] Webhook handler completo
- [ ] Testing con tarjetas de prueba
- [ ] Emails de confirmación

### Fase 4: Dashboard Admin (Semana 5-6)
- [ ] CRUD de servicios y precios
- [ ] Agenda de reservas (calendario)
- [ ] Gestión de bonos emitidos
- [ ] Reportes básicos
- [ ] Sistema de usuarios admin

### Fase 5: Testing y Deploy (Semana 7)
- [ ] Tests E2E con Playwright
- [ ] Testing de webhooks en staging
- [ ] Revisión de seguridad
- [ ] Deploy a producción
- [ ] Configurar webhooks en MONEI live

### Fase 6: Post-Launch (Semana 8+)
- [ ] Monitorización con Sentry
- [ ] Analytics con Google Analytics
- [ ] Optimización de performance
- [ ] Feedback de usuarios
- [ ] Iteración de mejoras

---

## 📞 Contacto Técnico

**Documentación completa:**
- `docs/ARCHITECTURE.md` - Decisiones técnicas
- `docs/MONEI_INTEGRATION.md` - Integración de pagos
- `docs/SERVER_ACTIONS_EXAMPLES.md` - Ejemplos de código
- `README_ARCHITECTURE.md` - Guía principal

**Stack:**
- Next.js 15: https://nextjs.org/docs
- Prisma: https://www.prisma.io/docs
- MONEI: https://docs.monei.com
- PostgreSQL: https://www.postgresql.org/docs

**Soporte:**
- MONEI: support@monei.com
- Railway: https://railway.app/help
- Vercel: https://vercel.com/support

---

## ✅ Ventajas del Sistema Propuesto

1. **Escalable**: Preparado para crecer sin cambios arquitectónicos
2. **Mantenible**: Código TypeScript con tipos seguros
3. **Performante**: ISR + Server Actions + Prisma optimizado
4. **Seguro**: Webhooks verificados, transacciones atómicas
5. **Flexible**: Precios y catálogo editables en tiempo real
6. **Auditado**: Historial completo de redenciones y pagos
7. **Modern Stack**: Next.js 15 con últimas features

---

**Fecha:** Enero 2026
**Versión:** 1.0
**Arquitecto:** Claude Sonnet 4.5
