const cloudinary = require('cloudinary').v2;

// Configuración desde variables de entorno en Vercel
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

async function getAllImagesFromFolder(prefix) {
    let allResources = [];
    let nextCursor = null;

    do {
        const options = {
            type: 'upload',
            prefix,
            max_results: 500,
            resource_type: 'image'
        };

        if (nextCursor) {
            options.next_cursor = nextCursor;
        }

        const result = await cloudinary.api.resources(options);
        allResources = allResources.concat(result.resources || []);
        nextCursor = result.next_cursor;
    } while (nextCursor);

    return allResources;
}

module.exports = async (req, res) => {
    try {
        if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
            console.error('Cloudinary env vars missing');
            return res.status(500).json({ error: 'Cloudinary configuration missing' });
        }

        // Cargar imágenes por carpeta
        const [hombreImages, mujerImages, premiumImages] = await Promise.all([
            getAllImagesFromFolder('vestime/hombre'),
            getAllImagesFromFolder('vestime/mujer'),
            getAllImagesFromFolder('vestime/premium')
        ]);

        const mapImages = (images) => (images || []).map(img => ({
            original: img.public_id.split('/').pop(),
            cloudinary: img.secure_url,
            publicId: img.public_id
        }));

        const payload = {
            hombre: mapImages(hombreImages),
            mujer: mapImages(mujerImages),
            premium: mapImages(premiumImages)
        };

        res.status(200).json(payload);
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ error: 'Error loading products' });
    }
};
