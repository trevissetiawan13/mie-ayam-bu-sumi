require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./database'); // Inisialisasi DB

const authRoutes = require('./routes/auth');
const transactionRoutes = require('./routes/transactions');

const app = express();
const PORT = process.env.PORT || 3001;

const allowedOrigins = [
  'https://mie-ayam-frontend.vercel.app',
  'https://mie-ayam-bu-sumi-production.up.railway.app'
];

// Middleware
app.use(cors({
  origin: allowedOrigins,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
})); // Izinkan request dari frontend (beda port)
app.use(express.json()); // Untuk parsing body JSON

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/transactions', transactionRoutes);

app.get('/', (req, res) => {
    res.send('Mie Ayam Bu Sumi Bookkeeping API');
});

app.listen(PORT, () => {
    console.log(`Server backend berjalan di http://localhost:${PORT}`);
});