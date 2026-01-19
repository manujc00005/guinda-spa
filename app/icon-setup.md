# 🎨 Configuración de Favicon y Open Graph Image

Next.js App Router soporta **metadata basada en archivos** para favicon y OG images.

## 📦 Archivos que debes crear en `app/`

### 1. Favicon (obligatorio)
Crea estos archivos en la carpeta `app/`:

- **`app/favicon.ico`** (32x32px o 16x16px)
- **`app/icon.png`** (512x512px recomendado, cuadrado)
- **`app/apple-icon.png`** (180x180px, para iOS)

### 2. Open Graph Image (para redes sociales)
Crea en `app/`:

- **`app/opengraph-image.jpg`** (1200x630px)
  - Esta imagen se mostrará cuando compartan tu web en Facebook, Twitter, WhatsApp, etc.
  - Debe incluir: logo, texto "Spa Serenity" y una imagen representativa

---

## 🎨 Especificaciones de diseño

### Favicon (`app/icon.png`)
- Tamaño: **512x512px** (cuadrado)
- Fondo: Color primario `#8B4569` o transparente
- Contenido: Logo simplificado o iniciales "SS"
- Formato: PNG con transparencia

### Apple Touch Icon (`app/apple-icon.png`)
- Tamaño: **180x180px** (cuadrado)
- Fondo: Sólido (no transparente) - Color primario `#8B4569`
- Contenido: Logo centrado en blanco
- Formato: PNG

### Open Graph Image (`app/opengraph-image.jpg`)
- Tamaño: **1200x630px** (landscape)
- Contenido sugerido:
  - Fondo: Imagen de spa con overlay oscuro
  - Texto grande: "Spa Serenity"
  - Subtítulo: "Circuito Spa Privado + Masajes"
  - Precio destacado: "Desde 75€"
  - Logo en esquina
- Formato: JPG (optimizado, <200KB)

---

## 🛠️ Herramientas para crear las imágenes

### Opción 1: Canva (fácil, online)
1. Ve a [canva.com](https://canva.com)
2. Usa estas plantillas:
   - "Logo" (512x512) para favicon
   - "Facebook Post" o crea custom 1200x630 para OG image
3. Exporta como PNG (favicon) y JPG (OG image)

### Opción 2: Figma (profesional)
1. Crea frames con los tamaños exactos
2. Diseña con tu identidad de marca
3. Exporta como PNG/JPG

### Opción 3: Photoshop/GIMP
- Crea documentos con los tamaños especificados
- Diseña y exporta optimizados

---

## 📂 Estructura final esperada

```
app/
├── favicon.ico          # 32x32 o 16x16
├── icon.png            # 512x512 (favicon moderno)
├── apple-icon.png      # 180x180 (iOS)
├── opengraph-image.jpg # 1200x630 (redes sociales)
├── layout.tsx
├── page.tsx
└── ...
```

---

## ✅ Next.js detectará automáticamente estos archivos

Una vez que coloques los archivos en `app/`, Next.js los detectará y generará automáticamente:

```html
<link rel="icon" href="/icon.png" />
<link rel="apple-touch-icon" href="/apple-icon.png" />
<meta property="og:image" content="/opengraph-image.jpg" />
```

No necesitas configurar nada más. **¡Es automático!**

---

## 🎨 Ejemplo de diseño para OG Image

```
┌─────────────────────────────────────────┐
│                                         │
│  [Fondo: Imagen spa con overlay]       │
│                                         │
│     SPA SERENITY                        │
│     Circuito Spa Privado + Masajes      │
│                                         │
│     ⭐⭐⭐⭐⭐  Desde 75€                  │
│                                         │
│                          [Logo esquina] │
└─────────────────────────────────────────┘
     1200px × 630px
```

---

## 🚀 Validación

Después de crear los archivos, valida que funcionan:

1. **Facebook Debugger**: https://developers.facebook.com/tools/debug/
2. **Twitter Card Validator**: https://cards-dev.twitter.com/validator
3. **Google Rich Results Test**: https://search.google.com/test/rich-results

---

## 📌 Nota importante

Si ya tienes un logo o imagen de marca, puedes:
1. Redimensionarla a los tamaños requeridos
2. Usar [TinyPNG](https://tinypng.com) para optimizar
3. Colocar los archivos en `app/`

**¡Listo!** Next.js hará el resto automáticamente.
