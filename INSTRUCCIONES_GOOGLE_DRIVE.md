# 📸 Cómo Usar Imágenes desde Google Drive

## 🎯 Ventajas

- No ocupas espacio en GitHub
- Cambias imágenes sin re-deploy
- Más rápido para actualizar
- CDN de Google (carga rápida)

## 📤 Paso a Paso

### 1. Preparar las Imágenes

**Antes de subir, optimiza tus fotos:**

1. Ve a [Squoosh.app](https://squoosh.app)
2. Sube tu foto
3. Selecciona formato **WebP**
4. Ajusta calidad a **80%**
5. Descarga (ahorra 60-80% de peso)

**Nombres sugeridos:**
- `camiseta-h001.webp` (Hombre #001)
- `camiseta-m001.webp` (Mujer #001)
- `camiseta-u001.webp` (Unisex #001)

### 2. Subir a Google Drive

1. Crea una carpeta en Drive llamada **"Vestime - Productos"**
2. Sube todas las imágenes optimizadas
3. Organiza en subcarpetas si quieres:
   ```
   Vestime - Productos/
   ├── Hombre/
   ├── Mujer/
   └── Unisex/
   ```

### 3. Hacer Públicas las Imágenes

**Opción A: Por carpeta (más rápido)**

1. Clic derecho en la carpeta "Vestime - Productos"
2. Compartir → Cambiar a **"Cualquiera con el enlace"**
3. Permisos: **Lector** (solo ver)
4. Copiar enlace

**Opción B: Imagen por imagen**

1. Clic derecho en la imagen → Compartir
2. Cambiar a "Cualquiera con el enlace"
3. Copiar enlace

### 4. Obtener el ID de la Imagen

Cuando copies el enlace, verás algo así:

```
https://drive.google.com/file/d/1a2b3c4d5e6f7g8h9i0j/view?usp=sharing
                                 ↑ Este es el ID ↑
```

**Copia solo el ID:** `1a2b3c4d5e6f7g8h9i0j`

### 5. Construir la URL para HTML

Usa este formato:

```
https://drive.google.com/uc?export=view&id=ID_DE_LA_IMAGEN
```

**Ejemplo:**

```html
<img src="https://drive.google.com/uc?export=view&id=1a2b3c4d5e6f7g8h9i0j"
     alt="Camiseta Urban #H001"
     loading="lazy">
```

## 📋 Template de Producto

Copia y pega esto en `catalogo.html`, reemplazando los valores:

```html
<div class="product-card" data-category="hombre">
    <div class="product-image">
        <span class="product-badge unico">ÚNICO</span>
        <img src="https://drive.google.com/uc?export=view&id=TU_ID_AQUI"
             alt="Camiseta [NOMBRE] #[CODIGO]"
             loading="lazy">
    </div>
    <div class="product-info">
        <h3 class="product-name">Camiseta [NOMBRE] #[CODIGO]</h3>
        <div class="product-price">$[PRECIO]</div>
        <a href="#" class="btn btn-primary btn-block"
           data-whatsapp
           data-mensaje="Hola! Me interesa la Camiseta [NOMBRE] #[CODIGO] 👕">
            <i class="fab fa-whatsapp"></i> Comprar
        </a>
    </div>
</div>
```

**Reemplaza:**
- `TU_ID_AQUI` → ID de Google Drive
- `[NOMBRE]` → Nombre del diseño
- `[CODIGO]` → Código (ej: H001, M002)
- `[PRECIO]` → Precio (ej: 35.000)
- `data-category` → `hombre`, `mujer` o `unisex`

## 🎬 Videos (Opcional)

Para el video promocional en la landing:

1. Sube el video a Drive
2. Obtén el ID igual que con las imágenes
3. Usa este código en `index.html`:

```html
<video controls poster="URL_THUMBNAIL">
    <source src="https://drive.google.com/uc?export=download&id=VIDEO_ID" type="video/mp4">
    Tu navegador no soporta video.
</video>
```

## ⚠️ Limitaciones de Google Drive

- **Cuota:** Si muchas personas ven la imagen al mismo tiempo, Drive puede bloquearla temporalmente
- **Solución:** Para sitios de alto tráfico, considerar:
  - Cloudinary (gratis hasta 25GB/mes)
  - ImgBB (gratis ilimitado)
  - Subir directamente a `/images/` en el proyecto

## 🔄 Alternativa: Crear Script de Listado

Si tienes MUCHAS imágenes, puedes crear una lista en un archivo:

**Crear `images/productos.json`:**

```json
{
  "productos": [
    {
      "id": "h001",
      "nombre": "Camiseta Urban",
      "categoria": "hombre",
      "precio": "35000",
      "imagen": "1a2b3c4d5e6f7g8h9i0j",
      "unico": true
    },
    {
      "id": "m001",
      "nombre": "Camiseta Floral",
      "categoria": "mujer",
      "precio": "32000",
      "imagen": "9j8i7h6g5f4e3d2c1b0a",
      "unico": true
    }
  ]
}
```

Luego cargar dinámicamente con JavaScript (lo podemos implementar después).

## ✅ Checklist

- [ ] Optimizar todas las imágenes a WebP
- [ ] Subir a Google Drive en carpeta organizada
- [ ] Hacer pública la carpeta
- [ ] Copiar IDs de cada imagen
- [ ] Reemplazar en HTML los placeholders
- [ ] Probar que se vean las imágenes
- [ ] Push a GitHub → Deploy automático en Vercel

## 💡 Tip Pro

Crea una **hoja de cálculo** (puede ser en el mismo Google Sheet) con:

| Código | Nombre | Categoría | Precio | Drive ID | Estado |
|--------|--------|-----------|--------|----------|--------|
| H001 | Urban | hombre | 35000 | 1a2b3... | Activo |
| M001 | Floral | mujer | 32000 | 9j8i7... | Activo |

Así tienes todo centralizado y es fácil actualizar.

---

¿Necesitas ayuda? WhatsApp: +57 311 716 7526
