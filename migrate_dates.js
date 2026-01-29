const { pool } = require('./backend/config/db');

async function migrate() {
    try {
        const { rows } = await pool.query('SELECT id, date FROM transactions');
        console.log(`Found ${rows.length} transactions to check.`);

        for (const row of rows) {
            // Check if date is a large number (timestamp)
            if (!isNaN(row.date) && row.date.toString().length > 10) {
                const newDate = new Date(parseInt(row.date)).toISOString().split('T')[0];
                console.log(`Updating ID ${row.id}: ${row.date} -> ${newDate}`);
                await pool.query('UPDATE transactions SET date = ? WHERE id = ?', [newDate, row.id]);
            } else if (typeof row.date === 'string' && row.date.includes('T')) {
                // Handle ISO strings with time
                const newDate = row.date.split('T')[0];
                console.log(`Updating ID ${row.id}: ${row.date} -> ${newDate}`);
                await pool.query('UPDATE transactions SET date = ? WHERE id = ?', [newDate, row.id]);
            }
        }
        console.log('Migration complete.');
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

migrate();
