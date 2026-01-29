const { pool } = require('./backend/config/db');

async function check() {
    try {
        const { rows } = await pool.query('SELECT * FROM transactions ORDER BY id DESC LIMIT 5');
        console.log('Latest Transactions:', JSON.stringify(rows, null, 2));

        const { rows: categories } = await pool.query('SELECT * FROM categories');
        console.log('Categories:', JSON.stringify(categories, null, 2));

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

check();
