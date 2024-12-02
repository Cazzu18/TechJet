const express = require('express');
const path = require('path');
const router = express.Router();
const { authenticateToken, authenticateAdmin } = require('../Middleware/authenticationToken');
const { getAllProducts, deleteCategory, getProductByCategoryId, addProduct, getProductById, updateProduct, deleteProduct, getAllCategories, filterProductByPrice, searchProducts, getProductReviews } = require('../Controllers/ProductController');
const multer = require("multer");

// Configure multer to store images in a specific folder
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, '../../e-commerce/img/products'); // Specify the directory for uploaded images
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Unique file name
    }
});

const upload = multer({ storage: storage });

// Endpoint to handle image upload
router.post('../../e-commerce/img/products', upload.single('image'), (req, res) => {
    if (req.file) {
        // Respond with the URL of the uploaded image
        res.json({ url: `/uploads/${req.file.filename}` });
    } else {
        res.status(400).json({ error: 'No file uploaded' });
    }
});

// Update route to handle file upload
router.put('/:product_id', authenticateToken, authenticateAdmin, updateProduct);



router.get('/', getAllProducts);
router.get('/category', getAllCategories);
router.get('/filter', filterProductByPrice); //use req.query with minPrice and maxPrice
router.get('/search', searchProducts); //use req.query
router.get('/category/:category_id', getProductByCategoryId); //category needs to be set in req.params.category_id
router.delete('/category/:category_id', authenticateToken, authenticateAdmin, deleteCategory);
router.post('/', authenticateToken, authenticateAdmin, addProduct);
router.get('/:product_id', getProductById); //product needs to be set in req.params.product_id
router.delete('/:product_id', authenticateToken, authenticateAdmin, deleteProduct); //also same
router.get('/:product_id/reviews', getProductReviews);



module.exports = router;


// post('/') needs to have name STRING, description STRING, price INT, stock_quantity INT, category_id INT, image_url STRING in JSON format
// put('/:product_id) also needs the same categories
// delete('/:product_id) needs to have product_id as the key and the product id number as the value in req.params
