const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./Database/database.db');  // Adjust the path to your actual SQLite DB

// Function to insert users into the users table
const insertUsers = () => {
  const query = `
    INSERT INTO users (username, email, password, first_name, last_name, address, is_admin)
    VALUES 
    ('johndoe', 'johndoe@example.com', 'password123', 'John', 'Doe', '1234 Elm St, Springfield', 0),
    ('janedoe', 'janedoe@example.com', 'password456', 'Jane', 'Doe', '5678 Oak St, Springfield', 0),
    ('bobsmith', 'bobsmith@example.com', 'password789', 'Bob', 'Smith', '91011 Pine St, Springfield', 0),
    ('alicejones', 'alicejones@example.com', 'passwordabc', 'Alice', 'Jones', '1213 Maple St, Springfield', 0),
    ('charliebrown', 'charliebrown@example.com', 'passwordxyz', 'Charlie', 'Brown', '1415 Birch St, Springfield', 0);
  `;
  db.run(query, function (err) {
    if (err) {
      console.error("Error inserting users: ", err.message);
    } else {
      console.log("5 users added to the users table");
    }
  });
};

// Function to insert categories into the category table
const insertCategories = () => {
  const query = `
    INSERT INTO category (name) 
    VALUES 
    ('Electronics'),
    ('Clothing'),
    ('Books'),
    ('Toys'),
    ('Home & Kitchen');
  `;
  db.run(query, function (err) {
    if (err) {
      console.error("Error inserting categories: ", err.message);
    } else {
      console.log("5 categories added to the category table");
    }
  });
};

// Function to insert products into the product table
const insertProducts = () => {
  const query = `
    INSERT INTO product (name, description, price, stock_quantity, category_id, image_url)
    VALUES 
    ('Smartphone', 'Latest model smartphone', 799.99, 50, 1, 'https://example.com/smartphone.jpg'),
    ('T-shirt', 'Comfortable cotton t-shirt', 19.99, 200, 2, 'https://example.com/tshirt.jpg'),
    ('Book', 'Bestselling novel', 14.99, 100, 3, 'https://example.com/book.jpg'),
    ('Action Figure', 'Collectible action figure', 24.99, 30, 4, 'https://example.com/actionfigure.jpg'),
    ('Coffee Maker', 'Brews your morning coffee', 49.99, 70, 5, 'https://example.com/coffeemaker.jpg');
  `;
  db.run(query, function (err) {
    if (err) {
      console.error("Error inserting products: ", err.message);
    } else {
      console.log("5 products added to the product table");
    }
  });
};

// Function to insert orders into the orders table
const insertOrders = () => {
  const query = `
    INSERT INTO orders (user_id, total_amount, status, order_date)
    VALUES 
    (1, 849.99, 'Pending', '2024-11-25'),
    (2, 59.99, 'Shipped', '2024-11-20'),
    (3, 39.99, 'Delivered', '2024-11-22'),
    (4, 104.99, 'Pending', '2024-11-24'),
    (5, 54.99, 'Shipped', '2024-11-21');
  `;
  db.run(query, function (err) {
    if (err) {
      console.error("Error inserting orders: ", err.message);
    } else {
      console.log("5 orders added to the orders table");
    }
  });
};

// Function to insert orderInfo into the orderInfo table
const insertOrderInfo = () => {
  const query = `
    INSERT INTO orderInfo (order_id, product_id, quantity)
    VALUES 
    (1, 1, 1),
    (2, 2, 2),
    (3, 3, 1),
    (4, 4, 3),
    (5, 5, 1);
  `;
  db.run(query, function (err) {
    if (err) {
      console.error("Error inserting orderInfo: ", err.message);
    } else {
      console.log("5 orderInfo entries added to the orderInfo table");
    }
  });
};

// Function to insert payment data into the payment table
const insertPayments = () => {
  const query = `
    INSERT INTO payment (order_id, amount, payment_date, payment_method)
    VALUES 
    (1, 849.99, '2024-11-25', 'Credit Card'),
    (2, 59.99, '2024-11-20', 'PayPal'),
    (3, 39.99, '2024-11-22', 'Credit Card'),
    (4, 104.99, '2024-11-24', 'Debit Card'),
    (5, 54.99, '2024-11-21', 'PayPal');
  `;
  db.run(query, function (err) {
    if (err) {
      console.error("Error inserting payments: ", err.message);
    } else {
      console.log("5 payments added to the payment table");
    }
  });
};

// Function to insert reviews into the review table
const insertReviews = () => {
  const query = `
    INSERT INTO review (user_id, product_id, rating, review_text, review_date)
    VALUES 
    (1, 1, 5, 'Great smartphone, fast performance!', '2024-11-25'),
    (2, 2, 4, 'Comfortable but fits a bit small.', '2024-11-20'),
    (3, 3, 3, 'Interesting read, but predictable plot.', '2024-11-22'),
    (4, 4, 5, 'My son loves this action figure!', '2024-11-24'),
    (5, 5, 4, 'Good coffee maker, easy to use.', '2024-11-21');
  `;
  db.run(query, function (err) {
    if (err) {
      console.error("Error inserting reviews: ", err.message);
    } else {
      console.log("5 reviews added to the review table");
    }
  });
};

// Function to insert shipping info into the shipping table
const insertShipping = () => {
  const query = `
    INSERT INTO shipping (order_id, shipping_address, shipping_status, shipping_date)
    VALUES 
    (1, '1234 Elm St, Springfield', 'In Transit', '2024-11-26'),
    (2, '5678 Oak St, Springfield', 'Delivered', '2024-11-22'),
    (3, '91011 Pine St, Springfield', 'Delivered', '2024-11-23'),
    (4, '1213 Maple St, Springfield', 'In Transit', '2024-11-25'),
    (5, '1415 Birch St, Springfield', 'Shipped', '2024-11-21');
  `;
  db.run(query, function (err) {
    if (err) {
      console.error("Error inserting shipping: ", err.message);
    } else {
      console.log("5 shipping entries added to the shipping table");
    }
  });
};

// Execute all functions to insert data
insertUsers();
insertCategories();
insertProducts();
insertOrders();
insertOrderInfo();
insertPayments();
insertReviews();
insertShipping();

// Close the database connection after all operations
db.close((err) => {
  if (err) {
    console.error("Error closing database: ", err.message);
  } else {
    console.log("Database connection closed");
  }
});