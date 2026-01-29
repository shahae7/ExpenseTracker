const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, '../../expense_tracker.db');
const db = new sqlite3.Database(dbPath);

const defaults = [
    { name: 'Food', color: '#10B981' }, // Emerald
    { name: 'Transport', color: '#F59E0B' }, // Amber
    { name: 'Housing', color: '#EF4444' }, // Red
    { name: 'Entertainment', color: '#8B5CF6' }, // Violet
    { name: 'Utilities', color: '#3B82F6' }, // Blue
    { name: 'Health', color: '#EC4899' }, // Pink
    { name: 'Shopping', color: '#F472B6' }, // Pink-400
    { name: 'Investments', color: '#D4AF37' }, // Gold
    { name: 'Other', color: '#9CA3AF' } // Gray
];

db.serialize(() => {
    // 1. Add color column
    db.run("ALTER TABLE categories ADD COLUMN color VARCHAR(20) DEFAULT '#FFFFFF'", (err) => {
        if (err && !err.message.includes('duplicate column')) {
            console.error("Column add error (might be okay if exists):", err.message);
        } else {
            console.log("Added color column to categories.");
        }
    });

    // 2. Seed Defaults
    const stmt = db.prepare("INSERT INTO categories (name, is_default, color) VALUES (?, 1, ?) ON CONFLICT(name, user_id) DO UPDATE SET color = ?");

    defaults.forEach(cat => {
        stmt.run(cat.name, cat.color, cat.color, (err) => {
            if (err) console.error(`Failed to seed ${cat.name}`, err.message);
            else console.log(`Seeded ${cat.name}`);
        });
    });

    stmt.finalize();
});

db.close(() => {
    console.log("Migration Complete.");
});
