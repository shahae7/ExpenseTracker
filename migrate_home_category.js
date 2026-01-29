const { pool } = require('./backend/config/db');
const CategoryModel = require('./backend/src/models/category.model');

async function migrate() {
    try {
        const { rows: transactions } = await pool.query("SELECT * FROM transactions WHERE LOWER(description) LIKE '%home%'");
        console.log(`Found ${transactions.length} transactions with 'home' in description.`);

        for (const t of transactions) {
            // Find or create 'Home' category for this user
            let category = await CategoryModel.findByName('Home', t.user_id);
            if (!category) {
                category = await CategoryModel.create('Home', t.user_id);
            }

            console.log(`Updating transaction ID ${t.id} to 'Home' category.`);
            await pool.query('UPDATE transactions SET category_id = ? WHERE id = ?', [category.id, t.id]);
        }

        console.log('Category migration complete.');
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

migrate();
