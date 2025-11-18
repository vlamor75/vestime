/**
 * Módulo para conectar con Google Sheets API
 * Lee los datos de referidos desde una hoja pública de Google Sheets
 */

class SheetsAPI {
    constructor() {
        this.cache = null;
        this.cacheTime = null;
        this.CACHE_DURATION = 5 * 60 * 1000; // 5 minutos
    }

    /**
     * Obtiene la URL pública de la API de Google Sheets
     */
    getSheetURL() {
        const baseURL = 'https://docs.google.com/spreadsheets/d';
        const sheetId = CONFIG.GOOGLE_SHEET_ID;
        const sheetName = CONFIG.SHEET_NAME;

        // Formato CSV para leer fácilmente
        return `${baseURL}/${sheetId}/gviz/tq?tqx=out:json&sheet=${sheetName}`;
    }

    /**
     * Obtiene todos los referidos desde Google Sheets
     * Usa cache para evitar múltiples llamadas
     */
    async obtenerReferidos() {
        // Verificar si hay cache válido
        const now = Date.now();
        if (this.cache && this.cacheTime && (now - this.cacheTime < this.CACHE_DURATION)) {
            console.log('📦 Usando cache de referidos');
            return this.cache;
        }

        try {
            console.log('🔄 Descargando referidos desde Google Sheets...');
            const url = this.getSheetURL();
            const response = await fetch(url);
            const text = await response.text();

            // Google Sheets devuelve JSONP, necesitamos extraer el JSON
            const json = this.parseGoogleSheetsResponse(text);

            if (!json || !json.table) {
                throw new Error('Formato de respuesta inválido');
            }

            // Parsear los datos
            const referidos = this.parseReferidos(json.table);

            // Guardar en cache
            this.cache = referidos;
            this.cacheTime = now;

            console.log(`✅ ${referidos.length} referidos cargados`);
            return referidos;

        } catch (error) {
            console.error('❌ Error al obtener referidos:', error);

            // Si hay cache antiguo, usarlo como fallback
            if (this.cache) {
                console.log('⚠️ Usando cache antiguo como fallback');
                return this.cache;
            }

            return [];
        }
    }

    /**
     * Convierte la respuesta JSONP de Google Sheets a JSON
     */
    parseGoogleSheetsResponse(text) {
        try {
            // Eliminar el wrapper de JSONP
            const jsonString = text.substring(47).slice(0, -2);
            return JSON.parse(jsonString);
        } catch (error) {
            console.error('Error parseando respuesta de Google Sheets:', error);
            return null;
        }
    }

    /**
     * Convierte los datos de Google Sheets a objetos de referidos
     */
    parseReferidos(table) {
        const referidos = [];
        const rows = table.rows;

        // Saltar la primera fila (encabezados)
        for (let i = 1; i < rows.length; i++) {
            const row = rows[i];

            // Verificar que la fila tenga datos (columna B - referido)
            if (!row.c || !row.c[1] || !row.c[1].v) continue;

            const referido = {
                item: this.getCellValue(row.c[0]),        // Columna A: item
                codigo: this.getCellValue(row.c[1]),      // Columna B: referido
                whatsapp: this.getCellValue(row.c[2]),    // Columna C: whatsapp
                nombre: this.getCellValue(row.c[3]),      // Columna D: nombre
                comision: this.getCellValue(row.c[4]),    // Columna E: comision
                activo: this.getCellValue(row.c[5]),      // Columna F: activo
                email: this.getCellValue(row.c[6]),       // Columna G: Email (opcional)
                direccion: this.getCellValue(row.c[7])    // Columna H: Direccion (opcional)
            };

            // Solo agregar referidos activos
            if (referido.activo && referido.activo.toUpperCase() === 'SI') {
                referidos.push(referido);
            }
        }

        return referidos;
    }

    /**
     * Extrae el valor de una celda de Google Sheets
     */
    getCellValue(cell) {
        if (!cell) return '';
        return cell.v !== null && cell.v !== undefined ? String(cell.v).trim() : '';
    }

    /**
     * Busca un referido por su código
     */
    async buscarReferido(codigo) {
        if (!codigo) return null;

        const referidos = await this.obtenerReferidos();
        const codigoLower = codigo.toLowerCase().trim();

        return referidos.find(ref =>
            ref.codigo.toLowerCase() === codigoLower
        );
    }

    /**
     * Limpia el cache (útil para debugging)
     */
    limpiarCache() {
        this.cache = null;
        this.cacheTime = null;
        console.log('🗑️ Cache limpiado');
    }
}

// Instancia global
window.sheetsAPI = new SheetsAPI();
