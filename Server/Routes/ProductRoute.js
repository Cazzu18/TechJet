const express = require('express');
const router = express.Router();
const { authenticateToken, authenticateAdmin } = require('../Middleware/authenticationToken');
const { getAllProducts, getProductByCategoryId, addProduct, getProductById, updateProduct, deleteProduct, getAllCategories, filterProductByPrice, searchProducts, getProductReviews } = require('../Controllers/ProductController');

router.get('/', getAllProducts);
router.get('/category/:category_id', getProductByCategoryId); //category needs to be set in req.params.category_id
router.post('/', authenticateToken, authenticateAdmin, addProduct);
router.get('/:product_id', getProductById); //product needs to be set in req.params.product_id
router.put('/:product_id', authenticateToken, authenticateAdmin, updateProduct); //same as above
router.delete('/:product_id', authenticateToken, authenticateAdmin, deleteProduct); //also same
router.get('/category', getAllCategories);
router.get('/filter', filterProductByPrice); //use req.query with minPrice and MaxPrice
router.get('/search', searchProducts); //use req.query
router.get('/:product_id/reviews', getProductReviews);



module.exports = router;