const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

exports.createUser = async ({ id, email, password_hash, role }) => {
    await pool.execute('INSERT INTO users (id, email, password_hash, role) VALUES (?, ?, ?, ?)', [id, email, password_hash, role]);
};

exports.getUserByEmail = async (email) => {
    const [rows] = await pool.execute('SELECT * FROM users WHERE email = ?', [email]);
    return rows[0];
};

exports.getUserById = async (id) => {
    const [rows] = await pool.execute('SELECT * FROM users WHERE id = ?', [id]);
    return rows[0];
};

exports.getAllUsers = async () => {
    const [rows] = await pool.execute('SELECT id, email, role FROM users');
    return rows;
};

exports.deleteUser = async (id) => {
    await pool.execute('DELETE FROM users WHERE id = ?', [id]);
};
