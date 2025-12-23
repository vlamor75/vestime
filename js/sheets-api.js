/**
 * Módulo para conectar con Google Sheets API
 * Lee los datos de referidos desde una hoja pública de Google Sheets
 */

class SheetsAPI {
    constructor() {
        this.cache = {};
        this.CACHE_DURATION = 5 * 60 * 1000; // 5 minutos
        this.cloudinaryUrls = null; // Cache para URLs de Cloudinary
        this.loadCloudinaryUrls(); // Cargar URLs al inicializar
    }

    /**
     * Carga el archivo cloudinary-urls.json con cache busting
     */
    async loadCloudinaryUrls() {
        try {
            // Cache busting: agregar timestamp para forzar recarga
            const cacheBuster = new Date().getTime();
            const response = await fetch(`/cloudinary-urls.json?v=${cacheBuster}`);
            this.cloudinaryUrls = await response.json();
            console.log('✅ URLs de Cloudinary cargadas:', {
                hombre: this.cloudinaryUrls.hombre?.length || 0,
                premium: this.cloudinaryUrls.premium?.length || 0,
                mujer: this.cloudinaryUrls.mujer?.length || 0
            });
        } catch (error) {
            console.warn('⚠️ No se pudo cargar cloudinary-urls.json:', error);
            this.cloudinaryUrls = { hombre: [], premium: [], mujer: [] };
        }
    }

    /**
     * Obtiene URL de Cloudinary para una referencia específica
     */
    getCloudinaryUrl(referencia, categoria) {
        if (!this.cloudinaryUrls) return null;

        // Determinar qué carpeta de Cloudinary usar
        let folder = 'hombre';
        if (categoria === 'hombre-premium') folder = 'premium';
        else if (categoria === 'mujer-basic') folder = 'mujer';

        const images = this.cloudinaryUrls[folder] || [];
        const refLower = referencia.toLowerCase();

        // Buscar la imagen por referencia (sin extensión)
        let image = images.find(img => {
            const fileName = img.original.replace(/\.(jpg|jpeg|png|webp)$/i, '');
            return fileName.toLowerCase() === refLower;
        });

        // Si no se encuentra, buscar en ROOT
        if (!image && this.cloudinaryUrls.root) {
            const rootImages = this.cloudinaryUrls.root || [];
            image = rootImages.find(img => {
                const fileName = img.original.replace(/\.(jpg|jpeg|png|webp)$/i, '');
                return fileName.toLowerCase() === refLower;
            });
        }

        return image ? image.cloudinary : null;
    }

    /**
     * Construye la URL pública de Google Sheets
     */
    getSheetURL(sheetId = CONFIG.GOOGLE_SHEET_ID, sheetName = CONFIG.SHEET_NAME) {
        const baseURL = 'https://docs.google.com/spreadsheets/d';
        return `${baseURL}/${sheetId}/gviz/tq?tqx=out:json&sheet=${encodeURIComponent(sheetName)}`;
    }

    buildCacheKey(sheetId, sheetName) {
        return `${sheetId}::${sheetName}`.toLowerCase();
    }

    async obtenerTabla(sheetId = CONFIG.GOOGLE_SHEET_ID, sheetName = CONFIG.SHEET_NAME) {
        const cacheKey = this.buildCacheKey(sheetId, sheetName);
        const now = Date.now();
        const cacheEntry = this.cache[cacheKey];

        if (cacheEntry && (now - cacheEntry.time < this.CACHE_DURATION)) {
            console.log(`📦 Usando cache para hoja ${sheetName}`);
            return cacheEntry.data;
        }

        try {
            console.log(`🔄 Descargando datos de hoja ${sheetName}...`);
            const url = this.getSheetURL(sheetId, sheetName);
            const response = await fetch(url);
            const text = await response.text();
            const json = this.parseGoogleSheetsResponse(text);

            if (!json || !json.table) {
                throw new Error('Formato de respuesta inválido');
            }

            this.cache[cacheKey] = {
                data: json.table,
                time: now
            };

            return json.table;

        } catch (error) {
            console.error(`❌ Error al obtener hoja ${sheetName}:`, error);

            if (cacheEntry) {
                console.log('⚠️ Usando cache antiguo como fallback');
                return cacheEntry.data;
            }

            return null;
        }
    }

    /**
     * Obtiene todos los referidos desde Google Sheets
     * Usa cache para evitar múltiples llamadas
     */
    async obtenerReferidos() {
        const table = await this.obtenerTabla(CONFIG.GOOGLE_SHEET_ID, CONFIG.SHEET_NAME);
        if (!table) {
            return [];
        }

        const referidos = this.parseReferidos(table);
        console.log(`✅ ${referidos.length} referidos cargados`);
        return referidos;
    }

    async obtenerInventario() {
        const table = await this.obtenerTabla(CONFIG.INVENTARIO_SHEET_ID, CONFIG.INVENTARIO_SHEET_NAME);
        if (!table) {
            return [];
        }

        return this.parseInventario(table);
    }

    async obtenerTallas() {
        const table = await this.obtenerTabla(CONFIG.INVENTARIO_SHEET_ID, CONFIG.TALLAS_SHEET_NAME);
        if (!table) {
            return {};
        }

        return this.parseTallas(table);
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

    parseInventario(table) {
        const productos = [];
        const rows = table.rows;

        for (let i = 1; i < rows.length; i++) {
            const row = rows[i];
            if (!row.c) continue;

            const referencia = this.getCellValue(row.c[1]);
            if (!referencia) continue;

            const sexo = this.getCellValue(row.c[2]) || 'Unisex';
            const talla = this.getCellValue(row.c[3]) || 'Única';
            const estado = this.getCellValue(row.c[4]) || 'Único';
            const descripcion = this.getCellValue(row.c[5]) || `Referencia ${referencia}`;

            const categoria = this.mapSexoACategoria(sexo);

            // Intentar obtener URL de Cloudinary primero
            let imagen = this.getCloudinaryUrl(referencia, categoria);

            // Fallback a ruta local si no está en Cloudinary
            if (!imagen) {
                imagen = `./images/productos/${categoria}/${referencia.toLowerCase()}.png`;
            }

            const estadoNormalizado = estado.toLowerCase();

            productos.push({
                item: this.getCellValue(row.c[0]),
                id: referencia,
                referencia,
                sexo,
                talla,
                estado: estado,
                descripcion,
                nombre: descripcion,
                categoria,
                imagen,
                destacado: estadoNormalizado !== 'agotado'
            });
        }

        return productos;
    }

    parseTallas(table) {
        const tallas = {};
        const rows = table.rows;

        for (let i = 1; i < rows.length; i++) {
            const row = rows[i];
            if (!row.c) continue;

            const sexo = this.getCellValue(row.c[0]);
            const talla = this.getCellValue(row.c[1]);
            if (!sexo || !talla) continue;

            const key = this.getTallaKey(sexo, talla);
            tallas[key] = {
                sexo,
                talla,
                hombro: this.getCellValue(row.c[2]),
                pecho: this.getCellValue(row.c[3]),
                manga: this.getCellValue(row.c[4]),
                largo: this.getCellValue(row.c[5])
            };
        }

        return tallas;
    }

    mapSexoACategoria(sexo) {
        const sexoLower = (sexo || '').toLowerCase();
        if (sexoLower.includes('hombre')) {
            return 'hombre-premium';
        }
        return 'mujer-basic';
    }

    getTallaKey(sexo, talla) {
        return `${(sexo || '').toLowerCase()}-${(talla || '').toUpperCase()}`;
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
