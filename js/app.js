document.addEventListener('DOMContentLoaded', function() {
    const tabs = document.querySelectorAll('.tab-btn');
    const grid = document.getElementById('products-grid');

    // Intersection Observer para lazy loading
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.add('loaded');
                observer.unobserve(img);
            }
        });
    });

    let productsData = {};

    // Cargar productos desde la API serverless /api/products
    async function loadAllProducts() {
        try {
            const response = await fetch('/api/products');
            const data = await response.json();

            if (!response.ok || data.error) {
                throw new Error(data.error || 'Respuesta no válida de /api/products');
            }

            productsData = data;
            // Categoría por defecto
            renderProducts('hombre');
        } catch (error) {
            console.error('Error loading products from API:', error);
            grid.innerHTML = '<p>Error cargando catálogo. Inténtalo de nuevo más tarde.</p>';
        }
    }

    // Pintar productos de una categoría
    function renderProducts(category) {
        grid.innerHTML = '';
        const products = productsData[category] || [];

        products.forEach(product => {
            const card = document.createElement('div');
            card.className = 'product-card';

            card.innerHTML = `
                <div class="product-image">
                    <img data-src="${product.cloudinary}" alt="${product.original}" loading="lazy">
                </div>
                <div class="product-info">
                    <div class="product-name">${product.original.split('.')[0].replace(/[-_]/g, ' ')}</div>
                </div>
            `;

            grid.appendChild(card);

            const img = card.querySelector('img');
            imageObserver.observe(img);
        });
    }

    // Tabs de categorías
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            const category = tab.dataset.category;
            renderProducts(category);
        });
    });

    // Cargar productos al iniciar
    loadAllProducts();
});
