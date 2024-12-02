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

const addProduct = (productData, callback) => {
    const { name, description, price, stock_quantity, category_id, image_url } = productData;

    db.run(`
        INSERT INTO product(name, description, price, stock_quantity, category_id, image_url)
        VALUES(?, ?, ?, ?, ?, ?)`,
        [name, description, price, stock_quantity, category_id, image_url],
        function (err) {
            if (err) {
                return callback(err, null);
            }
            return callback(null, { product_id: this.lastID, name, description, price, stock_quantity, category_id, image_url });
        }
    );
};

const getProductById = (req, res) => {
    const productId = req.params.product_id;
    db.get(`
        SELECT * FROM product WHERE product_id = ?`,
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
    const { name, description, price, stock_quantity, category_id} = req.body;

    let image_url = req.body.image_url; // Default to existing URL

    if (req.file) {
        image_url = `img/products/${req.file.filename}`; // Correct relative path
    }


    db.run(
        `UPDATE product SET name = ?, description = ?, price = ?, stock_quantity = ?, category_id = ?, image_url = ?  WHERE product_id = ?`,
        [name, description, price, stock_quantity, category_id, image_url, productId],
        function (err) {
            if (err) {
                return res.status(500).json({ error: "Error updating product", err });
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
    const minPrice = req.query.minPrice;
    const maxPrice = req.query.maxPrice;

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
    console.log(productId);
    db.all(
        `SELECT * FROM review WHERE product_id = ?`,
        [productId],
        (err, rows) => {
            if (err) {
                return res.status(500).json({ error: "Error retrieving product reviews" });
            }
            if(!rows){
                return res.status(404).json({message: "Cannot find reviews"});
            }
            return res.status(200).json({ reviews: rows });
        }
    );
};

const deleteCategory = (req, res) => {
    const { category_id } = req.params;
    db.get(
        `SELECT * FROM category WHERE category_id = ?`,
        [category_id],
        (err, row) => {
            if (err) {
                return res.status(500).json({ error: "Error searching for category" });
            }
            if (!row) {
                return res.status(404).json({ message: "Category not found" });
            }
            db.get(
                `SELECT * FROM product WHERE category_id = ?`,
                [category_id],
                (err, productRow) => {
                    if (err) {
                        return res.status(500).json({ error: "Error checking for products in category" });
                    }

                    if (productRow) {
                        return res.status(400).json({ message: "Cannot delete category with associated products" });
                    }
                    db.run(
                        `DELETE FROM category WHERE category_id = ?`,
                        [category_id],
                        function (err) {
                            if (err) {
                                return res.status(500).json({ error: "Error deleting category" });
                            }
                            return res.status(200).json({ message: "Category deleted successfully" });
                        }
                    );
                }
            );
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
    deleteCategory
};