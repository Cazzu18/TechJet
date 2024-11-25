const db = require('../initializeDatabase');

const getAllProducts = (req, res) => {
    db.all(`SELECT * FROM product`, (err, rows) => {
        if (err) {
            return res.status(500).json({ error: 'Error retrieving products' });
        }
        res.status(200).json({ products: rows });
    });
};

const getProductByCategoryId= (req, res) => {
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





module.exports = {
    getAllProducts,
    getProductByCategoryId,

};