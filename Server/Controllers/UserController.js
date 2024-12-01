const db = require('../initializeDatabase');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const login = (req, res) => {
    const {username, password} = req.body;
    db.get(`SELECT * FROM users WHERE username = ?`, [username], (err, user) => {
        if(err) {
            console.error("Database error:", err)
            return res.status(500).json({error: err.message});
        } else if (!user) {
            console.log("User not found")
            return res.status(401).json({error: "Invalid email or password"});
        } else{
            bcrypt.compare(password, user.password, (err, isMatch) => {
                if(err){
                    console.log("Error Comparing passwords")
                    return res.status(500).json({error: "Error comparing passwords"});
                } 

                if(isMatch) {
                    const token = jwt.sign(
                        {userId: user.user_id, email:user.email, isAdmin:user.is_admin},
                        process.env.JWT_SECRET,
                        {expiresIn: '4h'}
                    );
                    res.status(200).json({message: 'Login successful', token});
                } else{
                    console.log("Password did not match")
                    res.status(400).json({message: 'Invalid email or password'});
                }
            });
        }
    }); 
};

const createAccount = (req, res) => {
    const { username, email, password, first_name, last_name, address, is_admin } = req.body;
    const normalizedEmail = email.trim().toLowerCase();
    bcrypt.hash(password, 10, (err, hashedPass) => {
        if(err){
            return res.status(500).json({error: "Error hashing password"});
        } else {
            db.run( 
                `INSERT INTO users (username, email, password, first_name, last_name, address, is_admin)
                VALUES(?, ?, ?, ?, ?, ?, ?)`,
                [username, normalizedEmail, hashedPass, first_name, last_name, address, is_admin],
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

const viewUserProfile = (req, res) => {
    const checkId = req.user?.userId;  // Safe optional chaining to avoid errors if req.user is undefined
    if (!checkId) {
        return res.status(401).json({ message: 'User not authenticated' }); 
    }
    const userId = req.user.userId;
    
    db.get(`SELECT * FROM users WHERE user_id = ?`, [userId], (err, user) =>{
        if(err){
            return res.status(500).json({error:'Error retrieving user profile'});
        }
        if(!user){
            return res.status(404).json({message: 'User not found'});
        }
        res.status(200).json({ user });
    });
};

const updateUserProfile = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { username, email, password, first_name, last_name, address } = req.body;
        const updateFields = [];
        const values = [];

        if (email) {
            const normalizedEmail = email.trim().toLowerCase();
            updateFields.push("email = ?");
            values.push(normalizedEmail);
        }

        if (password) {
            const hashedPass = await bcrypt.hash(password, 10);
            updateFields.push("password = ?");
            values.push(hashedPass);
        }

        if (username) { updateFields.push("username = ?"); values.push(username); }
        if (first_name) { updateFields.push("first_name = ?"); values.push(first_name); }
        if (last_name) { updateFields.push("last_name = ?"); values.push(last_name); }
        if (address) { updateFields.push("address = ?"); values.push(address); }

        if (updateFields.length === 0) {
            return res.status(400).json({ error: "No fields to update" });
        }

        const query = `UPDATE users SET ${updateFields.join(", ")} WHERE user_id = ?`;
        values.push(userId);

        db.run(query, values, function (err) {
            if (err) {
                return res.status(500).json({ error: "Error updating profile" });
            }
            if (this.changes === 0) {
                return res.status(404).json({ error: "User not found or no changes detected" });
            }
            res.status(200).json({ message: "Profile updated successfully" });
        });
    } catch (err) {
        res.status(500).json({ error: "An unexpected error occurred" });
    }
};

const adminGetUser = (req, res) => {
    const { userId } = req.params;
    db.get(
        `SELECT * FROM users WHERE user_id = ?`,
        [userId],
        (err, user) => {
            if (err) {
                return res.status(500).json({ error: "Error retrieving user" });
            }
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }
            return res.status(200).json({ user });
        }
    );
};

const adminAlterUser = (req, res) => {
    const { userId } = req.params;
    const { username, email, first_name, last_name, address, is_admin } = req.body;
    db.get(
        `SELECT * FROM users WHERE user_id = ?`,
        [user_id],
        (err, user) => {
            if (err) {
                return res.status(500).json({ error: "Error retrieving user" });
            }
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }
            db.run(
                `UPDATE users 
                 SET username = ?, email = ?, first_name = ?, last_name = ?, address = ?, is_admin = ?
                 WHERE user_id = ?`,
                [username, email, first_name, last_name, address, is_admin, user_id],
                function (err) {
                    if (err) {
                        return res.status(500).json({ error: "Error updating user" });
                    }
                    return res.status(200).json({ message: "User updated successfully" });
                }
            );
        }
    );
};

const adminDeleteUser = (req, res) => {
    const { userId } = req.params;
    db.get(
        `SELECT * FROM users WHERE user_id = ?`,
        [user_id],
        (err, user) => {
            if (err) {
                return res.status(500).json({ error: "Error retrieving user" });
            }
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }
            db.get(
                `SELECT * FROM orders WHERE user_id = ?`,
                [user_id],
                (err, order) => {
                    if (err) {
                        return res.status(500).json({ error: "Error checking user orders" });
                    }

                    if (order) {
                        return res.status(400).json({ message: "Cannot delete user with existing orders" });
                    }
                    db.run(
                        `DELETE FROM users WHERE user_id = ?`,
                        [user_id],
                        function (err) {
                            if (err) {
                                return res.status(500).json({ error: "Error deleting user" });
                            }
                            return res.status(200).json({ message: "User deleted successfully" });
                        }
                    );
                }
            );
        }
    );
};

module.exports = {
    login,
    createAccount,
    viewUserProfile,
    updateUserProfile,
    adminGetUser,
    adminAlterUser,
    adminDeleteUser
};