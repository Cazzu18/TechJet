const db = require('../initializeDatabase');

const getOrderById = (req, res) => {
    const orderId = req.params.order_id;

    const query = `
        SELECT o.order_id, o.user_id, o.total_amount, o.status, o.order_date, 
               p.product_id, p.name AS product_name, p.price, oi.quantity, 
               s.shipping_address, s.shipping_status, s.shipping_date
        FROM orders o
        LEFT JOIN orderInfo oi ON o.order_id = oi.order_id
        LEFT JOIN product p ON oi.product_id = p.product_id
        LEFT JOIN shipping s ON o.order_id = s.order_id
        WHERE o.order_id = ?`;

    db.all(query, [orderId], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: "Error retrieving order details" });
        }
        if (!rows.length) {
            return res.status(404).json({ message: "Order not found" });
        }
        const orderDetails = {
            order_id: rows[0].order_id,
            user_id: rows[0].user_id,
            total_amount: rows[0].total_amount,
            status: rows[0].status,
            order_date: rows[0].order_date,
            shipping: {
                address: rows[0].shipping_address,
                status: rows[0].shipping_status,
                date: rows[0].shipping_date
            },
            products: rows.map(row => ({
                product_id: row.product_id,
                name: row.product_name,
                price: row.price,
                quantity: row.quantity
            }))
        };

        return res.status(200).json(orderDetails);
    });
};

const getAllOrders = (req, res) => {
    const query = `
        SELECT o.order_id, o.user_id, o.total_amount, o.status, o.order_date
        FROM orders o`;
    db.all(query, [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: "Error retrieving orders" });
        }
        return res.status(200).json({ orders: rows });
    });
};

const alterOrder = (req, res) => {
    const orderId = req.params.order_id;
    const { status } = req.body;
    const query = `UPDATE orders SET status = ? WHERE order_id = ?`;
    db.run(query, [status, orderId], function (err) {
        if (err) {
            return res.status(500).json({ error: "Error updating order status" });
        }
        if (this.changes === 0) {
            return res.status(404).json({ message: "Order not found" });
        }
        return res.status(200).json({ message: "Order status updated successfully" });
    });
};


const createNewOrder = (req, res) => {
    const { user_id, products, total_amount, order_date, shipping_address } = req.body;
    db.serialize(() => {
        db.run(
            `INSERT INTO orders (user_id, total_amount, status, order_date) VALUES (?, ?, ?, ?)`,
            [user_id, total_amount, "Pending", order_date],
            function (err) {
                if (err) {
                    return res.status(500).json({ error: "Error creating order" });
                }
                const orderId = this.lastID;
                const orderInfoStmt = db.prepare(
                    `INSERT INTO orderInfo (order_id, product_id, quantity) VALUES (?, ?, ?)`
                );
                products.forEach(product => {
                    orderInfoStmt.run(orderId, product.product_id, product.quantity);
                });
                orderInfoStmt.finalize();
                if (shipping_address) {
                    db.run(
                        `INSERT INTO shipping (order_id, shipping_address, shipping_status, shipping_date) VALUES (?, ?, ?, ?)`,
                        [orderId, shipping_address, "Pending", new Date().toISOString()],
                        err => {
                            if (err) {
                                return res.status(500).json({ error: "Error adding shipping details" });
                            }
                        }
                    );
                }
                return res.status(201).json({ message: "Order created successfully", order_id: orderId });
            }
        );
    });
};


const deleteOrder = (req, res) => {
    const orderId = req.params.order_id;
    db.serialize(() => {
        db.run(`DELETE FROM orderInfo WHERE order_id = ?`, [orderId], err => {
            if (err) {
                return res.status(500).json({ error: "Error deleting order items" });
            }
        });
        db.run(`DELETE FROM shipping WHERE order_id = ?`, [orderId], err => {
            if (err) {
                return res.status(500).json({ error: "Error deleting shipping details" });
            }
        });
        db.run(`DELETE FROM orders WHERE order_id = ?`, [orderId], function (err) {
            if (err) {
                return res.status(500).json({ error: "Error deleting order" });
            }
            if (this.changes === 0) {
                return res.status(404).json({ message: "Order not found" });
            }
            return res.status(200).json({ message: "Order deleted successfully" });
        });
    });
};


module.exports = {
    getOrderById, 
    getAllOrders,
    alterOrder,
    createNewOrder,
    deleteOrder
}