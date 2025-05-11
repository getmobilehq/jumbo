const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

exports.createFieldAssessment = async ({ id, building_id, created_by }) => {
    await pool.execute('INSERT INTO field_assessments (id, building_id, created_by, created_at) VALUES (?, ?, ?, NOW())', [id, building_id, created_by]);
};

exports.getAllFieldAssessments = async () => {
    const [rows] = await pool.execute('SELECT * FROM field_assessments');
    return rows;
};

exports.getFieldAssessmentById = async (id) => {
    const [rows] = await pool.execute('SELECT * FROM field_assessments WHERE id = ?', [id]);
    return rows[0];
};

exports.getFieldAssessmentsByBuilding = async (building_id) => {
    const [rows] = await pool.execute('SELECT * FROM field_assessments WHERE building_id = ?', [building_id]);
    return rows;
};

exports.addItemsToFieldAssessment = async (field_assessment_id, items) => {
    for (const item of items) {
        const item_id = require('uuid').v4();
        await pool.execute(
            'INSERT INTO field_assessment_items (id, field_assessment_id, category, subcategory, condition) VALUES (?, ?, ?, ?, ?)',
            [item_id, field_assessment_id, item.category, item.subcategory, item.condition]
        );
    }
};

exports.getItemsForFieldAssessment = async (field_assessment_id) => {
    const [rows] = await pool.execute('SELECT * FROM field_assessment_items WHERE field_assessment_id = ?', [field_assessment_id]);
    return rows;
};

exports.updateRepairCosts = async (field_assessment_id, costs) => {
    for (const entry of costs) {
        await pool.execute(
            'UPDATE field_assessment_items SET repair_cost = ? WHERE id = ?',
            [entry.repair_cost, entry.item_id]
        );
    }
};
