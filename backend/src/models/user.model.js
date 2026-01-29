const { pool } = require('../../config/db');

class UserModel {
    static async create(username, email, passwordHash) {
        const query = `
      INSERT INTO users (username, email, password_hash)
      VALUES (?, ?, ?)
    `;
        const values = [username, email, passwordHash];

        // SQLite doesn't support RETURNING in older versions, so we insert then fetch
        await pool.query(query, values);

        // Fetch the user we just created
        const fetchQuery = 'SELECT id, username, email, created_at FROM users WHERE email = ?';
        const { rows } = await pool.query(fetchQuery, [email]);
        return rows[0];
    }

    static async findByEmail(email) {
        const query = 'SELECT * FROM users WHERE email = ?';
        const { rows } = await pool.query(query, [email]);
        return rows[0];
    }

    static async findById(id) {
        const query = 'SELECT id, username, email FROM users WHERE id = ?';
        const { rows } = await pool.query(query, [id]);
        return rows[0];
    }
}

module.exports = UserModel;
