const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, '../../expense_tracker.db');

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Could not connect to database', err);
    } else {
        console.log('Connected to SQLite database');
        // Enable foreign keys
        db.run('PRAGMA foreign_keys = ON');
    }
});

// Helper to wrap sqlite3 in Promises to match our previous "pool.query" style
const query = (sql, params = []) => {
    return new Promise((resolve, reject) => {
        // If it's a SELECT query, use db.all
        if (sql.trim().toUpperCase().startsWith('SELECT')) {
            db.all(sql, params, (err, rows) => {
                if (err) reject(err);
                else resolve({ rows });
            });
        } else {
            // For INSERT, UPDATE, DELETE, use db.run
            db.run(sql, params, function (err) {
                if (err) reject(err);
                else resolve({ rows: [this], lastID: this.lastID, changes: this.changes });
            });
        }
    });
};

module.exports = { pool: { query }, db };
