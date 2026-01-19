# Estructura de imágenes para Guinda Wellnes & Spa

## 📁 Organización de carpetas

### `/public/images/hero/`
Imágenes principales para la sección hero
- **hero-main.jpg** (1600x900px mínimo) - Imagen principal del hero con ambiente spa

### `/public/images/gallery/`
Galería de imágenes del spa (sección #galeria)
- **gallery-1.jpg** (800x800px) - Imagen destacada grande (2x2 grid)
- **gallery-2.jpg** (400x400px) - Jacuzzi/hidromasaje
- **gallery-3.jpg** (400x400px) - Zona de relajación
- **gallery-4.jpg** (400x400px) - Sauna
- **gallery-5.jpg** (400x400px) - Detalles decorativos

### `/public/images/services/`
Imágenes de servicios (opcional, para futuras mejoras)
- Puedes añadir imágenes específicas de cada tratamiento

## 🎨 Especificaciones técnicas

### Formato recomendado:
- **Formato:** JPG (optimizado) o WebP
- **Peso máximo:** 200KB por imagen (usa TinyPNG o Squoosh)
- **Relación de aspecto:**
  - Hero: 16:9 (landscape)
  - Galería: 1:1 (cuadrado)

### Optimización:
```bash
# Usa herramientas online:
- https://tinypng.com/
- https://squoosh.app/
```

## 🔄 Cómo reemplazar las imágenes

1. Coloca tus imágenes en las carpetas correspondientes
2. Edita `app/page.tsx` y reemplaza las URLs de Unsplash por:
   ```tsx
   src="/images/hero/hero-main.jpg"
   src="/images/gallery/gallery-1.jpg"
   ```

## ✅ Checklist

- [ ] hero-main.jpg subida
- [ ] gallery-1.jpg subida (imagen grande destacada)
- [ ] gallery-2.jpg subida
- [ ] gallery-3.jpg subida
- [ ] gallery-4.jpg subida
- [ ] gallery-5.jpg subida
