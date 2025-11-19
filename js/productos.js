/**
 * Cargador dinámico de productos desde productos.json
 * Actualizado para trabajar SIN precios (distribuidor negocia por WhatsApp)
 */

class ProductosManager {
    constructor() {
        this.productos = [];
        this.categorias = {};
    }

    /**
     * Carga los productos desde el JSON
     */
    async cargarProductos() {
        try {
            const response = await fetch('./productos.json');
            const data = await response.json();

            this.productos = data.productos;
            this.categorias = data.categorias;

            console.log(`✅ ${this.productos.length} productos cargados`);
            return true;
        } catch (error) {
            console.error('❌ Error cargando productos:', error);
            return false;
        }
    }

    /**
     * Obtiene la mejor URL disponible para la imagen del producto
     * Prioriza rutas locales (deploy en Vercel) y cae a IDs de Drive
     */
    getImagenURL(producto) {
        const imagenPath = producto.imagen && producto.imagen.trim();
        const driveId = producto.imagen_drive_id && producto.imagen_drive_id.trim();
        const baseURL = (CONFIG.IMAGES_BASE_URL || '').trim();

        if (imagenPath) {
            const isAbsolute = imagenPath.startsWith('http://') || imagenPath.startsWith('https://');
            if (isAbsolute || !baseURL) {
                return imagenPath;
            }

            const normalizedPath = imagenPath.startsWith('/') ? imagenPath : `/${imagenPath}`;
            return `${baseURL}${normalizedPath}`;
        }

        if (driveId && driveId !== 'REEMPLAZAR_CON_ID') {
            return `https://drive.google.com/uc?export=view&id=${driveId}`;
        }

        // Placeholder si no hay referencia válida
        return 'https://via.placeholder.com/400x400/FF6B6B/FFFFFF?text=Vestime';
    }

    /**
     * Genera el HTML de una tarjeta de producto (SIN PRECIO)
     */
    generarProductoHTML(producto) {
        const imagenURL = this.getImagenURL(producto);
        const categoriaDisplay = this.categorias[producto.categoria] || producto.categoria;

        const estado = (producto.estado || '').toLowerCase();
        const isAgotado = estado === 'agotado';
        const cardClasses = ['product-card'];

        if (isAgotado) {
            cardClasses.push('agotado');
        }

        const badgeHTML = `
                    <span class="product-badge ${isAgotado ? 'agotado' : 'unico'}">${isAgotado ? 'AGOTADO' : 'ÚNICO'}</span>`;

        return `
            <div class="${cardClasses.join(' ')}" data-category="${producto.categoria}" data-producto-id="${producto.id}">
                <div class="product-image">
                    ${badgeHTML}
                    <img src="${imagenURL}"
                         alt="${producto.nombre}"
                         loading="lazy"
                         onerror="this.src='https://via.placeholder.com/400x400/FF6B6B/FFFFFF?text=Vestime'">
                </div>
                <div class="product-info">
                    <h3 class="product-name">${producto.nombre}</h3>
                    <p class="product-category" style="color: var(--gray); font-size: 0.9rem; margin-bottom: 0.5rem;">
                        ${categoriaDisplay}
                    </p>
                    <p class="product-description" style="color: var(--gray); font-size: 0.875rem; margin-bottom: 1rem;">
                        ${producto.descripcion}
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
     * Renderiza productos en un contenedor
     */
    renderizarProductos(contenedorId, filtro = {}) {
        const contenedor = document.getElementById(contenedorId);
        if (!contenedor) {
            console.error(`Contenedor ${contenedorId} no encontrado`);
            return;
        }

        // Filtrar productos
        let productosFiltrados = this.productos;

        if (filtro.destacados) {
            productosFiltrados = productosFiltrados.filter(p => p.destacado);
        }

        if (filtro.categoria) {
            productosFiltrados = productosFiltrados.filter(p => p.categoria === filtro.categoria);
        }

        if (filtro.limite) {
            productosFiltrados = productosFiltrados.slice(0, filtro.limite);
        }

        // Generar HTML
        const html = productosFiltrados.map(p => this.generarProductoHTML(p)).join('');
        contenedor.innerHTML = html;

        // Actualizar botones de WhatsApp (para sistema de referidos)
        if (window.sistemaReferidos) {
            window.sistemaReferidos.actualizarBotonesWhatsApp();
        }

        console.log(`📦 ${productosFiltrados.length} productos renderizados en #${contenedorId}`);
    }

    /**
     * Obtiene productos por categoría
     */
    getProductosPorCategoria(categoria) {
        return this.productos.filter(p => p.categoria === categoria);
    }

    /**
     * Busca productos por texto
     */
    buscarProductos(texto) {
        const textoLower = texto.toLowerCase();
        return this.productos.filter(p =>
            p.nombre.toLowerCase().includes(textoLower) ||
            p.descripcion.toLowerCase().includes(textoLower) ||
            p.id.toLowerCase().includes(textoLower)
        );
    }
}

// Instancia global
window.productosManager = new ProductosManager();

// Auto-cargar productos cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', async () => {
        await window.productosManager.cargarProductos();

        // Si existe el contenedor de productos destacados, cargarlos
        if (document.getElementById('productos-destacados')) {
            window.productosManager.renderizarProductos('productos-destacados', {
                destacados: true,
                limite: 6
            });
        }

        // Si existe el contenedor del catálogo completo, cargar todos
        if (document.getElementById('catalogo-completo')) {
            window.productosManager.renderizarProductos('catalogo-completo');
        }
    });
} else {
    // DOM ya está listo
    (async () => {
        await window.productosManager.cargarProductos();

        if (document.getElementById('productos-destacados')) {
            window.productosManager.renderizarProductos('productos-destacados', {
                destacados: true,
                limite: 6
            });
        }

        if (document.getElementById('catalogo-completo')) {
            window.productosManager.renderizarProductos('catalogo-completo');
        }
    })();
}
