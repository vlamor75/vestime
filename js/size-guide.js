class SizeGuideModal {
    constructor(modalId) {
        this.modal = document.getElementById(modalId);
        this.currentTab = 'hombre';
        this.tableBody = null;
        this.tabButtons = [];

        if (this.modal) {
            this.init();
        }
    }

    init() {
        if (!window.productosManager) return;

        this.tableBody = this.modal.querySelector('#size-guide-table-body');
        this.tabButtons = this.modal.querySelectorAll('[data-size-guide-tab]');
        const closeButton = this.modal.querySelector('.size-guide-close');

        closeButton.addEventListener('click', () => this.close());
        this.modal.addEventListener('click', (event) => {
            if (event.target === this.modal) {
                this.close();
            }
        });

        this.tabButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                this.tabButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.currentTab = btn.dataset.sizeGuideTab;
                this.renderTable();
            });
        });
    }

    renderTable() {
        const tallas = window.productosManager.getTallasAgrupadas();
        const lista = tallas[this.currentTab] || [];

        if (!lista.length) {
            this.tableBody.innerHTML = `<tr><td colspan="5" style="text-align:center;">Sin datos para esta categoría</td></tr>`;
            return;
        }

        this.tableBody.innerHTML = lista.map(item => `
            <tr>
                <td>${item.talla}</td>
                <td>${item.hombro}</td>
                <td>${item.pecho}</td>
                <td>${item.manga}</td>
                <td>${item.largo}</td>
            </tr>
        `).join('');
    }

    open() {
        if (!this.modal) return;
        this.modal.classList.add('open');
        this.modal.setAttribute('aria-hidden', 'false');
        this.renderTable();
    }

    close() {
        if (!this.modal) return;
        this.modal.classList.remove('open');
        this.modal.setAttribute('aria-hidden', 'true');
    }
}

window.sizeGuideModal = new SizeGuideModal('size-guide-modal');

window.openSizeGuide = () => {
    window.sizeGuideModal?.open();
};
