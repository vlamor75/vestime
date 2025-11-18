# Proyecto Vestime - Sistema de Referidos para Negocio de Camisetas

## 📋 Descripción del Proyecto

Sistema web estático para venta de camisetas con red de referidos integrada. Cada referido tiene su propia URL personalizada que mantiene el mismo contenido pero cambia el contacto de WhatsApp.

**Ejemplo:**
- `vestime.vercel.app` - Sitio principal
- `vestime.vercel.app?ref=vlamor` - Mismo sitio, WhatsApp de vlamor
- `vestime.vercel.app?ref=jose` - Mismo sitio, WhatsApp de jose

## 🎯 Objetivos de la Primera Fase

1. ✅ Crear sitio estático responsive para catálogo de camisetas
2. ✅ Implementar sistema de referidos con parámetros URL
3. ✅ Integración con Google Sheets para gestión de referidos
4. ✅ Botones de WhatsApp dinámicos según el referido
5. ✅ Deploy en Vercel con dominio gratuito

## 🛠️ Stack Tecnológico

- **Frontend:** HTML5, CSS3, JavaScript vanilla
- **Hosting:** Vercel (plan gratuito)
- **Base de datos:** Google Sheets API
- **Versionamiento:** GitHub
- **Optimización:** WebP para imágenes

## 📁 Estructura del Proyecto
```
vestime/
├── index.html              # Landing page principal
├── catalogo.html           # Página de productos
├── sobre-nosotros.html     # Información de la empresa
├── css/
│   ├── style.css          # Estilos principales
│   └── responsive.css     # Media queries
├── js/
│   ├── referidos.js       # Lógica de referidos
│   ├── whatsapp.js        # Manejo de botones WhatsApp
│   └── sheets-api.js      # Conexión con Google Sheets
├── images/
│   ├── productos/         # Fotos de camisetas (WebP)
│   ├── logo.png
│   └── favicon.ico
├── videos/
│   └── promo.mp4          # Video promocional (opcional)
├── README.md
├── .gitignore
└── vercel.json            # Configuración de Vercel
```

## 📊 Estructura de Google Sheets

**Nombre de la hoja:** `Referidos`

| Columna A | Columna B | Columna C | Columna D | Columna E |
|-----------|-----------|-----------|-----------|-----------|
| referido  | whatsapp  | nombre    | comision  | activo    |
| vlamor    | 3001234567| Víctor L  | 10%       | SI        |
| jose      | 3007654321| José M    | 15%       | SI        |

**URL del Sheet:** Se configurará después de crear el proyecto

## 🎨 Características del Sitio

### Landing Page (index.html)
- Hero section con llamado a la acción
- Galería de productos destacados (6-8 camisetas)
- Sección "Cómo funciona"
- Botón flotante de WhatsApp (dinámico según referido)
- Footer con redes sociales

### Catálogo (catalogo.html)
- Grid responsive de productos
- Filtros por categoría/talla
- Botón "Comprar por WhatsApp" en cada producto
- Sistema de búsqueda simple

### Sistema de Referidos
- Detección automática del parámetro `?ref=`
- Validación del referido en Google Sheets
- Cambio dinámico de todos los botones de WhatsApp
- Cookie/localStorage para recordar el referido (7 días)

## 🚀 Funcionalidades Técnicas

### 1. Detección de Referido
```javascript
// js/referidos.js detecta el parámetro URL
// Busca en Google Sheets
// Actualiza todos los botones de WhatsApp
// Guarda en localStorage
```

### 2. Botones de WhatsApp
- Flotante en todas las páginas
- En cada producto del catálogo
- Mensaje pre-escrito con nombre del producto
- Formato: `https://wa.me/57XXXXXXXXXX?text=Hola, me interesa...`

### 3. Google Sheets Integration
- Lectura pública vía API (no requiere autenticación)
- Cache local para reducir llamadas
- Fallback a WhatsApp principal si referido no existe

## 📱 Responsive Design

- **Mobile first:** Optimizado para celulares
- **Breakpoints:**
  - Mobile: < 768px
  - Tablet: 768px - 1024px
  - Desktop: > 1024px

## 🎨 Paleta de Colores Sugerida
```css
:root {
  --primary: #FF6B6B;      /* Rojo vibrante */
  --secondary: #4ECDC4;    /* Turquesa */
  --dark: #2C3E50;         /* Gris oscuro */
  --light: #F8F9FA;        /* Blanco roto */
  --accent: #FFE66D;       /* Amarillo */
}
```

## ✅ Checklist de Desarrollo

### Fase 1: Setup Inicial
- [ ] Crear cuenta en GitHub
- [ ] Crear cuenta en Vercel
- [ ] Crear repositorio `vestime`
- [ ] Conectar Vercel con GitHub
- [ ] Crear Google Sheet para referidos

### Fase 2: Desarrollo Frontend
- [ ] Estructura HTML de index.html
- [ ] Estructura HTML de catalogo.html
- [ ] CSS responsive base
- [ ] Grid de productos
- [ ] Botón flotante de WhatsApp

### Fase 3: Sistema de Referidos
- [ ] Función para detectar parámetro `?ref=`
- [ ] Conexión con Google Sheets API
- [ ] Lógica de validación de referidos
- [ ] Actualización dinámica de WhatsApp
- [ ] LocalStorage para persistencia

### Fase 4: Contenido
- [ ] Optimizar 20-30 fotos de productos (WebP)
- [ ] Crear video promocional corto (opcional)
- [ ] Textos de productos y descripciones
- [ ] Logo y favicon

### Fase 5: Deploy y Pruebas
- [ ] Push a GitHub
- [ ] Verificar deploy en Vercel
- [ ] Probar sistema de referidos
- [ ] Validar responsive en móvil
- [ ] Compartir con 2-3 referidos de prueba

## 🔗 URLs y Recursos

**Sitio en desarrollo:** `https://vestime.vercel.app` (se generará después del deploy)

**Repositorio GitHub:** `https://github.com/tu-usuario/vestime` (crear)

**Google Sheet:** (crear y compartir link público)

## 📞 Información de Contacto Principal

**WhatsApp empresa:** +57 XXX XXX XXXX (configurar)
**Email:** info@vestime.co (opcional)
**Instagram:** @vestime.co (opcional)

## 🎯 KPIs a Medir (Semana 1-4)

1. Número de referidos activos
2. Clics en botones de WhatsApp por referido
3. Conversiones (ventas) por referido
4. Tráfico total al sitio
5. Páginas más visitadas

## 📝 Notas Importantes

- **No usar backend** en esta fase (solo JavaScript del lado del cliente)
- **Google Sheets público** (solo lectura, sin datos sensibles)
- **Optimizar imágenes** antes de subir (usar herramientas como Squoosh)
- **Probar en móvil** constantemente (80% del tráfico esperado)

## 🚀 Próximos Pasos (Fase 2 - Futuro)

- Comprar dominio `vestime.com`
- Crear sitio de mayoreo separado
- Implementar analytics (Google Analytics)
- Sistema de comisiones automatizado
- Panel de administración para referidos

---

## 💡 Comandos Útiles
```bash
# Clonar el proyecto
git clone https://github.com/tu-usuario/vestime.git

# Instalar Vercel CLI (opcional)
npm install -g vercel

# Deploy manual (si no está conectado a GitHub)
vercel --prod
```

---

**Creado:** Noviembre 2025  
**Última actualización:** Noviembre 2025  
**Versión:** 1.0 - MVP Sistema de Referidos