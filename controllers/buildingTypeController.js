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
