# 🚀 QUICK START - Vestime.co

## ✅ Lo que YA está listo:

1. ✅ Sistema de referidos completo y funcional
2. ✅ Conexión con Google Sheets configurada
3. ✅ Landing page profesional
4. ✅ Catálogo con filtros y búsqueda
5. ✅ Botones de WhatsApp dinámicos
6. ✅ Diseño responsive (móvil + desktop)
7. ✅ Archivos listos para deploy en Vercel

## 📝 PASOS PARA LANZAR (10 minutos)

### 1️⃣ Configurar Google Sheet (2 min)

1. Abre tu Sheet: https://docs.google.com/spreadsheets/d/1g8GEaDVaF8pdpshYRbypsKso3tPtkIR2wptumgFaDTw/edit
2. Renombra la pestaña a: **Referidos**
3. Crea estos encabezados en la fila 1:

```
A: item | B: referido | C: whatsapp | D: nombre | E: comision | F: activo | G: Email | H: Direccion
```

4. Agrega referidos de prueba (fila 2+):

```
1 | vlamor | 573001234567 | Victor Lamor | 10% | SI | email@ejemplo.com | Calle 123
2 | jose   | 573007654321 | Jose Martinez | 15% | SI | jose@ejemplo.com | Carrera 45
```

5. Compartir → **"Cualquiera con el enlace puede VER"** ✅

### 2️⃣ Subir a GitHub (3 min)

1. Crear repo en GitHub: https://github.com/new
   - Nombre: `vestime`
   - Público o Privado (ambos funcionan)
   - NO crear README (ya lo tienes)

2. Desde este directorio:

```bash
git init
git add .
git commit -m "🚀 Vestime - Sistema de referidos completo"
git branch -M main
git remote add origin https://github.com/TU-USUARIO/vestime.git
git push -u origin main
```

### 3️⃣ Deploy en Vercel (3 min)

1. Ve a https://vercel.com
2. Sign up / Login (usar cuenta de GitHub)
3. Click **"Add New Project"**
4. **"Import Git Repository"** → Selecciona `vestime`
5. Click **"Deploy"** (sin cambiar nada)
6. ⏳ Espera 1-2 minutos...
7. ✅ ¡LISTO! Tu sitio está en: `https://vestime.vercel.app`

### 4️⃣ Probar el Sistema (2 min)

1. Abre: `https://tu-proyecto.vercel.app`
2. Prueba con referido: `https://tu-proyecto.vercel.app?ref=vlamor`
3. Abre la consola del navegador (F12) → Deberías ver:
   ```
   ✅ Referido encontrado: Victor Lamor
   🔄 X botones de WhatsApp actualizados
   ```
4. Haz clic en cualquier botón de WhatsApp → Debería abrir con el número de vlamor

## 🎨 Personalización Rápida

### Agregar tus Imágenes:

Lee: `INSTRUCCIONES_GOOGLE_DRIVE.md`

**Resumen:**
1. Sube fotos a Google Drive
2. Hazlas públicas
3. Copia el ID: `https://drive.google.com/file/d/[ID_AQUI]/view`
4. Usa: `https://drive.google.com/uc?export=view&id=ID_AQUI`

### Agregar Productos:

Edita `catalogo.html`, copia este bloque y modifica:

```html
<div class="product-card" data-category="hombre">
    <div class="product-image">
        <span class="product-badge unico">ÚNICO</span>
        <img src="URL_DE_TU_IMAGEN" alt="Camiseta X" loading="lazy">
    </div>
    <div class="product-info">
        <h3 class="product-name">Camiseta X #H001</h3>
        <div class="product-price">$35.000</div>
        <a href="#" class="btn btn-primary btn-block"
           data-whatsapp
           data-mensaje="Hola! Me interesa la Camiseta X #H001 👕">
            <i class="fab fa-whatsapp"></i> Comprar
        </a>
    </div>
</div>
```

**Después de editar:**
```bash
git add .
git commit -m "Actualizar productos"
git push
```
→ Vercel despliega automáticamente en 1-2 min

### Cambiar Colores:

Edita `css/style.css` líneas 12-16:

```css
:root {
    --primary: #FF6B6B;      /* ← Cambia esto */
    --secondary: #4ECDC4;    /* ← Y esto */
    --accent: #FFE66D;       /* ← Y esto */
}
```

## 🎯 URLs Importantes

**Tu sitio:** `https://vestime.vercel.app` (o tu custom domain)

**Links de referidos:**
- `https://vestime.vercel.app?ref=vlamor`
- `https://vestime.vercel.app?ref=jose`
- `https://vestime.vercel.app?ref=CUALQUIER_CODIGO`

**Google Sheet:**
https://docs.google.com/spreadsheets/d/1g8GEaDVaF8pdpshYRbypsKso3tPtkIR2wptumgFaDTw/edit

## 🐛 Solución de Problemas

### Los referidos no funcionan:

1. ✅ Verificar que el Sheet sea público
2. ✅ Verificar que la pestaña se llame "Referidos"
3. ✅ Verificar columna F = "SI" (no "Sí" ni "si")
4. ✅ Abrir consola (F12) y ver errores

### Las imágenes no cargan:

1. ✅ Verificar que sean públicas en Drive
2. ✅ Usar formato: `https://drive.google.com/uc?export=view&id=ID`
3. ✅ Probar el link directo en el navegador

### Cambios no se reflejan:

1. ✅ Hacer commit y push:
   ```bash
   git add .
   git commit -m "Descripción del cambio"
   git push
   ```
2. ✅ Esperar 1-2 min (deploy automático)
3. ✅ Ctrl+F5 para recargar sin cache

## 📱 Compartir con Referidos

Envía a cada referido:

```
¡Hola! 👋

Tu link personal de Vestime es:
https://vestime.vercel.app?ref=TU_CODIGO

Cuando alguien entre por tu link y compre por WhatsApp,
esa venta será tuya y recibirás tu comisión del X%

Comparte tu link en:
- Instagram Stories
- WhatsApp Estados
- Facebook
- TikTok
- Con amigos y familia

¡Mientras más compartas, más vendes! 🚀
```

## 🎓 Próximos Pasos

1. ✅ **Hoy:** Deploy básico y pruebas
2. 📸 **Esta semana:** Agregar tus productos con fotos reales
3. 🎨 **Esta semana:** Personalizar colores y textos
4. 📊 **Mes 1:** Agregar Google Analytics
5. 🌐 **Mes 2:** Comprar dominio `vestime.com`

## ❓ Ayuda

**WhatsApp:** +57 311 716 7526

**Documentación completa:** Ver `README.md`

---

**¡A vender! 🚀👕**
