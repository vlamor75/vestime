document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('size-guide-modal');
    if (!modal || !window.productosManager) return;

    const tableBody = modal.querySelector('#size-guide-table-body');
    const tabButtons = modal.querySelectorAll('[data-size-guide-tab]');
    const openButtons = document.querySelectorAll('[data-size-guide-open]');
    const closeButton = modal.querySelector('.size-guide-close');
    let currentTab = 'hombre';

    const renderTabla = () => {
        const tallas = window.productosManager.getTallasAgrupadas();
        const lista = tallas[currentTab] || [];

        if (!lista.length) {
            tableBody.innerHTML = `<tr><td colspan="5" style="text-align:center;">Sin datos para esta categoría</td></tr>`;
            return;
        }

        tableBody.innerHTML = lista.map(item => `
            <tr>
                <td>${item.talla}</td>
                <td>${item.hombro}</td>
                <td>${item.pecho}</td>
                <td>${item.manga}</td>
                <td>${item.largo}</td>
            </tr>
        `).join('');
    };

    const openModal = () => {
        modal.classList.add('open');
        modal.setAttribute('aria-hidden', 'false');
        renderTabla();
    };

    const closeModal = () => {
        modal.classList.remove('open');
        modal.setAttribute('aria-hidden', 'true');
    };

    openButtons.forEach(btn => btn.addEventListener('click', openModal));
    closeButton.addEventListener('click', closeModal);
    modal.addEventListener('click', (event) => {
        if (event.target === modal) {
            closeModal();
        }
    });

    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            tabButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentTab = btn.dataset.sizeGuideTab;
            renderTabla();
        });
    });
});
