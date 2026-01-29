const { pool } = require('./backend/config/db');

async function check() {
    const { rows } = await pool.query("SELECT * FROM transactions WHERE description LIKE '%Fresh Market%'");
    console.log('Search Result:', JSON.stringify(rows));
    process.exit(0);
}
check();
