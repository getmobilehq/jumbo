const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

exports.createBuilding = async ({ id, name, type, city, state, zip_code, address, year_built, cost_per_sqft, square_footage, description, image_url, created_by }) => {
    await pool.execute(
        'INSERT INTO buildings (id, name, type, city, state, zip_code, address, year_built, cost_per_sqft, square_footage, description, image_url, created_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [id, name, type, city, state, zip_code, address, year_built, cost_per_sqft, square_footage, description, image_url, created_by]
    );
};

exports.getAllBuildings = async () => {
    const [rows] = await pool.execute('SELECT * FROM buildings');
    return rows;
};

exports.getBuildingById = async (id) => {
    const [rows] = await pool.execute('SELECT * FROM buildings WHERE id = ?', [id]);
    return rows[0];
};

exports.updateBuilding = async (id, data) => {
    const fields = [];
    const values = [];
    for (const key in data) {
        fields.push(`${key} = ?`);
        values.push(data[key]);
    }
    if (!fields.length) return;
    values.push(id);
    await pool.execute(`UPDATE buildings SET ${fields.join(', ')} WHERE id = ?`, values);
};

exports.deleteBuilding = async (id) => {
    await pool.execute('DELETE FROM buildings WHERE id = ?', [id]);
};
