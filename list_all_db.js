const { pool } = require('./backend/config/db');

async function check() {
    const { rows } = await pool.query('SELECT id, description, date, amount FROM transactions ORDER BY id DESC');
    console.log('ALL_TRANS:');
    rows.forEach(r => console.log(`${r.id}: ${r.description} | ${r.date} | ${r.amount}`));
    process.exit(0);
}
check();
