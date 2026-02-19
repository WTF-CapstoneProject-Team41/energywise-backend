const jwt = require('jsonwebtoken');
const config = require('../config/env');

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers.authorization;

    // console.log('AUTH HEADER:', authHeader);

    if (!authHeader) {
        return res.status(401).json({ message: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];
    // console.log('EXTRACTED TOKEN:', token);

    try {
        const decoded = jwt.verify(token, config.jwt.secret);
        req.user = decoded;
        next();
    } catch (err) {
        // console.log('VERIFY ERROR:', err.message); 
        return res.status(403).json({ message: 'Invalid token' });
    }
};

module.exports = authenticateToken;