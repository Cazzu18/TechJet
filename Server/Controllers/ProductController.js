const db = require('../initializeDatabase');

const getAllProducts = (req, res) => {
    db.all(`SELECT * FROM product`, (err, rows) => {
        if (err) {
            return res.status(500).json({ error: 'Error retrieving products' });
        }
        res.status(200).json({ products: rows });
    });
};

const getProductByCategoryId = (req, res) => {
    const category_id = req.params.category_id;
    
    db.all(`SELECT * FROM product WHERE category_id = ?`,
        [category_id],
        (err, rows) => {
            if(err){
                return res.status(500).json({error: 'Error retrieving products'});
            }
            if(rows.length === 0) {
                return res.status(404).json({message: 'No products found!'});
            }
            res.status(200).json({products: rows});
    });
};

const addProduct = (req, res) => {
    const { name, description, price, stock_quantity, category_id, image_url } = req.body;
    db.run(`
        INSERT INTO product(name, description, price, stock_quantity, category_id, image_url)
        VALUES(?, ?, ?, ?, ?, ?)`,
        [name, description, price, stock_quantity, category_id, image_url],
        function (err){
            if(err){
                return res.status(500).json({error: "Error adding a new product"});
            }
            return res.status(200).json({message: `${name} added successfully`});
        }
    )
};  

const getProductById = (req, res) => {
    const productId = req.params.product_id;
    db.get(`
        SELECT 1 FROM product WHERE product_id = ?`,
    [productId],
    function(err, row){
        if(err){
            return res.status(500).json({error: "Error searching database"});
        }
        if(!row){
            return res.status(404).json({message: "Not Found"});
        }
        return res.status(200).json({message: "Successfully found product by id", product: row});
    })
};

const updateProduct = (req, res) => {
    const productId = req.params.product_id;
    const { name, price, description, category_id } = req.body;

    db.run(
        `UPDATE product SET name = ?, price = ?, description = ?, category_id = ? WHERE product_id = ?`,
        [name, price, description, category_id, productId],
        function (err) {
            if (err) {
                return res.status(500).json({ error: "Error updating product" });
            }
            if (this.changes === 0) {
                return res.status(404).json({ message: "Product not found" });
            }
            return res.status(200).json({ message: "Product updated successfully" });
        }
    );
};


const deleteProduct = (req, res) => {
    const productId = req.params.product_id;

    db.run(
        `DELETE FROM product WHERE product_id = ?`,
        [productId],
        function (err) {
            if (err) {
                return res.status(500).json({ error: "Error deleting product" });
            }
            if (this.changes === 0) {
                return res.status(404).json({ message: "Product not found" });
            }
            return res.status(200).json({ message: "Product deleted successfully" });
        }
    );
};


const getAllCategories = (req, res) => {
    db.all(`SELECT * FROM category`, [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: "Error retrieving categories" });
        }
        return res.status(200).json({ categories: rows });
    });
};


const filterProductByPrice = (req, res) => {
    const { minPrice, maxPrice } = req.query;

    db.all(
        `SELECT * FROM product WHERE price BETWEEN ? AND ?`,
        [minPrice, maxPrice],
        (err, rows) => {
            if (err) {
                return res.status(500).json({ error: "Error filtering products by price" });
            }
            return res.status(200).json({ products: rows });
        }
    );
};


const searchProducts = (req, res) => {
    const { query } = req.query;

    db.all(
        `SELECT * FROM product WHERE name LIKE ? OR description LIKE ?`,
        [`%${query}%`, `%${query}%`],
        (err, rows) => {
            if (err) {
                return res.status(500).json({ error: "Error searching for products" });
            }
            return res.status(200).json({ products: rows });
        }
    );
};


const getProductReviews = (req, res) => {
    const productId = req.params.product_id;

    db.all(
        `SELECT * FROM reviews WHERE product_id = ?`,
        [productId],
        (err, rows) => {
            if (err) {
                return res.status(500).json({ error: "Error retrieving product reviews" });
            }
            return res.status(200).json({ reviews: rows });
        }
    );
};


module.exports = {
    getAllProducts,
    getProductByCategoryId,
    addProduct, 
    getProductById,
    updateProduct,
    deleteProduct,
    getAllCategories,
    filterProductByPrice,
    searchProducts,
    getProductReviews,

};