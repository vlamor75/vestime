# 📸 Cómo Agregar Productos - Guía Definitiva

## ✅ SISTEMA FINAL: Imágenes en Vercel

Las imágenes se suben **directamente al proyecto** y se despliegan con Vercel.

**Ventajas:**
- ✅ Carga súper rápida (CDN de Vercel)
- ✅ 100% confiable
- ✅ Sin límites de cuota
- ✅ Fácil de mantener

---

## 📁 Estructura de Carpetas

```
images/productos/
├── hombre-premium/
│   ├── hp001.jpg
│   ├── hp002.jpg
│   ├── hp003.jpg
│   └── ...
└── mujer-basic/
    ├── mb001.jpg
    ├── mb002.jpg
    ├── mb003.jpg
    └── ...
```

---

## 🚀 PASO A PASO: Agregar Nuevos Productos

### 1️⃣ Preparar las Imágenes

**Nombres de archivo:**
- Hombre Premium: `hp001.jpg`, `hp002.jpg`, etc.
- Mujer Basic: `mb001.jpg`, `mb002.jpg`, etc.

**Optimizar (Importante):**
1. Ve a [Squoosh.app](https://squoosh.app)
2. Sube tu foto
3. Formato: **WebP** o **JPEG**
4. Calidad: **80%**
5. Descarga
6. Renombra según el código (hp001, mb001, etc.)

### 2️⃣ Subir Imágenes al Proyecto

Tienes **2 opciones**:

#### **Opción A: Desde tu computadora (Recomendado)**

1. Descarga el proyecto de GitHub:
   ```bash
   git clone https://github.com/TU-USUARIO/vestime.git
   cd vestime
   ```

2. Copia tus imágenes a las carpetas:
   ```
   - Hombres → images/productos/hombre-premium/
   - Mujeres → images/productos/mujer-basic/
   ```

3. Commit y push:
   ```bash
   git add images/
   git commit -m "Agregar imágenes de productos"
   git push
   ```

4. ✅ Vercel despliega automáticamente en 1-2 min

#### **Opción B: Desde GitHub Web (Sin Git)**

1. Ve a tu repositorio en GitHub
2. Navega a: `images/productos/hombre-premium/`
3. Click **"Add file"** → **"Upload files"**
4. Arrastra tus fotos de hombres
5. Commit changes
6. Repite para `mujer-basic/`
7. ✅ Vercel despliega automáticamente

---

### 3️⃣ Actualizar productos.json (Si es necesario)

**El JSON ya está listo con 17 productos:**
- 7 Hombre Premium (hp001 - hp007)
- 10 Mujer Basic (mb001 - mb010)

**Solo debes subir las imágenes con esos nombres exactos.**

#### Si quieres AGREGAR más productos:

Edita `productos.json` y agrega al final:

```json
{
  "id": "hp008",
  "nombre": "Camiseta Hombre Premium #8",
  "categoria": "hombre-premium",
  "imagen": "./images/productos/hombre-premium/hp008.jpg",
  "descripcion": "Diseño único de alta calidad",
  "destacado": false
}
```

Luego sube la imagen `hp008.jpg` a la carpeta correspondiente.

---

## 📋 CHECKLIST RÁPIDO

Para tus 17 productos actuales:

### Hombre Premium (7 fotos):
- [ ] hp001.jpg
- [ ] hp002.jpg
- [ ] hp003.jpg
- [ ] hp004.jpg
- [ ] hp005.jpg
- [ ] hp006.jpg
- [ ] hp007.jpg

### Mujer Basic (10 fotos):
- [ ] mb001.jpg
- [ ] mb002.jpg
- [ ] mb003.jpg
- [ ] mb004.jpg
- [ ] mb005.jpg
- [ ] mb006.jpg
- [ ] mb007.jpg
- [ ] mb008.jpg
- [ ] mb009.jpg
- [ ] mb010.jpg

---

## 🎯 QUÉ HACER AHORA

1. **Descarga tus 17 fotos de Google Drive**
2. **Optimízalas en Squoosh** (reduce peso 60-80%)
3. **Renómbralas** según el código (hp001, hp002, mb001, etc.)
4. **Súbelas** al proyecto (Opción A o B)
5. **¡Listo!** El sitio las carga automáticamente

---

## 🔄 FLUJO COMPLETO

```
Tienes nueva foto
     ↓
Optimizas en Squoosh
     ↓
Renombras (hp008.jpg)
     ↓
Subes a images/productos/hombre-premium/
     ↓
git add + commit + push
     ↓
Vercel despliega automáticamente (1-2 min)
     ↓
✅ ¡Aparece en el sitio!
```

---

## 💡 CONSEJOS

### Para nombres descriptivos:

En `productos.json`, cambia:
```json
"nombre": "Camiseta Hombre Premium #1"
```

Por algo más descriptivo:
```json
"nombre": "Camiseta Negra Estampada"
```

### Para descripciones:

```json
"descripcion": "100% algodón, diseño exclusivo urban, disponible en tallas M-XL"
```

### Productos destacados:

Los que tienen `"destacado": true` aparecen en la landing page (máximo 6).

---

## 🆘 SOLUCIÓN DE PROBLEMAS

### "La imagen no carga"
- ✅ Verifica que el nombre sea exacto: `hp001.jpg` (no `HP001.JPG`)
- ✅ Verifica que esté en la carpeta correcta
- ✅ Haz Ctrl+F5 para recargar sin cache

### "Quiero cambiar una foto"
- Sube la nueva con el mismo nombre
- Push a GitHub
- Vercel redespliega automáticamente

### "Quiero borrar un producto"
- Borra la imagen de la carpeta
- Borra su entrada en `productos.json`
- Push

---

## 📞 ¿Necesitas Ayuda?

Si prefieres, **descarga las 17 fotos de Drive**, optimízalas, renómbralas y envíamelas. Yo las subo al proyecto por ti.

WhatsApp: +57 311 716 7526

---

**🚀 ¡En 10 minutos tendrás el catálogo completo con tus productos reales!**
