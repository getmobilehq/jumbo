const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

exports.createPreAssessment = async ({ id, building_id, created_by }) => {
    await pool.execute('INSERT INTO pre_assessments (id, building_id, created_by, created_at) VALUES (?, ?, ?, NOW())', [id, building_id, created_by]);
};

exports.getAllPreAssessments = async () => {
    const [rows] = await pool.execute('SELECT * FROM pre_assessments');
    return rows;
};

exports.getPreAssessmentById = async (id) => {
    const [rows] = await pool.execute('SELECT * FROM pre_assessments WHERE id = ?', [id]);
    return rows[0];
};

exports.getPreAssessmentsByBuilding = async (building_id) => {
    const [rows] = await pool.execute('SELECT * FROM pre_assessments WHERE building_id = ?', [building_id]);
    return rows;
};

exports.addItemsToPreAssessment = async (pre_assessment_id, items) => {
    for (const item of items) {
        const item_id = require('uuid').v4();
        await pool.execute(
            'INSERT INTO pre_assessment_items (id, pre_assessment_id, category, subcategory, score) VALUES (?, ?, ?, ?, ?)',
            [item_id, pre_assessment_id, item.category, item.subcategory, item.score]
        );
    }
};

exports.getItemsForPreAssessment = async (pre_assessment_id) => {
    const [rows] = await pool.execute('SELECT * FROM pre_assessment_items WHERE pre_assessment_id = ?', [pre_assessment_id]);
    return rows;
};
