document.addEventListener('DOMContentLoaded', function() {
    // Get data from the embedded JSON
    const dataScript = document.getElementById('products-data');
    const productsData = JSON.parse(dataScript.textContent);

    const tabs = document.querySelectorAll('.tab-btn');
    const grid = document.getElementById('products-grid');

    // Intersection Observer for lazy loading
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

    // Function to render products for a category
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

            // Observe the image for lazy loading
            const img = card.querySelector('img');
            imageObserver.observe(img);
        });
    }

    // Tab event listeners
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            const category = tab.dataset.category;
            renderProducts(category);
        });
    });

    // Load default category (hombre)
    renderProducts('hombre');
});
