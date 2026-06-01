const jwt = require('jsonwebtoken');

// This middleware protects routes from unauthenticated users
exports.authenticateToken = async (req, res, next) => {
    try {
        let token;

        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1]; // Get the token part after 'Bearer'
        }

        if (!token) {
            return res.status(401).json({ success: false, message: "Not authorized: No token provided" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = decoded;

        next(); 
    } catch (error) {
        return res.status(401).json({ success: false, message: "Not authorized: Invalid or expired token" });
    }
};

exports.isAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        return res.status(403).json({ success: false, message: "Access Denied: Admins Only" });
    }
};