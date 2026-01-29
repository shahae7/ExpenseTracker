const { pool } = require('./backend/config/db');

async function check() {
    const { rows } = await pool.query('SELECT t.id, t.description, t.amount, t.date FROM transactions t ORDER BY t.id DESC LIMIT 10');
    console.log('TRANS_START');
    rows.forEach(r => {
        console.log(`- ${r.id}: ${r.description} | ${r.amount} | ${r.date}`);
    });
    console.log('TRANS_END');
    process.exit(0);
}
check();
