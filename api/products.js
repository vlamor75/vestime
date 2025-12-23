module.exports = async (req, res) => {
    const CLOUD_NAME = 'dsw8wr69n';
    const API_KEY = '812572289299843';
    const API_SECRET = 'PEJjnRho2F3fnl7ut61MKsYlwSM';
    const auth = Buffer.from(API_KEY + ':' + API_SECRET).toString('base64');

    const categories = ['hombre', 'mujer', 'premium'];
    const results = {};

    try {
        for (const cat of categories) {
            const url = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/resources/image?prefix=vestime/${cat}&max_results=500`;
            const response = await fetch(url, {
                headers: {
                    'Authorization': 'Basic ' + auth
                }
            });
            const data = await response.json();
            results[cat] = data.resources.map(resource => ({
                original: resource.public_id.split('/').pop(),
                cloudinary: resource.secure_url,
                publicId: resource.public_id
            }));
        }
        res.status(200).json(results);
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ error: 'Error loading products' });
    }
};
