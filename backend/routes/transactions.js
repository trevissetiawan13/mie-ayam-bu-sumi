const express = require('express');
const db = require('../database');
const authenticateToken = require('../middleware/authMiddleware');
const router = express.Router();

// Middleware untuk semua rute di file ini
router.use(authenticateToken);

// Tambah transaksi baru
router.post('/', (req, res) => {
    const { type, description, amount, date } = req.body;
    const userId = req.user.id;

    if (!type || !description || amount == null || !date) {
        return res.status(400).json({ message: "Semua field (type, description, amount, date) diperlukan." });
    }
    if (type !== 'income' && type !== 'expense') {
        return res.status(400).json({ message: "Type harus 'income' atau 'expense'." });
    }
    if (typeof amount !== 'number' || amount <= 0) {
        return res.status(400).json({ message: "Amount harus angka positif." });
    }

    const sql = `INSERT INTO transactions (user_id, type, description, amount, date)
                 VALUES (?, ?, ?, ?, ?)`;
    db.run(sql, [userId, type, description, amount, date], function(err) {
        if (err) return res.status(500).json({ message: "Database error", error: err.message });
        res.status(201).json({ id: this.lastID, type, description, amount, date });
    });
});

// Dapatkan semua transaksi
router.get('/', (req, res) => {
    const userId = req.user.id;
    // Ambil juga data untuk 30 hari terakhir untuk summary awal
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const dateLimit = thirtyDaysAgo.toISOString().split('T')[0]; // YYYY-MM-DD

    const sql = `SELECT id, type, description, amount, date
                 FROM transactions
                 WHERE user_id = ? AND date >= ?
                 ORDER BY date DESC`;
    db.all(sql, [userId, dateLimit], (err, rows) => {
        if (err) return res.status(500).json({ message: "Database error", error: err.message });
        res.json(rows);
    });
});

// Dapatkan data untuk grafik
router.get('/summary', (req, res) => {
    const userId = req.user.id;
    const { period } = req.query; // 'daily', 'weekly', 'monthly'

    let groupByFormat;
    let dateCondition = ""; // Untuk membatasi data jika diperlukan

    const today = new Date();
    if (period === 'daily') { // Data 7 hari terakhir, dikelompokkan per hari
        groupByFormat = '%Y-%m-%d';
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(today.getDate() - 7);
        dateCondition = `AND date >= '${sevenDaysAgo.toISOString().split('T')[0]}'`;
    } else if (period === 'weekly') { // Data 4 minggu terakhir, dikelompokkan per minggu
        groupByFormat = '%Y-%W'; // %W adalah minggu dalam setahun (Senin sebagai hari pertama)
        const fourWeeksAgo = new Date();
        fourWeeksAgo.setDate(today.getDate() - 28);
        dateCondition = `AND date >= '${fourWeeksAgo.toISOString().split('T')[0]}'`;
    } else if (period === 'monthly') { // Data 12 bulan terakhir, dikelompokkan per bulan
        groupByFormat = '%Y-%m';
        const twelveMonthsAgo = new Date();
        twelveMonthsAgo.setMonth(today.getMonth() - 12);
        dateCondition = `AND date >= '${twelveMonthsAgo.toISOString().split('T')[0]}'`;
    } else {
        return res.status(400).json({ message: "Periode tidak valid. Pilih 'daily', 'weekly', atau 'monthly'." });
    }

    const sql = `
        SELECT
            strftime('${groupByFormat}', date) as period_group,
            SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) as total_income,
            SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) as total_expense
        FROM transactions
        WHERE user_id = ? ${dateCondition}
        GROUP BY period_group
        ORDER BY period_group ASC
    `;

    db.all(sql, [userId], (err, rows) => {
        if (err) return res.status(500).json({ message: "Database error", error: err.message });
        res.json(rows);
    });
});

// Hapus transaksi berdasarkan ID
router.delete('/:id', (req, res) => {
    const transactionId = req.params.id;
    const userId = req.user.id; // Pastikan hanya user yang bersangkutan yang bisa menghapus

    if (!transactionId) {
        return res.status(400).json({ message: "ID transaksi diperlukan." });
    }

    // Pastikan transaksi milik user yang sedang login sebelum menghapus
    // Ini langkah keamanan tambahan jika Anda tidak hanya mengandalkan user_id dalam query DELETE
    db.get("SELECT user_id FROM transactions WHERE id = ?", [transactionId], (err, row) => {
        if (err) {
            return res.status(500).json({ message: "Database error saat memeriksa transaksi", error: err.message });
        }
        if (!row) {
            return res.status(404).json({ message: "Transaksi tidak ditemukan." });
        }
        if (row.user_id !== userId) {
            return res.status(403).json({ message: "Anda tidak berhak menghapus transaksi ini." });
        }

        // Lakukan penghapusan
        const sql = `DELETE FROM transactions WHERE id = ? AND user_id = ?`;
        db.run(sql, [transactionId, userId], function(err) {
            if (err) {
                return res.status(500).json({ message: "Database error saat menghapus transaksi", error: err.message });
            }
            if (this.changes === 0) {
                // Seharusnya tidak terjadi jika pemeriksaan di atas sudah dilakukan, tapi sebagai fallback
                return res.status(404).json({ message: "Transaksi tidak ditemukan atau Anda tidak berhak menghapusnya." });
            }
            res.status(200).json({ message: "Transaksi berhasil dihapus.", id: transactionId });
        });
    });
});


module.exports = router;