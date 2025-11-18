/**
 * Sistema de Referidos - Vestime
 * Detecta el parámetro ?ref= en la URL y actualiza todos los botones de WhatsApp
 */

class SistemaReferidos {
    constructor() {
        this.referidoActual = null;
        this.whatsappActual = CONFIG.WHATSAPP_PRINCIPAL;
        this.STORAGE_KEY = 'vestime_referido';
    }

    /**
     * Inicializa el sistema de referidos
     * Se ejecuta al cargar cualquier página
     */
    async inicializar() {
        console.log('🚀 Iniciando sistema de referidos...');

        // 1. Verificar si hay parámetro ?ref= en la URL
        const refURL = this.obtenerParametroURL('ref');

        if (refURL) {
            console.log(`🔍 Detectado referido en URL: ${refURL}`);
            await this.procesarReferido(refURL);
        } else {
            // 2. Verificar si hay referido guardado en localStorage
            const refGuardado = this.obtenerReferidoGuardado();

            if (refGuardado) {
                console.log(`📦 Referido guardado: ${refGuardado.codigo}`);
                this.referidoActual = refGuardado;
                this.whatsappActual = refGuardado.whatsapp;
            } else {
                console.log('ℹ️ No hay referido. Usando WhatsApp principal');
            }
        }

        // 3. Actualizar todos los botones de WhatsApp en la página
        this.actualizarBotonesWhatsApp();

        // 4. Mostrar información del referido actual (si existe)
        this.mostrarInfoReferido();
    }

    /**
     * Obtiene un parámetro de la URL
     */
    obtenerParametroURL(parametro) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(parametro);
    }

    /**
     * Procesa un código de referido: lo busca en Google Sheets y lo guarda
     */
    async procesarReferido(codigo) {
        try {
            // Buscar en Google Sheets
            const referido = await window.sheetsAPI.buscarReferido(codigo);

            if (referido) {
                console.log(`✅ Referido encontrado: ${referido.nombre}`);
                this.referidoActual = referido;
                this.whatsappActual = referido.whatsapp;

                // Guardar en localStorage
                this.guardarReferido(referido);

                // Limpiar URL (quitar el ?ref= sin recargar la página)
                this.limpiarURL();
            } else {
                console.warn(`⚠️ Referido "${codigo}" no encontrado. Usando WhatsApp principal`);
                // No guardamos nada si el referido no existe
            }
        } catch (error) {
            console.error('❌ Error procesando referido:', error);
        }
    }

    /**
     * Guarda el referido en localStorage con fecha de expiración
     */
    guardarReferido(referido) {
        const expiry = new Date();
        expiry.setDate(expiry.getDate() + CONFIG.REFERIDO_EXPIRY_DAYS);

        const data = {
            ...referido,
            expiry: expiry.getTime()
        };

        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
        console.log(`💾 Referido guardado hasta ${expiry.toLocaleDateString()}`);
    }

    /**
     * Obtiene el referido guardado en localStorage (si no ha expirado)
     */
    obtenerReferidoGuardado() {
        try {
            const data = localStorage.getItem(this.STORAGE_KEY);
            if (!data) return null;

            const referido = JSON.parse(data);

            // Verificar si ha expirado
            if (referido.expiry && new Date().getTime() > referido.expiry) {
                console.log('⏰ Referido expirado, limpiando...');
                localStorage.removeItem(this.STORAGE_KEY);
                return null;
            }

            return referido;
        } catch (error) {
            console.error('Error leyendo referido guardado:', error);
            return null;
        }
    }

    /**
     * Limpia el parámetro ?ref= de la URL sin recargar la página
     */
    limpiarURL() {
        const url = new URL(window.location);
        url.searchParams.delete('ref');
        window.history.replaceState({}, '', url);
    }

    /**
     * Actualiza todos los botones de WhatsApp en la página actual
     */
    actualizarBotonesWhatsApp() {
        // Buscar todos los enlaces de WhatsApp
        const botonesWhatsApp = document.querySelectorAll('[data-whatsapp]');

        botonesWhatsApp.forEach(boton => {
            const mensajePersonalizado = boton.getAttribute('data-mensaje') || CONFIG.MENSAJE_DEFAULT;
            const urlWhatsApp = this.generarURLWhatsApp(mensajePersonalizado);

            boton.href = urlWhatsApp;
        });

        console.log(`🔄 ${botonesWhatsApp.length} botones de WhatsApp actualizados`);
    }

    /**
     * Genera una URL de WhatsApp con el número y mensaje
     */
    generarURLWhatsApp(mensaje) {
        const whatsapp = this.whatsappActual;
        const mensajeCodificado = encodeURIComponent(mensaje);

        return `https://wa.me/${whatsapp}?text=${mensajeCodificado}`;
    }

    /**
     * Muestra información del referido actual en la consola o UI
     */
    mostrarInfoReferido() {
        if (this.referidoActual) {
            console.log('👤 Referido activo:', {
                nombre: this.referidoActual.nombre,
                codigo: this.referidoActual.codigo,
                whatsapp: this.whatsappActual,
                comision: this.referidoActual.comision
            });

            // Opcional: mostrar badge en la página
            this.mostrarBadgeReferido();
        }
    }

    /**
     * Muestra un badge visible indicando el referido activo
     */
    mostrarBadgeReferido() {
        // Verificar si ya existe el badge
        if (document.getElementById('vestime-referido-badge')) return;

        const badge = document.createElement('div');
        badge.id = 'vestime-referido-badge';
        badge.innerHTML = `
            <div style="
                position: fixed;
                bottom: 80px;
                right: 20px;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 8px 16px;
                border-radius: 20px;
                font-size: 12px;
                font-weight: 600;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                z-index: 999;
                animation: slideIn 0.5s ease-out;
            ">
                👋 Referido por: ${this.referidoActual.nombre}
            </div>
            <style>
                @keyframes slideIn {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
            </style>
        `;

        document.body.appendChild(badge);
    }

    /**
     * Obtiene el WhatsApp actual (para usar en otros módulos)
     */
    obtenerWhatsAppActual() {
        return this.whatsappActual;
    }

    /**
     * Limpia el referido guardado
     */
    limpiarReferido() {
        localStorage.removeItem(this.STORAGE_KEY);
        this.referidoActual = null;
        this.whatsappActual = CONFIG.WHATSAPP_PRINCIPAL;
        this.actualizarBotonesWhatsApp();
        console.log('🗑️ Referido limpiado');
    }
}

// Instancia global del sistema
window.sistemaReferidos = new SistemaReferidos();

// Auto-inicializar cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.sistemaReferidos.inicializar();
    });
} else {
    // DOM ya está listo
    window.sistemaReferidos.inicializar();
}
