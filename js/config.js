// Configuración del sistema de referidos
const CONFIG = {
    // WhatsApp principal de la empresa (cuando NO hay referido)
    WHATSAPP_PRINCIPAL: '573117167526',

    // ID del Google Sheet (extraído de la URL)
    // URL completa: https://docs.google.com/spreadsheets/d/SHEET_ID/edit...
    // Solo necesitamos el SHEET_ID
    GOOGLE_SHEET_ID: '1g8GEaDVaF8pdpshYRbypsKso3tPtkIR2wptumgFaDTw',

    // Nombre de la pestaña en Google Sheets
    SHEET_NAME: 'Referidos',

    // Duración de la cookie de referido (en días)
    REFERIDO_EXPIRY_DAYS: 7,

    // Mensaje predeterminado para WhatsApp
    MENSAJE_DEFAULT: 'Hola! Me interesa información sobre sus camisetas 👕',

    // Base opcional para servir imágenes desde GitHub (raw). Dejar vacío para usar archivos locales.
    IMAGES_BASE_URL: 'https://raw.githubusercontent.com/vlamor75/vestime/main'
};
