# 🚀 Guía de Inicio Rápido - Guinda SPA

## ⚡ Setup en 10 minutos

### 1️⃣ Instalar Dependencias

```bash
npm install
# o
pnpm install
```

### 2️⃣ Configurar PostgreSQL

**Opción A: Railway (Recomendado)**
```bash
# 1. Ir a https://railway.app
# 2. Crear proyecto → Add PostgreSQL
# 3. Copiar DATABASE_URL desde Variables
```

**Opción B: Local con Docker**
```bash
# docker-compose.yml
version: '3.8'
services:
  postgres:
    image: postgres:14-alpine
    environment:
      POSTGRES_DB: guinda_spa
      POSTGRES_USER: admin
      POSTGRES_PASSWORD: secret
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:

# Ejecutar
docker-compose up -d

# DATABASE_URL
postgresql://admin:secret@localhost:5432/guinda_spa
```

**Opción C: Supabase**
```bash
# 1. Ir a https://supabase.com
# 2. Crear proyecto
# 3. Settings → Database → Connection string (Pooler)
```

### 3️⃣ Configurar Variables de Entorno

```bash
cp .env.example .env.local
```

Editar `.env.local`:

```env
# PostgreSQL
DATABASE_URL="postgresql://user:password@host:5432/guinda_spa"

# MONEI (Crear cuenta en https://dashboard.monei.com)
MONEI_API_KEY="pk_test_xxxxxxxxxxxxx"
MONEI_WEBHOOK_SECRET="whsec_xxxxxxxxxxxxx"
MONEI_ACCOUNT_ID="acc_xxxxxxxxxxxxx"

# App
NEXT_PUBLIC_URL="http://localhost:3000"

# Cron
CRON_SECRET="mi-secret-super-seguro-123"
```

### 4️⃣ Inicializar Base de Datos

```bash
# Generar cliente Prisma
npx prisma generate

# Ejecutar migraciones
npm run db:migrate

# Poblar con datos de ejemplo
npm run db:seed
```

**✅ Datos creados:**
- 11 categorías
- 30+ servicios con variantes
- 4 paquetes en pareja
- 4 plantillas de bonos
- 5 addons
- 1 cliente de ejemplo
- 1 pedido de ejemplo con voucher

### 5️⃣ Iniciar Servidor

```bash
npm run dev
```

Abrir: http://localhost:3000

### 6️⃣ Explorar Base de Datos (Opcional)

```bash
npm run db:studio
```

Abre Prisma Studio en: http://localhost:5555

---

## 🧪 Probar Funcionalidades

### Ver Catálogo

1. Abrir http://localhost:3000/services
2. Explorar categorías y servicios
3. Ver variantes con precios diferentes

### Probar Checkout de Voucher

1. Ir a http://localhost:3000/vouchers
2. Seleccionar "Bono 3+1 Gratis"
3. Click "Comprar ahora"
4. Rellenar email
5. En MONEI usar tarjeta de prueba:
   - **Número**: `4242 4242 4242 4242`
   - **Caducidad**: `12/30`
   - **CVV**: `123`
6. Verificar que redirige a página de éxito
7. Revisar en DB (Prisma Studio) que se creó:
   - Order con estado `PAYMENT_CONFIRMED`
   - Payment con estado `SUCCEEDED`
   - Voucher con código `GUINDA-XXXX-XXXX`

### Probar Checkout de Reserva

1. Seleccionar servicio (ej: Masaje Relajante 60min)
2. Elegir fecha y hora
3. Añadir extras (toalla, infusión)
4. Checkout → Pagar con tarjeta de prueba
5. Verificar que se crea Booking con estado `CONFIRMED`

### Canjear Voucher

1. Usar código del voucher creado: `GUINDA-DEMO-1234`
2. Ir a crear reserva
3. Aplicar código
4. Elegir servicio compatible (masaje)
5. Seleccionar fecha/hora
6. Confirmar sin pago
7. Verificar que:
   - Booking creado
   - Voucher decrementado (3 sesiones restantes)
   - VoucherRedemption registrado

---

## 📊 Ver Dashboard Admin

### Crear Usuario Admin (Placeholder)

```typescript
// TODO: Implementar sistema de autenticación
// Por ahora, acceso directo a rutas /admin
```

### Rutas Admin a Implementar

- `/admin` - Dashboard principal con KPIs
- `/admin/services` - CRUD de servicios
- `/admin/bookings` - Agenda de reservas
- `/admin/vouchers` - Bonos emitidos
- `/admin/orders` - Pedidos y pagos
- `/admin/customers` - Clientes
- `/admin/reports` - Reportes

---

## 🔧 Comandos Útiles

