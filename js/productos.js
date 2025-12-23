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
     * Carga los productos desde productos.json (generado desde Cloudinary)
     */
    async cargarProductos() {
        try {
            // Cargar productos desde JSON
            const cacheBuster = new Date().getTime();
            const response = await fetch(`/productos.json?v=${cacheBuster}`);
            const productos = await response.json();

            this.productos = productos.map(producto => ({
                ...producto,
                categoriaDisplay: this.categorias[producto.categoria] || producto.categoria
            }));

            // Tallas predeterminadas
            this.tallas = {
                'Hombre': {
                    'S': { hombro: '45', pecho: '96', manga: '19', largo: '68' },
                    'M': { hombro: '47', pecho: '100', manga: '20', largo: '70' },
                    'L': { hombro: '49', pecho: '104', manga: '21', largo: '72' },
                    'XL': { hombro: '51', pecho: '108', manga: '22', largo: '74' }
                },
                'Mujer': {
                    'S': { hombro: '38', pecho: '86', manga: '16', largo: '62' },
                    'M': { hombro: '40', pecho: '90', manga: '17', largo: '64' },
                    'L': { hombro: '42', pecho: '94', manga: '18', largo: '66' }
                }
            };

            console.log(`✅ ${this.productos.length} productos cargados desde Cloudinary`);
            return true;
        } catch (error) {
            console.error('❌ Error cargando productos:', error);
            return false;
        }
    }

    /**
     * Obtiene la URL de la imagen del producto desde Cloudinary
     */
    getImagenURL(producto) {
        // Las imágenes ya vienen con URLs completas de Cloudinary
        if (producto.imagen && producto.imagen.trim()) {
            return producto.imagen;
        }

        // Placeholder si no hay imagen
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
                    </div>` : '';

        const measurements = tallaInfo ? [
            { label: 'Hombro', value: tallaInfo.hombro },
            { label: 'Pecho', value: tallaInfo.pecho },
            { label: 'Manga', value: tallaInfo.manga },
            { label: 'Largo', value: tallaInfo.largo }
        ].map(item => `
                            <span>${item.label}: ${item.value || '-'} cm</span>`).join('') : '';

        const sizeBlockHTML = measurements ? `
                    <div class="product-size-block">
                        <div class="product-measurements">${measurements}</div>
                    </div>` : '';

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
                    ${sizeBlockHTML}
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

    getTallasAgrupadas() {
        const agrupadas = {};
        Object.values(this.tallas || {}).forEach(info => {
            if (!info) return;
            const sexoKey = (info.sexo || '').toLowerCase().includes('mujer') ? 'mujer' : 'hombre';
            if (!agrupadas[sexoKey]) {
                agrupadas[sexoKey] = [];
            }

            agrupadas[sexoKey].push({
                talla: info.talla || '-',
                hombro: info.hombro || '-',
                pecho: info.pecho || '-',
                manga: info.manga || '-',
                largo: info.largo || '-'
            });
        });

        Object.values(agrupadas).forEach(lista => {
            lista.sort((a, b) => a.talla.localeCompare(b.talla, 'es', { numeric: true, sensitivity: 'base' }));
        });

        return agrupadas;
    }

    inicializarZoom() {
        if (!this.modal) {
            this.modal = this.crearModalImagen();
            document.body.appendChild(this.modal);
        }

        const imagenes = document.querySelectorAll('[data-zoomable="true"]');
        imagenes.forEach(img => {
            if (!img.dataset.zoomHandler) {
                const handler = (event) => {
                    event.stopPropagation();
                    event.preventDefault();
                    this.abrirModalImagen(img);
                };

                img.addEventListener('click', handler);
                img.addEventListener('touchend', handler, { passive: false });
                img.dataset.zoomHandler = 'true';
            }
        });

        const cards = document.querySelectorAll('.product-card[data-zoom-target]');
        cards.forEach(card => {
            if (!card.dataset.zoomCardHandler) {
                const handler = (event) => {
                    if (event.target.closest('.btn')) return;
                    if (event.type === 'click') {
                        const img = card.querySelector('img[data-zoomable="true"]');
                        if (img) {
                            this.abrirModalImagen(img);
                        }
                    }
                };

                card.addEventListener('click', handler);
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
