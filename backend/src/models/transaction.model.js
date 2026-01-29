const { pool } = require('../../config/db');

class TransactionModel {
  static async create({ userId, amount, type, categoryId, description, date }) {
    const query = `
      INSERT INTO transactions (user_id, amount, type, category_id, description, date)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    const values = [userId, amount, type, categoryId, description, date];
    const { lastID } = await pool.query(query, values);

    // Fetch inserted record
    const { rows } = await pool.query('SELECT * FROM transactions WHERE rowid = last_insert_rowid()');
    return rows[0];
  }

  static async findByUserId(userId, { date, month, year, limit = 50, offset = 0 } = {}) {
    let query = `
      SELECT t.*, c.name as category_name
      FROM transactions t
      LEFT JOIN categories c ON t.category_id = c.id
      WHERE t.user_id = ?
    `;
    const params = [userId];

    if (date) {
      // Filter by specific YYYY-MM-DD
      query += ` AND t.date = ?`;
      params.push(date);
    } else if (month && year) {
      // SQLite uses strftime for date extraction. month should be '01'-'12'
      query += ` AND strftime('%m', t.date) = ? AND strftime('%Y', t.date) = ?`;
      params.push(month.toString().padStart(2, '0'), year.toString());
    }

    query += ` ORDER BY t.date DESC LIMIT ? OFFSET ?`;
    params.push(limit, offset);

    const { rows } = await pool.query(query, params);
    return rows;
  }

  static async delete(id, userId) {
    const query = 'DELETE FROM transactions WHERE id = ? AND user_id = ?';
    const { changes } = await pool.query(query, [id, userId]);
    return changes > 0;
  }

  static async update(id, userId, { amount, type, categoryId, description, date }) {
    const query = `
      UPDATE transactions 
      SET amount = ?, type = ?, category_id = ?, description = ?, date = ?
      WHERE id = ? AND user_id = ?
    `;
    const values = [amount, type, categoryId, description, date, id, userId];
    const { changes } = await pool.query(query, values);
    return changes > 0;
  }

  static async getMonthlyStats(userId, month, year) {
    // Ensure month/year formatting matches your date storage
    // Simplified for date strings YYYY-MM-DD
    const query = `
       SELECT 
         SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) as total_expenses,
         SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) as total_income
       FROM transactions 
       WHERE user_id = ? 
       AND strftime('%m', date) = ? 
       AND strftime('%Y', date) = ?
     `;
    // Pad month with 0 if needed
    const m = month.toString().padStart(2, '0');
    const y = year.toString();
    const { rows } = await pool.query(query, [userId, m, y]);
    return rows[0];
  }
}

module.exports = TransactionModel;
