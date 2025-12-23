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

    // Cargar productos desde el JSON estático cloudinary-urls.json
    async function loadAllProducts() {
        try {
            const response = await fetch('cloudinary-urls.json');
            if (!response.ok) {
                throw new Error('No se pudo cargar cloudinary-urls.json');
            }
            const data = await response.json();
            productsData = data;
            // Categoría por defecto
            renderProducts('hombre');
        } catch (error) {
            console.error('Error loading products from JSON:', error);
            grid.innerHTML = '<p>Error cargando catálogo. Revisa cloudinary-urls.json.</p>';
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
