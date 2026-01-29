const { pool } = require('./backend/config/db');

async function check() {
    const { rows } = await pool.query("SELECT * FROM transactions");
    console.log('TOTAL_COUNT:', rows.length);
    rows.forEach(r => {
        if (r.description && r.description.includes('Fresh')) {
            console.log('MATCH:', r.id, r.description, r.date, r.amount);
        }
    });
    process.exit(0);
}
check();
