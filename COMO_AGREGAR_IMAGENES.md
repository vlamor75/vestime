# 📸 Cómo Agregar tus Imágenes de Google Drive

## 🎯 Pasos Rápidos

### 1️⃣ Hacer Públicas las Carpetas (1 vez)

**Carpeta Hombres:**
- Link: https://drive.google.com/drive/folders/1g7koiHM-qTu3v4N2tGgmmJfQdCqfBp8F
- Clic derecho → Compartir → "Cualquiera con el enlace" → Lector ✅

**Carpeta Mujeres:**
- Link: https://drive.google.com/drive/folders/18yPMUBAetCwRzCp4e9u9yGahJmrl9Tnv
- Clic derecho → Compartir → "Cualquiera con el enlace" → Lector ✅

---

### 2️⃣ Obtener ID de cada Imagen

#### Método Fácil (Recomendado):

1. Abre una imagen en Google Drive
2. Clic derecho → "Obtener enlace"
3. Verás algo como:
   ```
   https://drive.google.com/file/d/1ABC123XYZ456/view?usp=sharing
                                   ↑ Este es el ID ↑
   ```
4. Copia solo el ID: `1ABC123XYZ456`

#### Método Alternativo:

1. Abre la imagen
2. Mira la URL del navegador
3. El ID está entre `/d/` y `/view`

---

### 3️⃣ Actualizar productos.json

Edita el archivo `productos.json` y reemplaza `"REEMPLAZAR_CON_ID"` con los IDs reales:

**Ejemplo:**

```json
{
  "id": "hp001",
  "nombre": "Camiseta Hombre Premium #1",
  "categoria": "hombre-premium",
  "imagen_drive_id": "1ABC123XYZ456",  // ← Aquí va el ID
  "descripcion": "Diseño único de alta calidad",
  "destacado": true
}
```

---

## 📋 Template para Copiar

Usa esta tabla para organizar tus IDs:

### Hombre Premium (7 imágenes)

| # | Nombre Archivo | ID de Google Drive | Usar en |
|---|----------------|-------------------|---------|
| 1 | _________.jpg  | _________________ | hp001 |
| 2 | _________.jpg  | _________________ | hp002 |
| 3 | _________.jpg  | _________________ | hp003 |
| 4 | _________.jpg  | _________________ | hp004 |
| 5 | _________.jpg  | _________________ | hp005 |
| 6 | _________.jpg  | _________________ | hp006 |
| 7 | _________.jpg  | _________________ | hp007 |

### Mujer Basic (10 imágenes)

| # | Nombre Archivo | ID de Google Drive | Usar en |
|---|----------------|-------------------|---------|
| 1 | _________.jpg  | _________________ | mb001 |
| 2 | _________.jpg  | _________________ | mb002 |
| 3 | _________.jpg  | _________________ | mb003 |
| 4 | _________.jpg  | _________________ | mb004 |
| 5 | _________.jpg  | _________________ | mb005 |
| 6 | _________.jpg  | _________________ | mb006 |
| 7 | _________.jpg  | _________________ | mb007 |
| 8 | _________.jpg  | _________________ | mb008 |
| 9 | _________.jpg  | _________________ | mb009 |
| 10 | _________.jpg  | _________________ | mb010 |

---

## ✅ Verificar que Funciona

Después de actualizar `productos.json`:

1. Abre el sitio local o en Vercel
2. Deberías ver tus imágenes reales
3. Si ves placeholder, verifica:
   - ✅ Las imágenes son públicas
   - ✅ El ID está correcto
   - ✅ No hay espacios extra en el JSON

---

## 🔄 Agregar MÁS Productos en el Futuro

Cuando tengas más camisetas:

1. Sube la imagen a Google Drive
2. Hazla pública
3. Copia el ID
4. Agrega un nuevo bloque en `productos.json`:

```json
{
  "id": "hp008",  // ← Número consecutivo
  "nombre": "Camiseta Hombre Premium #8",
  "categoria": "hombre-premium",
  "imagen_drive_id": "ID_NUEVO_AQUI",
  "descripcion": "Diseño único de alta calidad",
  "destacado": false  // true si quieres en landing
}
```

5. Guarda el archivo
6. Commit y push:
   ```bash
   git add productos.json
   git commit -m "Agregar nuevo producto HP008"
   git push
   ```
7. Vercel despliega automáticamente en 1-2 min ✅

---

## 💡 Consejos

### Para nombres descriptivos:

En lugar de `"Camiseta Hombre Premium #1"`, usa nombres descriptivos:

```json
"nombre": "Camiseta Negra Estampada",
"nombre": "Polo Blanco Cuello V",
"nombre": "Oversize Gris Urban",
```

### Para descripciones:

Agrega detalles que ayuden a vender:

```json
"descripcion": "100% algodón, diseño exclusivo, talla M-XL"
"descripcion": "Estilo urbano, corte regular, ideal casual"
```

### Productos destacados:

Marca `"destacado": true` para que aparezcan en la landing page (máximo 6)

---

## 🆘 Solución de Problemas

### "La imagen no carga"
- ✅ Verifica que sea pública
- ✅ Prueba el URL directo: `https://drive.google.com/uc?export=view&id=TU_ID`
- ✅ Revisa que no haya espacios en el ID

### "Sale placeholder"
- ✅ El ID en productos.json dice "REEMPLAZAR_CON_ID"
- ✅ Actualiza con el ID real

### "Error en JSON"
- ✅ Verifica que no falten comas
- ✅ Usa un validador: https://jsonlint.com

---

## 📞 ¿Necesitas Ayuda?

Si prefieres, compárteme las carpetas públicas y yo extraigo todos los IDs automáticamente y actualizo el `productos.json` por ti.

WhatsApp: +57 311 716 7526

---

**🚀 ¡En 5 minutos tendrás tu catálogo completo con imágenes reales!**
