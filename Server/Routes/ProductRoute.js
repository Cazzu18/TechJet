const express = require('express');
const path = require('path');
const router = express.Router();
const { authenticateToken, authenticateAdmin } = require('../Middleware/authenticationToken');
const { getAllProducts, deleteCategory, getProductByCategoryId, addProduct, getProductById, updateProduct, deleteProduct, getAllCategories, filterProductByPrice, searchProducts, getProductReviews } = require('../Controllers/ProductController');
const multer = require("multer");

// Configure multer to store images in the 'e-commerce/img/products' folder
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../../e-commerce/img/products'));
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname); // Retain the original name
    },
});

const upload = multer({ storage: storage });

// Endpoint to handle image upload
router.post('/upload', upload.single('image'), (req, res) => {
    console.log("upload", req.file);
    if (req.file) {
        const relativePath = `img/products/${req.file.filename}`; // No leading '/'
        res.status(200).json({ url: relativePath });
    } else {
        res.status(400).json({ error: 'No file uploaded' });
    }
});

// Update route to handle file upload
router.put('/:product_id', authenticateToken, authenticateAdmin, upload.single('image'), updateProduct);

router.post('/', upload.single('image'), (req, res) => {
    const { name, description, price, stock_quantity, category_id, image_url } = req.body;

    // Call the addProduct function to add the product to the database
    addProduct({ name, description, price, stock_quantity, category_id, image_url }, (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to add product' });
        }

        return res.status(200).json({ message: 'Product added successfully', product: result });
    });
});


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
