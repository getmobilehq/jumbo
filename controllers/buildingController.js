const { v4: uuidv4 } = require('uuid');
const buildingModel = require('../models/buildingModel');

exports.createBuilding = async (req, res) => {
    try {
        const requiredFields = [
            'name', 'type', 'city', 'state', 'zip_code', 'address',
            'year_built', 'cost_per_sqft', 'square_footage', 'description', 'image_url'
        ];
        const missing = requiredFields.filter(f => !req.body[f]);
        if (missing.length) {
            return res.status(400).json({
                error: 'Missing required fields',
                missing_fields: missing
            });
        }
        if (!req.user || !req.user.id) {
            return res.status(401).json({ error: 'Unauthorized: missing user context' });
        }
        const id = uuidv4();
        const {
            name, type, city, state, zip_code, address,
            year_built, cost_per_sqft, square_footage, description, image_url
        } = req.body;
        const created_by = req.user.id;
        await buildingModel.createBuilding({
            id, name, type, city, state, zip_code, address,
            year_built, cost_per_sqft, square_footage, description, image_url, created_by
        });
        res.status(201).json({ id });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getAllBuildings = async (req, res) => {
    try {
        const buildings = await buildingModel.getAllBuildings();
        res.json(buildings);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getBuildingById = async (req, res) => {
    try {
        const building = await buildingModel.getBuildingById(req.params.id);
        if (!building) return res.status(404).json({ error: 'Building not found' });
        res.json(building);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.updateBuilding = async (req, res) => {
    try {
        await buildingModel.updateBuilding(req.params.id, req.body);
        res.status(200).json({ message: 'Building updated' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.deleteBuilding = async (req, res) => {
    try {
        await buildingModel.deleteBuilding(req.params.id);
        res.status(204).send();
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
