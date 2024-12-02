const express = require('express');
const router = express.Router();
const { authenticateToken, authenticateAdmin } = require('../Middleware/authenticationToken');
const { getOrderById, getAllOrders, alterOrder, createNewOrder, deleteOrder } = require('../Controllers/OrderController');

router.get('/', authenticateToken, getAllOrders);
router.get('/:order_id', authenticateToken, getOrderById);
router.put('/:order_id', authenticateToken, authenticateAdmin, alterOrder);
router.post('/', authenticateToken, createNewOrder);
router.delete('/:order_id', authenticateToken, authenticateAdmin, deleteOrder);

module.exports = router;

//put('/:order_id') needs to have req.params.order_id and needs to have req.body contain status:

//post('/') needs to have the following JSON fields; user_id, products, total_amount, order_date, shipping_address
//products needs to be an array of objects with product_id and quantity as the two values

