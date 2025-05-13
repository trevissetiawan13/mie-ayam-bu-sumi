const jwt = require('jsonwebtoken');
require('dotenv').config();

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (token == null) return res.sendStatus(401); // Jika tidak ada token

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403); // Jika token tidak valid
        req.user = user; // user akan berisi payload dari token (misal: { id: 1, username: 'admin' })
        next();
    });
};

module.exports = authenticateToken;