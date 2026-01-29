const { pool } = require('../../config/db');

class CategoryModel {
  static async findByName(name, userId) {
    const query = `
      SELECT * FROM categories 
      WHERE LOWER(name) = LOWER(?) 
      AND (user_id = ? OR is_default = 1)
      LIMIT 1
    `;
    const { rows } = await pool.query(query, [name, userId]);
    return rows[0];
  }

  static async create(name, userId) {
    const query = `
      INSERT INTO categories (name, user_id, is_default)
      VALUES (?, ?, 0)
      ON CONFLICT (name, user_id) DO UPDATE SET name = name
    `;
    await pool.query(query, [name, userId]);

    // Fetch back
    return this.findByName(name, userId);
  }

  static async getAll(userId) {
    const query = `
        SELECT * FROM categories
        WHERE user_id = ? OR is_default = 1
        ORDER BY name ASC
      `;
    const { rows } = await pool.query(query, [userId]);
    return rows;
  }
}

module.exports = CategoryModel;
