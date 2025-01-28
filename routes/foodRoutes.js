// import express from 'express';
// import { addFood, listFood, removeFood } from '../controllers/foodController.js';
// import multer from 'multer';

// const foodRouter = express.Router();

// // Image storage engine using the writable `/tmp` directory
// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, '/tmp'); // Use `/tmp` directory for uploads
//     },
//     filename: (req, file, cb) => {
//         cb(null, `${Date.now()}-${file.originalname}`);
//     }
// });

// const upload = multer({ storage: storage });

// foodRouter.post('/add', upload.single('image'), addFood);
// foodRouter.get('/list', listFood);
// foodRouter.post('/remove', removeFood);

// export default foodRouter;
import express from 'express';
import { addFood, listFood, removeFood } from '../controllers/foodController.js';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

// Configure Cloudinary
cloudinary.config({
    cloud_name: 'dax0v3itz', // Replace with your Cloudinary cloud name
    api_key: '134681623858472',       // Replace with your Cloudinary API key
    api_secret: 'l3cJvwJB348adEwr_q9-KGGZrNY', // Replace with your Cloudinary API secret
});

// Configure Cloudinary storage for multer
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'food-images', // Folder in Cloudinary to store images
        allowed_formats: ['jpg', 'jpeg', 'png'], // Allowed image formats
        use_filename: true, // Use the original file name
        unique_filename: false, // Prevent Cloudinary from adding unique strings to filenames
    },
});

const upload = multer({ storage: storage });

const foodRouter = express.Router();

foodRouter.post('/add', upload.single('image'), addFood);
foodRouter.get('/list', listFood);
foodRouter.post('/remove', removeFood);

export default foodRouter;
