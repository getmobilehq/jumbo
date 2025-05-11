const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

exports.getAllBuildingTypes = async () => {
    const [rows] = await pool.execute('SELECT DISTINCT building_type FROM building_type_mappings');
    return rows;
};

exports.getBuildingTypeByType = async (type) => {
    const [rows] = await pool.execute('SELECT * FROM building_type_mappings WHERE building_type = ?', [type]);
    return rows;
};
