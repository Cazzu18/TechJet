const express = require('express');
const router = express.Router();
const { authenticateToken, authenticateAdmin } = require('../Middleware/authenticationToken');
const { getAllProducts, getProductByCategoryId, addProduct, getProductById, updateProduct, deleteProduct, getAllCategories, filterProductByPrice, searchProducts, getProductReviews } = require('../Controllers/ProductController');

router.get('/', getAllProducts);
router.get('/category', getAllCategories);
router.get('/filter', filterProductByPrice); //use req.query with minPrice and maxPrice
router.get('/search', searchProducts); //use req.query
router.get('/category/:category_id', getProductByCategoryId); //category needs to be set in req.params.category_id
router.post('/', authenticateToken, authenticateAdmin, addProduct);
router.get('/:product_id', getProductById); //product needs to be set in req.params.product_id
router.put('/:product_id', authenticateToken, authenticateAdmin, updateProduct); //same as above
router.delete('/:product_id', authenticateToken, authenticateAdmin, deleteProduct); //also same
router.get('/:product_id/reviews', getProductReviews);



module.exports = router;


// post('/') needs to have name STRING, description STRING, price INT, stock_quantity INT, category_id INT, image_url STRING in JSON format
// put('/:product_id) also needs the same categories
// delete('/:product_id) needs to have product_id as the key and the product id number as the value in req.params
