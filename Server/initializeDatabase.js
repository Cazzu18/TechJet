const express = require('express');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

const dbPath = path.resolve(__dirname, 'Database', 'database.db');
const db = new sqlite3.Database(dbPath, (err) => {
    if(err){
        console.error('Error connecting to database: ', err);
    } else {
        console.log('Connected to database');
        intializeDatabase();
    }
});

function intializeDatabase() {
    db.serialize(() => {
        db.run(
            `CREATE TABLE IF NOT EXISTS users(
            user_id INTEGER PRIMARY KEY AUTOINCREMENT,
            username VARCHAR(50) UNIQUE NOT NULL,
            email VARCHAR(50) UNIQUE NOT NULL, 
            password VARCHAR(50) NOT NULL,
            first_name VARCHAR(50) NOT NULL,
            last_name VARCHAR(50) NOT NULL,
            address VARCHAR(255) NOT NULL,
            is_admin BOOLEAN DEFAULT 0
            );`,
            (err) => {
                if(err){
                    console.error("Error creating table: ", err.message);
                } else {
                    console.log("users table checked/created");
                }
            }
        );

        db.run(
            `CREATE TABLE IF NOT EXISTS product(
            product_id INTEGER PRIMARY KEY AUTOINCREMENT,
            name VARCHAR(255) NOT NULL,
            description TEXT NOT NULL,
            price NUMERIC NOT NULL CHECK(price = round(price, 2)),
            stock_quantity INTEGER,
            category_id INTEGER NOT NULL,
            image_url VARCHAR(255) NOT NULL,
            FOREIGN KEY (category_id) REFERENCES category(category_id)
            );`,
            (err) => {
                if(err){
                    console.error("Error creating table: ", err.message);
                } else {
                    console.log("product table checked/created");
                }
            }
        );

        db.run(
            `CREATE TABLE IF NOT EXISTS category(
            category_id INTEGER PRIMARY KEY AUTOINCREMENT,
            name VARCHAR NOT NULL UNIQUE
            );`,
            (err) => {
                if(err){
                    console.error("Error creating table: ", err.message);
                } else {
                    console.log("category table checked/created");
                }
            }
        );

        db.run(
            `CREATE TABLE IF NOT EXISTS orders(
            order_id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            total_amount NUMERIC NOT NULL CHECK(total_amount = round(total_amount, 2)),
            status VARCHAR(50) NOT NULL, 
            order_date DATETIME NOT NULL,
            FOREIGN KEY (user_id) REFERENCES users(user_id)
            );`,
            (err) => {
                if(err){
                    console.error("Error creating table: ", err.message);
                } else {
                    console.log("order table checked/created");
                }
            }
        );

        db.run(
            `CREATE TABLE IF NOT EXISTS orderInfo(
            order_id INTEGER, 
            product_id INTEGER,
            quantity INTEGER NOT NULL, 
            PRIMARY KEY (order_id, product_id),
            FOREIGN KEY (order_id) REFERENCES orders(order_id),
            FOREIGN KEY (product_id) REFERENCES product(product_id)
            );`,
            (err) => {
                if(err){
                    console.error("Error creating table: ", err.message);
                } else {
                    console.log("orderInfo table checked/created");
                }
            }
        );

        db.run(
            `CREATE TABLE IF NOT EXISTS payment(
            payment_id INTEGER PRIMARY KEY AUTOINCREMENT,
            order_id INTEGER NOT NULL,
            amount NUMERIC NOT NULL CHECK(amount = round(amount, 2)),
            payment_date DATETIME NOT NULL,
            payment_method VARCHAR(50) NOT NULL
            );`,
            (err) => {
                if(err){
                    console.error("Error creating table: ", err.message);
                } else {
                    console.log("payment table checked/created");
                }
            }
        );

        db.run(
            `CREATE TABLE IF NOT EXISTS review(
            review_id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            product_id INTEGER NOT NULL,
            rating INTEGER NOT NULL,
            review_text TEXT,
            review_date DATETIME NOT NULL,
            FOREIGN KEY (user_id) REFERENCES users(user_id),
            FOREIGN KEY (product_id) REFERENCES product(product_id)
            );`,
            (err) => {
                if(err){
                    console.error("Error creating table: ", err.message);
                } else {
                    console.log("review table checked/created");
                }
            }
        );

        db.run(
            `CREATE TABLE IF NOT EXISTS shipping(
            shipping_id INTEGER PRIMARY KEY,
            order_id INTEGER NOT NULL,
            shipping_address VARCHAR(255) NOT NULL,
            shipping_status VARCHAR(20) NOT NULL,
            shipping_date DATETIME NOT NULL,
            FOREIGN KEY (order_id) REFERENCES orders(order_id)
            );`  ,
            (err) => {
                if(err){
                    console.error("Error creating table: ", err.message);
                } else {
                    console.log("shipping table checked/created");
                }
            }
        );
    });
}

intializeDatabase();

module.exports = db;