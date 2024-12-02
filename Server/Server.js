const path = require('path');
require('dotenv').config();
const express = require('express');
const { authenticateToken, authenticateAdmin } = require('./Middleware/authenticationToken');
const cors = require('cors');
const loginRoute = require('./Routes/UserRoute');
const db = require('./initializeDatabase');
const StripeRoute = require('./Routes/StripeRoute');
const product = require('./Routes/ProductRoute');
const orderRoute = require('./Routes/OrderRoute');
const shippingRoute = require('./Routes/ShippingRoute');

const app = express();

app.use(cors());
app.use(express.json());
app.use('/img/products', express.static(path.join(__dirname, '../../e-commerce/img/products')));
app.use(express.static(path.join(__dirname, '../TechJet')));

app.use('/api/product', product);
app.use('/api/stripe', StripeRoute);
app.use('/auth', loginRoute);
app.use('/api/orders', orderRoute);

app.get('/content_management.html', authenticateToken, authenticateAdmin, (req, res) => {
  res.sendFile(path.join(__dirname, '../../e-commerce/content_management.html'));
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
process.on('SIGINT', () => {
  db.close((err) => {
    if (err) {
      console.error('Error closing database:', err.message);
    } else {
      console.log('Database connection closed.');
    }
    process.exit(0);
  });
});