```bash
# Base de datos
npm run db:migrate        # Aplicar migraciones
npm run db:push          # Push schema sin migración (dev)
npm run db:seed          # Re-seed datos
npm run db:studio        # Abrir Prisma Studio
npm run db:reset         # Reset completo (¡cuidado!)

# Desarrollo
npm run dev              # Servidor desarrollo
npm run build            # Build producción
npm run start            # Servidor producción
npm run lint             # Linter

# Prisma
npx prisma generate      # Regenerar cliente
npx prisma migrate dev   # Nueva migración
npx prisma studio        # Abrir Studio
npx prisma format        # Formatear schema
```

---

## 🐛 Troubleshooting Común

### Error: "Can't reach database server"

```bash
# Verificar que PostgreSQL está corriendo
psql -h localhost -U admin -d guinda_spa

# O si es Docker
docker ps | grep postgres

# Verificar DATABASE_URL en .env.local
echo $DATABASE_URL
```

### Error: "MONEI API key invalid"

```bash
# Verificar que copiaste la key correcta
# Debe empezar con pk_test_ (test) o pk_live_ (producción)

# Ir a https://dashboard.monei.com/settings/api-keys
# Copiar API Key y Webhook Secret
```

### Error: Migraciones fallan

```bash
# Opción 1: Reset y empezar de cero
npm run db:reset

# Opción 2: Push directo (sin migraciones)
npm run db:push
```

### Webhooks no funcionan localmente

```bash
# Instalar ngrok
npm install -g ngrok

# Exponer puerto 3000
ngrok http 3000

# Copiar URL de ngrok (ej: https://xxxx.ngrok.io)
# Configurar en MONEI Dashboard → Webhooks:
# https://xxxx.ngrok.io/api/webhooks/monei

# Probar webhook
curl -X POST https://xxxx.ngrok.io/api/webhooks/monei \
  -H "Content-Type: application/json" \
  -d '{"type":"test","data":{}}'
```

---

## 📁 Archivos Importantes

| Archivo | Descripción |
|---------|-------------|
| `prisma/schema.prisma` | Modelo de datos completo |
| `prisma/seed.ts` | Datos iniciales del catálogo |
| `lib/prisma.ts` | Cliente Prisma singleton |
| `lib/types.ts` | Tipos TypeScript útiles |
| `docs/ARCHITECTURE.md` | Decisiones técnicas detalladas |
| `docs/MONEI_INTEGRATION.md` | Integración de pagos |
| `docs/SERVER_ACTIONS_EXAMPLES.md` | Ejemplos de código |
| `docs/RESUMEN_EJECUTIVO.md` | Vista de alto nivel |

---

## 🎯 Próximos Pasos

### Semana 1-2: Frontend Básico
- [ ] Layout principal con navegación
- [ ] Home con servicios destacados
- [ ] Catálogo de servicios por categoría
- [ ] Página de detalle de servicio
- [ ] Carrito de compra
- [ ] Página de vouchers

### Semana 3-4: Integración MONEI
- [ ] Checkout flow completo
- [ ] Integrar MONEI checkout
- [ ] Página de éxito/error
- [ ] Webhook handler
- [ ] Testing con tarjetas de prueba

### Semana 5-6: Dashboard Admin
- [ ] Layout admin con sidebar
- [ ] CRUD de servicios
- [ ] Gestión de precios
- [ ] Agenda de reservas (calendario)
- [ ] Listado de bonos emitidos
- [ ] Reportes básicos

### Semana 7: Testing y Deploy
- [ ] Tests E2E con Playwright
- [ ] Deploy a Vercel
- [ ] Configurar webhooks en producción
- [ ] Migración de DB a producción
- [ ] Monitoreo con Sentry

---

## 🆘 ¿Necesitas Ayuda?

### Documentación
- **Prisma**: https://www.prisma.io/docs
- **Next.js**: https://nextjs.org/docs
- **MONEI**: https://docs.monei.com
- **PostgreSQL**: https://www.postgresql.org/docs

### Comunidades
- **Next.js Discord**: https://nextjs.org/discord
- **Prisma Slack**: https://slack.prisma.io

### Soporte Stack
- **Vercel Support**: https://vercel.com/support
- **Railway Help**: https://railway.app/help
- **MONEI Support**: support@monei.com

---

## ✅ Checklist de Validación

Antes de continuar, verifica que:

- [ ] `npm install` completado sin errores
- [ ] PostgreSQL accesible (test con `psql` o Prisma Studio)
- [ ] `.env.local` configurado con todas las variables
- [ ] `npm run db:migrate` ejecutado exitosamente
- [ ] `npm run db:seed` completado (ver mensaje "Seed completed")
- [ ] `npm run dev` funciona y abre en localhost:3000
- [ ] Prisma Studio abre y muestra datos (`npm run db:studio`)
- [ ] Cuenta MONEI creada (aunque sea test mode)

**Si todo ✅, estás listo para empezar a desarrollar el frontend!** 🚀

---

**Última actualización**: Enero 2026
