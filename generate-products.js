const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const path = require('path');

cloudinary.config({
  cloud_name: 'dsw8wr69n',
  api_key: '392983564963296',
  api_secret: 'fWrqHzclliFQwmG1WisTBMmp-W0'
});

/**
 * Obtiene TODAS las imágenes de una carpeta (maneja paginación)
 */
async function getAllImagesFromFolder(prefix) {
  let allResources = [];
  let nextCursor = null;

  do {
    const options = {
      type: 'upload',
      prefix: prefix,
      max_results: 500,
      resource_type: 'image'
    };

    if (nextCursor) {
      options.next_cursor = nextCursor;
    }

    const result = await cloudinary.api.resources(options);
    allResources = allResources.concat(result.resources);
    nextCursor = result.next_cursor;

  } while (nextCursor);

  return allResources;
}

async function generateProducts() {
  try {
    console.log('🚀 Generando productos desde Cloudinary...\n');

    // Obtener todas las imágenes
    const allImages = await cloudinary.api.resources({
      type: 'upload',
      max_results: 500,
      resource_type: 'image'
    });

    const productos = [];
    let itemCount = 1;

    // Filtrar solo imágenes en ROOT que parecen productos (números)
    const rootImages = allImages.resources.filter(img =>
      !img.public_id.includes('/') &&
      !img.public_id.includes('sample') &&
      !img.public_id.includes('cld-')
    );

    console.log(`📦 Encontradas ${rootImages.length} imágenes en ROOT`);

    rootImages.forEach(img => {
      productos.push({
        item: itemCount++,
        id: img.public_id,
        referencia: img.public_id,
        sexo: 'Hombre',
        talla: 'M',
        estado: 'Único',
        descripcion: `Camiseta Vestime ${img.public_id}`,
        nombre: `Camiseta Vestime ${img.public_id}`,
        categoria: 'hombre-premium',
        imagen: img.secure_url,
        destacado: true
      });
    });

    // Obtener TODAS las imágenes de vestime/hombre
    const hombreImages = await getAllImagesFromFolder('vestime/hombre');

    console.log(`📦 Encontradas ${hombreImages.length} imágenes en vestime/hombre`);

    hombreImages.forEach(img => {
      const fileName = path.basename(img.public_id);
      productos.push({
        item: itemCount++,
        id: fileName,
        referencia: fileName,
        sexo: 'Hombre',
        talla: 'M',
        estado: 'Único',
        descripcion: `Camiseta Vestime ${fileName}`,
        nombre: `Camiseta Vestime ${fileName}`,
        categoria: 'hombre-premium',
        imagen: img.secure_url,
        destacado: true
      });
    });

    // Obtener TODAS las imágenes de vestime/premium
    const premiumImages = await getAllImagesFromFolder('vestime/premium');

    console.log(`📦 Encontradas ${premiumImages.length} imágenes en vestime/premium`);

    premiumImages.forEach(img => {
      const fileName = path.basename(img.public_id);
      productos.push({
        item: itemCount++,
        id: fileName,
        referencia: fileName,
        sexo: 'Hombre',
        talla: 'L',
        estado: 'Único',
        descripcion: `Camiseta Premium ${fileName}`,
        nombre: `Camiseta Premium ${fileName}`,
        categoria: 'hombre-premium',
        imagen: img.secure_url,
        destacado: true
      });
    });

    // Obtener TODAS las imágenes de vestime/mujer
    const mujerImages = await getAllImagesFromFolder('vestime/mujer');

    console.log(`📦 Encontradas ${mujerImages.length} imágenes en vestime/mujer\n`);

    mujerImages.forEach(img => {
      const fileName = path.basename(img.public_id);
      productos.push({
        item: itemCount++,
        id: fileName,
        referencia: fileName,
        sexo: 'Mujer',
        talla: 'M',
        estado: 'Único',
        descripcion: `Camiseta Vestime ${fileName}`,
        nombre: `Camiseta Vestime ${fileName}`,
        categoria: 'mujer-basic',
        imagen: img.secure_url,
        destacado: true
      });
    });

    // === Generar cloudinary-urls.json para el frontend ===
    const cloudinaryUrls = {
      hombre: hombreImages.map(img => ({
        original: path.basename(img.public_id) + path.extname(img.secure_url),
        cloudinary: img.secure_url,
        publicId: img.public_id
      })),
      premium: premiumImages.map(img => ({
        original: path.basename(img.public_id) + path.extname(img.secure_url),
        cloudinary: img.secure_url,
        publicId: img.public_id
      })),
      mujer: mujerImages.map(img => ({
        original: path.basename(img.public_id) + path.extname(img.secure_url),
        cloudinary: img.secure_url,
        publicId: img.public_id
      }))
    };

    // Guardar productos.json
    const productosPath = path.join(__dirname, 'productos.json');
    fs.writeFileSync(productosPath, JSON.stringify(productos, null, 2));

    // Guardar cloudinary-urls.json
    const cloudinaryUrlsPath = path.join(__dirname, 'cloudinary-urls.json');
    fs.writeFileSync(cloudinaryUrlsPath, JSON.stringify(cloudinaryUrls, null, 2));

    console.log('========================================');
    console.log('✅ PRODUCTOS.JSON GENERADO');
    console.log('✅ CLOUDINARY-URLS.JSON GENERADO');
    console.log('========================================');
    console.log(`📄 productos.json: ${productosPath}`);
    console.log(`📄 cloudinary-urls.json: ${cloudinaryUrlsPath}`);
    console.log(`📦 Total de productos: ${productos.length}`);
    console.log('\nProductos por categoría:');
    console.log(`  - Hombre Premium: ${productos.filter(p => p.categoria === 'hombre-premium').length}`);
    console.log(`  - Mujer Basic: ${productos.filter(p => p.categoria === 'mujer-basic').length}`);
    console.log('========================================\n');

    // Mostrar algunos ejemplos
    console.log('📸 Ejemplos de productos generados:');
    productos.slice(0, 3).forEach(p => {
      console.log(`\n  Producto: ${p.nombre}`);
      console.log(`  Referencia: ${p.referencia}`);
      console.log(`  Imagen: ${p.imagen}`);
    });

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

generateProducts();
