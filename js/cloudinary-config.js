/**
 * Configuración de Cloudinary para VESTIME
 * Todas las imágenes se entregan optimizadas en WebP
 */

const CLOUDINARY_CONFIG = {
  cloudName: 'dsw8wr69n',
  baseUrl: 'https://res.cloudinary.com/dsw8wr69n/image/upload',
  folders: {
    hombre: 'vestime/hombre',
    mujer: 'vestime/mujer',
    premium: 'vestime/premium'
  }
};

/**
 * Genera URL optimizada para imágenes
 * @param {string} publicId - ID público de la imagen (ej: 'vestime/hombre/hb1')
 * @param {object} options - Opciones de transformación
 * @returns {string} URL optimizada
 */
function getOptimizedImageUrl(publicId, options = {}) {
  const {
    width = 'auto',
    quality = 'auto',
    format = 'webp',
    crop = 'limit',
    fetchFormat = 'auto'
  } = options;

  const transformations = [
    `f_${format}`,
    `q_${quality}`,
    width !== 'auto' ? `w_${width}` : null,
    `c_${crop}`,
    `f_${fetchFormat}`
  ].filter(Boolean).join(',');

  return `${CLOUDINARY_CONFIG.baseUrl}/${transformations}/${publicId}`;
}

/**
 * Genera múltiples tamaños de la misma imagen (responsive)
 * @param {string} publicId - ID público de la imagen
 * @returns {object} URLs para diferentes tamaños
 */
function getResponsiveImageUrls(publicId) {
  return {
    thumbnail: getOptimizedImageUrl(publicId, { width: 400, quality: 'auto:low' }),
    medium: getOptimizedImageUrl(publicId, { width: 800, quality: 'auto' }),
    large: getOptimizedImageUrl(publicId, { width: 1200, quality: 'auto:good' }),
    full: getOptimizedImageUrl(publicId, { width: 1920, quality: 'auto:best' }),
    original: getOptimizedImageUrl(publicId, { width: 'auto', quality: 'auto:best' })
  };
}

/**
 * Genera URL con placeholder blur (para lazy loading)
 * @param {string} publicId - ID público de la imagen
 * @returns {string} URL del placeholder
 */
function getPlaceholderUrl(publicId) {
  return `${CLOUDINARY_CONFIG.baseUrl}/w_50,e_blur:1000,q_auto:low,f_webp/${publicId}`;
}

/**
 * Obtiene imagen de producto por categoría y número
 * @param {string} category - 'hombre', 'mujer', 'premium'
 * @param {string} imageId - ID de la imagen (ej: 'hb1', 'mb5', 'hpmodel3')
 * @returns {string} URL optimizada
 */
function getProductImage(category, imageId) {
  const folder = CLOUDINARY_CONFIG.folders[category];
  const publicId = `${folder}/${imageId}`;
  return getOptimizedImageUrl(publicId);
}

/**
 * Carga todas las imágenes de una categoría desde el JSON
 * @param {string} category - 'hombre', 'mujer', 'premium'
 * @returns {Promise<Array>} Array de URLs optimizadas
 */
async function loadCategoryImages(category) {
  try {
    const response = await fetch('/cloudinary-urls.json');
    const data = await response.json();

    if (!data[category]) {
      console.error(`Categoría ${category} no encontrada`);
      return [];
    }

    return data[category].map(img => {
      // Extraer el publicId correcto
      const publicId = img.publicId;

      return {
        id: img.original,
        publicId: publicId,
        urls: getResponsiveImageUrls(publicId),
        placeholder: getPlaceholderUrl(publicId),
        isModel: img.original.includes('model')
      };
    });
  } catch (error) {
    console.error('Error cargando imágenes:', error);
    return [];
  }
}

// Exportar para uso en otros archivos
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    CLOUDINARY_CONFIG,
    getOptimizedImageUrl,
    getResponsiveImageUrls,
    getPlaceholderUrl,
    getProductImage,
    loadCategoryImages
  };
}
