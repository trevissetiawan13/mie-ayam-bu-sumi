const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../database');
require('dotenv').config();

const router = express.Router();

// Login
router.post('/login', (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ message: "Username dan password diperlukan." });
    }

    db.get("SELECT * FROM users WHERE username = ?", [username], (err, user) => {
        if (err) return res.status(500).json({ message: "Database error", error: err.message });
        if (!user) return res.status(401).json({ message: "Username tidak ditemukan." });

        bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) return res.status(500).json({ message: "Error saat membandingkan password."});
            if (!isMatch) return res.status(401).json({ message: "Password salah." });

            const tokenPayload = { id: user.id, username: user.username };
            const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, { expiresIn: '1h' });
            res.json({ token, user: tokenPayload });
        });
    });
});

// (Opsional) Register - Anda mungkin hanya ingin 1 admin, bisa di-seed di DB
// router.post('/register', (req, res) => { ... });

module.exports = router;