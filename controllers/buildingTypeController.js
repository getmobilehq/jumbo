const buildingTypeModel = require('../models/buildingTypeModel');
const csv = require('csv-parse');
const { v4: uuidv4 } = require('uuid');

exports.getAllBuildingTypes = async (req, res) => {
    try {
        const types = await buildingTypeModel.getAllBuildingTypes();
        res.json(types);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getBuildingTypeByType = async (req, res) => {
    try {
        const types = await buildingTypeModel.getBuildingTypeByType(req.params.type);
        if (!types.length) return res.status(404).json({ error: 'Building type not found' });
        res.json(types);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.uploadBuildingTypesFromCSV = async (req, res) => {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
    const { parse } = require('csv-parse');
    parse(req.file.buffer.toString(), { columns: true, trim: true }, async (err, records) => {
        if (err) return res.status(400).json({ error: 'Invalid CSV format' });
        const results = [];
        for (const row of records) {
            if (!row.building_type || !row.category || !row.subcategory) {
                return res.status(400).json({ error: 'CSV must have building_type, category, subcategory columns' });
            }
            results.push({
                id: uuidv4(),
                building_type: row.building_type,
                category: row.category,
                subcategory: row.subcategory
            });
        }
        try {
            await buildingTypeModel.bulkInsertBuildingTypes(results);
            res.status(201).json({ message: 'Building types uploaded', count: results.length });
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    });
};
