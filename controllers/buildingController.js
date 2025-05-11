const { v4: uuidv4 } = require('uuid');
const buildingModel = require('../models/buildingModel');

exports.createBuilding = async (req, res) => {
    try {
        const { name, type, square_footage, cost_per_sqft } = req.body;
        if (!name || !type) return res.status(400).json({ error: 'Name and type required' });
        const id = uuidv4();
        await buildingModel.createBuilding({ id, name, type, square_footage, cost_per_sqft });
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
