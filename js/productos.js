/**
 * Cargador dinámico de productos desde productos.json
 * Actualizado para trabajar SIN precios (distribuidor negocia por WhatsApp)
 */

class ProductosManager {
    constructor() {
        this.productos = [];
        this.categorias = {
            'hombre-premium': 'Hombre Premium',
            'mujer-basic': 'Mujer Basic'
        };
        this.tallas = {};
        this.modal = null;
    }

    /**
     * Carga los productos desde el JSON
     */
    async cargarProductos() {
        try {
            const [inventario, tallas] = await Promise.all([
                window.sheetsAPI.obtenerInventario(),
                window.sheetsAPI.obtenerTallas()
            ]);

            this.productos = inventario.map(producto => ({
                ...producto,
                categoriaDisplay: this.categorias[producto.categoria] || producto.categoria
            }));
            this.tallas = tallas;

            console.log(`✅ ${this.productos.length} productos cargados desde Google Sheets`);
            return true;
        } catch (error) {
            console.error('❌ Error cargando productos desde Google Sheets:', error);
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
        const categoriaDisplay = producto.categoriaDisplay || this.categorias[producto.categoria] || producto.categoria;
        const tallaInfo = this.getInfoTalla(producto);
        const tallaBadge = producto.talla ? `
                    <div class="size-badge">
                        Talla ${producto.talla}
                        ${producto.sexo ? `<small>${producto.sexo}</small>` : ''}
                    </div>` : '';
        const medidasHTML = tallaInfo ? `
                    <p class="product-size">
                        Medidas:
                        <span>Hombro ${tallaInfo.hombro || '?'} cm</span> ·
                        <span>Pecho ${tallaInfo.pecho || '?'} cm</span> ·
                        <span>Manga ${tallaInfo.manga || '?'} cm</span> ·
                        <span>Largo ${tallaInfo.largo || '?'} cm</span>
                    </p>` : '';

        const estado = (producto.estado || '').toLowerCase();
        const isAgotado = estado === 'agotado';
        const cardClasses = ['product-card'];

        if (isAgotado) {
            cardClasses.push('agotado');
        }

        const badgeHTML = `
                    <span class="product-badge ${isAgotado ? 'agotado' : 'unico'}">${isAgotado ? 'AGOTADO' : 'ÚNICO'}</span>`;

        const buttonHTML = isAgotado
            ? `
                    <span class="btn btn-disabled btn-block" aria-disabled="true">
                        <i class="fas fa-ban"></i> No disponible
                    </span>`
            : `
                    <a href="#"
                       class="btn btn-primary btn-block"
                       data-whatsapp
                       data-mensaje="Hola! Me interesa ${producto.nombre}. ¿Cuál es el precio y disponibilidad? 👕">
                        <i class="fab fa-whatsapp"></i> Consultar Precio
                    </a>`;

        return `
            <div class="${cardClasses.join(' ')}" data-category="${producto.categoria}" data-producto-id="${producto.id}" data-zoom-target="${imagenURL}">
                <div class="product-image">
                    ${tallaBadge}
                    ${badgeHTML}
                    <img src="${imagenURL}"
                         alt="${producto.nombre}"
                         loading="lazy"
                         onerror="this.src='https://via.placeholder.com/400x400/FF6B6B/FFFFFF?text=Vestime'"
                         data-zoomable="true">
                </div>
                <div class="product-info">
                    <h3 class="product-name">${producto.nombre}</h3>
                    <p class="product-category" style="color: var(--gray); font-size: 0.9rem; margin-bottom: 0.5rem;">
                        ${categoriaDisplay}
                    </p>
                    <p class="product-description" style="color: var(--gray); font-size: 0.875rem; margin-bottom: 0.5rem;">
                        ${producto.descripcion}
                    </p>
                    ${medidasHTML}
                    ${buttonHTML}
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

        // Configurar zoom en imágenes
        this.inicializarZoom();

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

    getInfoTalla(producto) {
        const key = window.sheetsAPI.getTallaKey?.(producto.sexo, producto.talla) || `${(producto.sexo || '').toLowerCase()}-${(producto.talla || '').toUpperCase()}`;
        return this.tallas[key];
    }

    inicializarZoom() {
        if (!this.modal) {
            this.modal = this.crearModalImagen();
            document.body.appendChild(this.modal);
        }

        const imagenes = document.querySelectorAll('[data-zoomable="true"]');
        imagenes.forEach(img => {
            if (!img.dataset.zoomHandler) {
                img.addEventListener('click', (event) => {
                    event.stopPropagation();
                    this.abrirModalImagen(img);
                });
                img.dataset.zoomHandler = 'true';
            }
        });

        const cards = document.querySelectorAll('.product-card[data-zoom-target]');
        cards.forEach(card => {
            if (!card.dataset.zoomCardHandler) {
                card.addEventListener('click', (event) => {
                    if (event.target.closest('.btn')) return;
                    const img = card.querySelector('img[data-zoomable="true"]');
                    if (img) {
                        this.abrirModalImagen(img);
                    }
                });
                card.dataset.zoomCardHandler = 'true';
            }
        });
    }

    crearModalImagen() {
        const modal = document.createElement('div');
        modal.className = 'image-modal';
        modal.innerHTML = `
            <div class="image-modal__content">
                <button class="image-modal__close" aria-label="Cerrar">&times;</button>
                <img src="" alt="">
                <div class="image-modal__caption"></div>
            </div>
        `;

        modal.addEventListener('click', (event) => {
            if (event.target === modal || event.target.classList.contains('image-modal__close')) {
                modal.classList.remove('open');
            }
        });

        return modal;
    }

    abrirModalImagen(img) {
        if (!this.modal) return;

        const modalImage = this.modal.querySelector('img');
        const caption = this.modal.querySelector('.image-modal__caption');

        modalImage.src = img.src;
        modalImage.alt = img.alt;
        caption.textContent = img.alt || 'Producto Vestime';

        this.modal.classList.add('open');
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
