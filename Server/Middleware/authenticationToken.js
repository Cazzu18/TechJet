const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', ''); // Get the token from Authorization header

    if (!token) {
        return res.status(401).json({ message: 'Access Denied. No token provided.' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid or expired token.' });
        }
        console.log("Successfully Authenticated");
        req.user = decoded;  // Attach the decoded user info to the request object
        next();  // Proceed to the next middleware or route handler
    });
};

const authenticateAdmin = (req, res, next) => {
    if (!req.user.isAdmin) {
        return res.status(403).json({ error: "Access denied. Admins only." });
    }
    next();
}
module.exports = {
    authenticateToken,
    authenticateAdmin
};