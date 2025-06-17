const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');

const dbMountPath = process.env.DB_MOUNT_PATH || './'; // Render akan set DB_MOUNT_PATH
const dbFileName = 'data.db';
const dbPath = require('path').join(dbMountPath, dbFileName);

console.log(`Database path: ${dbPath}`); // Untuk debugging saat deployment

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error("DATABASE CONNECTION ERROR:", err.message);
        throw err;
    }
    console.log('Connected to the SQLite database.');
});

// Buat tabel jika belum ada
db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL
    )`, (err) => {
        if (err) console.error("Error creating users table", err);
        else {
            // Tambah user admin default jika belum ada
            const adminPassword = 'adminpassword'; // Ganti dengan password yang kuat
            bcrypt.hash(adminPassword, 10, (err, hashedPassword) => {
                if (err) return console.error("Error hashing password:", err);
                db.run(`INSERT OR IGNORE INTO users (username, password) VALUES (?, ?)`,
                    ['admin', hashedPassword],
                    (err) => {
                        if (err) console.error("Error inserting admin user:", err);
                        else console.log("Admin user checked/created.");
                    }
                );
            });
        }
    });

    db.run(`CREATE TABLE IF NOT EXISTS transactions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        type TEXT NOT NULL CHECK(type IN ('income', 'expense')), -- 'income' or 'expense'
        description TEXT NOT NULL,
        amount REAL NOT NULL,
        date TEXT NOT NULL, -- Simpan sebagai ISO string YYYY-MM-DD HH:MM:SS atau YYYY-MM-DD
        FOREIGN KEY (user_id) REFERENCES users(id)
    )`, (err) => {
        if (err) console.error("Error creating transactions table", err);
        else console.log("Transactions table checked/created.");
    });
});

module.exports = db;