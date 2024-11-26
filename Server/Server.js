const path = require('path');
require('dotenv').config();
const express = require('express');
const loginRoute = require('./Routes/UserRoute');
const db = require('./initializeDatabase');
const StripeRoute = require('./Routes/StripeRoute');
const product = require('./Routes/ProductRoute');
const orderRoute = require('./Routes/OrderRoute');
const shippingRoute = require('./Routes/ShippingRoute');

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, '../e-commerce')));

app.use('/api/stripe', StripeRoute);
app.use('/api/product', product);
app.use('/auth', loginRoute);
app.use('/api/orders', orderRoute);


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
