const express = require('express');
const router = express.Router();
const authenticateToken = require('../Middleware/authenticationToken');
const { getAllProducts, getProductByCategoryId, addProduct, getProductById, updateProduct, deleteProduct } = require('../Controllers/ProductController');
// Define your routes
router.get('/', getAllProducts);
router.get('/category/:category_id', getProductByCategoryId); //category needs to be set in req.params.category_id
router.post('/', addProduct);
router.get('/:product_id', getProductById); //product needs to be set in req.params.product_id
router.put('/:product_id', updateProduct); //same as above
router.delete('/:product_id', deleteProduct); //also same
router.get('/category', getAllCategories);
router.get('/filter', filterProductByPrice); //use req.query with minPrice and MaxPrice
router.get('/search', searchProducts); //use req.query
router.get('/:product_id/reviews', getProductReviews);



module.exports = router;