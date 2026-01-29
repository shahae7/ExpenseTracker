const { pool } = require('./backend/config/db');

async function check() {
    const { rows } = await pool.query("SELECT * FROM transactions WHERE id = 5");
    console.log('TRANS_5:', JSON.stringify(rows[0]));
    process.exit(0);
}
check();
