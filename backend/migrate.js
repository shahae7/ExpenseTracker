const fs = require('fs');
const path = require('path');
const { db } = require('./config/db');

const migrate = () => {
    const sqlPath = path.join(__dirname, 'database.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');

    console.log('Running migration...');

    // SQLite executes one statement at a time comfortably, but db.exec can handle scripts
    db.exec(sql, (err) => {
        if (err) {
            console.error('Migration failed:', err);
            process.exit(1);
        } else {
            console.log('Migration successful! Tables created.');
            process.exit(0);
        }
    });
};

migrate();
