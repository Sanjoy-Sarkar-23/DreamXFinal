const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');


cloudinary.config({
    cloud_name: 'dkvagwo5f',
    api_key: '359213986746489',
    api_secret: 'TwyRBgNkaZXmiVhXr9t1sPVbYQ8'
});



const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'dreamX',
        allowerdFormats: ["png", "jpg", "jpeg"]
    },
});

module.exports = {
    cloudinary,
    storage,
}