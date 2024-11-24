const db = require('../initializeDatabase');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const login = (req, res) => {
    const {username, password} = req.body;
    db.get(`SELECT * FROM users WHERE username = ?`, [username], (err, user) => {
        if(err) {
            return res.status(500).json({error: err.message});
        } else if (!user) {
            return res.status(401).json({error: "Invalid email or password"});
        } else{
            bcrypt.compare(password, user.password, (err, isMatch) => {
                if(err){
                    return res.status(500).json({error: "Error comparing passwords"});
                } 

                if(isMatch) {
                    const token = jwt.sign(
                        {userId: user.user_id, email:user.email},
                        process.env.JWT_SECRET,
                        {expiresIn: '4h'}
                    );
                    res.status(200).json({message: 'Login successful', token});
                } else{
                    res.status(400).json({message: 'Invalid email or password'});
                }
            });
        }
    }); 
};

const createAccount = (req, res) => {
    const { username, email, password, first_name, last_name, address } = req.body;
    const normalizedEmail = email.trim().toLowerCase();
    bcrypt.hash(password, 10, (err, hashedPass) => {
        if(err){
            return res.status(500).json({error: "Error hashing password"});
        } else {
            db.run( 
                `INSERT INTO users (username, email, password, first_name, last_name, address)
                VALUES(?, ?, ?, ?, ?, ?)`,
                [username, normalizedEmail, hashedPass, first_name, last_name, address],
                function(err) {
                    if(err) {
                        res.status(500).json({error: err.message});
                    } else {
                        res.status(201).json({user_id: this.lastID});
                    }
                }
            );
        }
    });
};

module.exports = {
    login,
    createAccount,
};