require('dotenv').config();
const express = require('express');
const loginRoute = require('./Routes/LoginRoute');
const db = require('./initializeDatabase');

const app = express();
app.use(express.json());

app.use('/auth', loginRoute);
console.log(process.env.JWT_SECRET);
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
