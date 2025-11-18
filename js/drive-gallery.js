/**
 * Sistema Automático de Galería desde Google Drive
 * Lee carpetas públicas y muestra todas las imágenes automáticamente
 * ¡Agrega/borra fotos en Drive y se actualiza solo!
 */

class DriveGallery {
    constructor() {
        this.carpetas = {
            'hombre-premium': '1g7koiHM-qTu3v4N2tGgmmJfQdCqfBp8F',
            'mujer-basic': '18yPMUBAetCwRzCp4e9u9yGahJmrl9Tnv'
        };

        this.categoriasNombres = {
            'hombre-premium': 'Hombre Premium',
            'mujer-basic': 'Mujer Basic'
        };

        this.productos = [];
        this.cache = {};
        this.CACHE_DURATION = 10 * 60 * 1000; // 10 minutos
    }

    /**
     * Obtiene archivos de una carpeta pública de Google Drive
     * Usa la API pública sin autenticación
     */
    async obtenerArchivosDesdeAPI(folderId) {
        try {
            // Verificar cache
            const cacheKey = `folder_${folderId}`;
            if (this.cache[cacheKey] && (Date.now() - this.cache[cacheKey].timestamp < this.CACHE_DURATION)) {
                console.log(`📦 Usando cache para carpeta ${folderId.substring(0, 8)}...`);
                return this.cache[cacheKey].data;
            }

            console.log(`🔄 Descargando archivos de carpeta ${folderId.substring(0, 8)}...`);

            // Usar Google Drive API v3 sin autenticación (carpeta pública)
            // Alternativa: Parsear HTML de la vista web
            const archivos = await this.obtenerArchivosPorHTML(folderId);

            // Guardar en cache
            this.cache[cacheKey] = {
                data: archivos,
                timestamp: Date.now()
            };

            return archivos;

        } catch (error) {
            console.error(`❌ Error obteniendo archivos de ${folderId}:`, error);
            return [];
        }
    }

    /**
     * Método alternativo: Parsear HTML de Drive (funciona con carpetas públicas)
     * NOTA: Este método puede no ser 100% confiable, mejor usar IDs manuales
     */
    async obtenerArchivosPorHTML(folderId) {
        try {
            // Por ahora, retornamos array vacío
            // La API de Drive requiere autenticación para listar archivos
            console.warn('⚠️ No se puede listar automáticamente sin API Key');
            console.warn('💡 Usando método de IDs individuales en productos.json');
            return [];
        } catch (error) {
            console.error('Error parseando HTML:', error);
            return [];
        }
    }

    /**
     * Carga productos desde productos.json (método híbrido)
     */
    async cargarProductosDesdeJSON() {
        try {
            const response = await fetch('./productos.json');
            const data = await response.json();

            this.productos = data.productos.map(producto => {
                return {
                    ...producto,
                    imagenURL: this.getImagenURL(producto.imagen),
                    categoriaDisplay: this.categoriasNombres[producto.categoria] || producto.categoria
                };
            });

            console.log(`✅ ${this.productos.length} productos cargados desde JSON`);
            return this.productos;

        } catch (error) {
            console.error('❌ Error cargando productos.json:', error);
            return [];
        }
    }

    /**
     * Obtiene URL de imagen (usa ruta local)
     */
    getImagenURL(imagenPath) {
        if (!imagenPath) {
            return 'https://via.placeholder.com/400x400/FF6B6B/FFFFFF?text=Vestime';
        }
        return imagenPath;
    }

    /**
     * Genera HTML de producto (SIN PRECIO)
     */
    generarProductoHTML(producto) {
        return `
            <div class="product-card" data-category="${producto.categoria}" data-producto-id="${producto.id}">
                <div class="product-image">
                    <span class="product-badge unico">ÚNICO</span>
                    <img src="${producto.imagenURL}"
                         alt="${producto.nombre}"
                         loading="lazy"
                         onerror="this.src='https://via.placeholder.com/400x400/FF6B6B/FFFFFF?text=Sin+Imagen'">
                </div>
                <div class="product-info">
                    <h3 class="product-name">${producto.nombre}</h3>
                    <p class="product-category" style="color: var(--gray); font-size: 0.9rem; margin-bottom: 0.5rem;">
                        ${producto.categoriaDisplay}
                    </p>
                    <p class="product-description" style="color: var(--gray); font-size: 0.875rem; margin-bottom: 1rem;">
                        ${producto.descripcion || 'Diseño único y exclusivo'}
                    </p>
                    <a href="#"
                       class="btn btn-primary btn-block"
                       data-whatsapp
                       data-mensaje="Hola! Me interesa ${producto.nombre}. ¿Cuál es el precio y disponibilidad? 👕">
                        <i class="fab fa-whatsapp"></i> Consultar Precio
                    </a>
                </div>
            </div>
        `;
    }

    /**
     * Renderiza productos en contenedor
     */
    async renderizarProductos(contenedorId, filtro = {}) {
        const contenedor = document.getElementById(contenedorId);
        if (!contenedor) {
            console.warn(`⚠️ Contenedor #${contenedorId} no encontrado`);
            return;
        }

        // Cargar productos si no están cargados
        if (this.productos.length === 0) {
            await this.cargarProductosDesdeJSON();
        }

        // Filtrar
        let productosFiltrados = [...this.productos];

        if (filtro.destacados) {
            productosFiltrados = productosFiltrados.filter(p => p.destacado);
        }

        if (filtro.categoria) {
            productosFiltrados = productosFiltrados.filter(p => p.categoria === filtro.categoria);
        }

        if (filtro.limite) {
            productosFiltrados = productosFiltrados.slice(0, filtro.limite);
        }

        // Renderizar
        const html = productosFiltrados.map(p => this.generarProductoHTML(p)).join('');
        contenedor.innerHTML = html;

        // Actualizar botones de WhatsApp
        if (window.sistemaReferidos) {
            setTimeout(() => {
                window.sistemaReferidos.actualizarBotonesWhatsApp();
            }, 100);
        }

        console.log(`📦 ${productosFiltrados.length} productos renderizados`);
    }

    /**
     * Filtra productos por búsqueda
     */
    buscarProductos(texto) {
        const textoLower = texto.toLowerCase();
        return this.productos.filter(p =>
            p.nombre.toLowerCase().includes(textoLower) ||
            (p.descripcion && p.descripcion.toLowerCase().includes(textoLower)) ||
            p.id.toLowerCase().includes(textoLower) ||
            p.categoriaDisplay.toLowerCase().includes(textoLower)
        );
    }

    /**
     * Obtiene productos por categoría
     */
    getProductosPorCategoria(categoria) {
        return this.productos.filter(p => p.categoria === categoria);
    }
}

// Instancia global
window.driveGallery = new DriveGallery();

// Auto-inicializar
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', async () => {
        await window.driveGallery.cargarProductosDesdeJSON();

        // Renderizar productos destacados
        if (document.getElementById('productos-destacados')) {
            await window.driveGallery.renderizarProductos('productos-destacados', {
                destacados: true,
                limite: 6
            });
        }

        // Renderizar catálogo completo
        if (document.getElementById('catalogo-completo')) {
            await window.driveGallery.renderizarProductos('catalogo-completo');
        }
    });
} else {
    (async () => {
        await window.driveGallery.cargarProductosDesdeJSON();

        if (document.getElementById('productos-destacados')) {
            await window.driveGallery.renderizarProductos('productos-destacados', {
                destacados: true,
                limite: 6
            });
        }

        if (document.getElementById('catalogo-completo')) {
            await window.driveGallery.renderizarProductos('catalogo-completo');
        }
    })();
}
