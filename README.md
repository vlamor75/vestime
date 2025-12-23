# 👕 VESTIME.CO - Sistema de Referidos para Camisetas

Sistema web estático para venta de camisetas con red de referidos integrada. Cada referido tiene su propia URL que cambia el contacto de WhatsApp.

## 🚀 Características

- ✅ Sistema de referidos automático con `?ref=codigo`
- ✅ Integración con Google Sheets (base de datos sin backend)
- ✅ Botones de WhatsApp dinámicos por referido
- ✅ Diseño responsive y optimizado para conversión
- ✅ Landing page + Catálogo con filtros
- ✅ Imágenes desde Google Drive (sin subir al repo)
- ✅ Deploy automático en Vercel

## 📁 Estructura del Proyecto

```
vestime/
├── index.html              # Landing page principal
├── catalogo.html           # Página de productos con filtros
├── css/
│   └── style.css          # Estilos completos
├── js/
│   ├── config.js          # Configuración (WhatsApp, Sheet ID)
│   ├── sheets-api.js      # Conexión con Google Sheets
│   └── referidos.js       # Sistema de detección de referidos
├── images/
│   ├── productos/         # Fotos (usar Google Drive)
│   ├── logo.png
│   └── favicon.png
├── videos/
├── vercel.json            # Configuración de Vercel
├── .gitignore
└── README.md
```

## 🔧 Configuración Inicial

### 1. Google Sheets

Crear hoja llamada **"Referidos"** con estas columnas:

| A (item) | B (referido) | C (whatsapp) | D (nombre) | E (comision) | F (activo) | G (Email) | H (Direccion) |
|----------|--------------|--------------|------------|--------------|------------|-----------|---------------|
| 1 | vlamor | 573001234567 | Víctor | 10% | SI | email@... | Calle... |
| 2 | jose | 573007654321 | José | 15% | SI | jose@... | Carrera... |

**Importante:**
- Hacer la hoja **pública** (Compartir → Cualquiera con el enlace puede VER)
- Copiar el ID del Sheet de la URL: `https://docs.google.com/spreadsheets/d/[SHEET_ID]/edit...`
- Actualizar `GOOGLE_SHEET_ID` en `js/config.js`

### 2. Configurar WhatsApp

Editar `js/config.js`:

```javascript
const CONFIG = {
    WHATSAPP_PRINCIPAL: '573117167526',  // ← Tu número
    GOOGLE_SHEET_ID: 'TU_SHEET_ID_AQUI', // ← ID del Sheet
    // ...
};
```

### 3. Imágenes desde Google Drive

**Opción 1: Links directos de Google Drive**

1. Sube las imágenes a Google Drive
2. Clic derecho → Obtener enlace → Cambiar a "Cualquiera con el enlace"
3. Copiar el ID del archivo: `https://drive.google.com/file/d/[FILE_ID]/view`
4. Usar en HTML como:
   ```html
   <img src="https://drive.google.com/uc?export=view&id=FILE_ID" alt="Producto">
   ```

**Opción 2: Subir directamente a /images/**

1. Optimizar imágenes a WebP (usar [Squoosh.app](https://squoosh.app))
2. Colocar en `images/productos/`
3. Actualizar src en HTML

## 🌐 Deploy en Vercel

### Primera vez:

1. Crear cuenta en [vercel.com](https://vercel.com)
2. Instalar Vercel CLI (opcional):
   ```bash
   npm install -g vercel
   ```
3. Conectar con GitHub:
   - Crear repositorio en GitHub
   - Push del proyecto
   - En Vercel: New Project → Import desde GitHub
   - Vercel desplegará automáticamente

### Vía CLI:

```bash
# Desde este directorio
vercel --prod
```

### Vía GitHub (Recomendado):

1. Crear repo en GitHub
2. Push:
   ```bash
   git init
   git add .
   git commit -m "Initial commit - Vestime sistema de referidos"
   git branch -M main
   git remote add origin https://github.com/TU-USUARIO/vestime.git
   git push -u origin main
   ```
3. En Vercel → Import project → Seleccionar el repo
4. Deploy automático 🚀

## 📊 Cómo Funciona el Sistema de Referidos

### Para el administrador:

1. Agrega referidos al Google Sheet
2. Comparte links personalizados: `vestime.vercel.app?ref=codigo`
3. Cada referido ve el mismo sitio pero con SU WhatsApp

### Para el usuario:

1. Entra a `vestime.vercel.app?ref=vlamor`
2. El sistema busca "vlamor" en Google Sheets
3. Todos los botones de WhatsApp se actualizan al número de vlamor
4. El referido se guarda por 7 días (aunque cierre el navegador)

### Técnico:

- `js/referidos.js` detecta `?ref=` en la URL
- `js/sheets-api.js` consulta Google Sheets (con cache de 5 min)
- Actualiza todos los elementos `[data-whatsapp]`
- Guarda en localStorage por 7 días

## 🎨 Personalización

### Colores:

Editar en `css/style.css`:

```css
:root {
    --primary: #FF6B6B;      /* Color principal */
    --secondary: #4ECDC4;    /* Color secundario */
    --accent: #FFE66D;       /* Color de acento */
}
```

### Productos:

Editar `catalogo.html` y agregar más cards:

```html
<div class="product-card" data-category="hombre">
    <div class="product-image">
        <span class="product-badge unico">ÚNICO</span>
        <img src="URL_DE_IMAGEN" alt="Descripción">
    </div>
    <div class="product-info">
        <h3 class="product-name">Nombre del Producto</h3>
        <div class="product-price">$35.000</div>
        <a href="#" class="btn btn-primary btn-block"
           data-whatsapp
           data-mensaje="Hola! Me interesa [PRODUCTO] 👕">
            <i class="fab fa-whatsapp"></i> Comprar
        </a>
    </div>
</div>
```

## 📱 Uso de Botones WhatsApp

Todos los enlaces con `data-whatsapp` se actualizan automáticamente:

```html
<!-- Básico -->
<a href="#" data-whatsapp>Contactar</a>

<!-- Con mensaje personalizado -->
<a href="#" data-whatsapp data-mensaje="Hola! Me interesa el producto X">
    Comprar
</a>
```

## 🧪 Testing Local

Abrir `index.html` directamente en el navegador o usar un servidor local:

```bash
# Python
python -m http.server 8000

# PHP
php -S localhost:8000

# Node (con http-server)
npx http-server
```

Luego visitar: `http://localhost:8000?ref=vlamor`

## 🔍 Debugging

Abrir consola del navegador (F12) para ver logs:

- ✅ Referido encontrado
- ⚠️ Referido no encontrado
- 📦 Usando cache
- 🔄 Botones actualizados

Para limpiar cache del sistema:

```javascript
// En la consola del navegador
localStorage.clear();
window.sheetsAPI.limpiarCache();
location.reload();
```

## 📈 Próximas Mejoras

- [ ] Menú hamburguesa para móvil
- [ ] Cargar productos dinámicamente desde Sheet
- [ ] Panel de administración para referidos
- [ ] Google Analytics
- [ ] Carrito de compras (fase 2)

## 🤝 Soporte

¿Problemas o preguntas?

- WhatsApp: +57 311 716 7526
- Email: contacto@vestime.co

## 📝 Licencia

© 2025 Vestime.co - Todos los derechos reservados

---

**Versión:** 1.0
**Última actualización:** Noviembre 2025

