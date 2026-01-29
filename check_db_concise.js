const { pool } = require('./backend/config/db');

async function check() {
    const { rows } = await pool.query('SELECT t.id, t.description, t.amount, t.date, c.name FROM transactions t LEFT JOIN categories c ON t.category_id = c.id ORDER BY t.id DESC LIMIT 3');
    rows.forEach(r => console.log(`ID: ${r.id} | Desc: ${r.description} | Amt: ${r.amount} | Date: ${r.date} | Cat: ${r.name}`));
    process.exit(0);
}
check();
