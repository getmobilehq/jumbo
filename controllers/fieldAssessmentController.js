const { v4: uuidv4 } = require('uuid');
const fieldAssessmentModel = require('../models/fieldAssessmentModel');

exports.createFieldAssessment = async (req, res) => {
    try {
        const { building_id } = req.body;
        if (!building_id) return res.status(400).json({ error: 'building_id required' });
        const id = uuidv4();
        await fieldAssessmentModel.createFieldAssessment({ id, building_id, created_by: req.user.id });
        res.status(201).json({ id });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getAllFieldAssessments = async (req, res) => {
    try {
        const assessments = await fieldAssessmentModel.getAllFieldAssessments();
        res.json(assessments);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getFieldAssessmentById = async (req, res) => {
    try {
        const assessment = await fieldAssessmentModel.getFieldAssessmentById(req.params.id);
        if (!assessment) return res.status(404).json({ error: 'Field assessment not found' });
        res.json(assessment);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getFieldAssessmentsByBuilding = async (req, res) => {
    try {
        const assessments = await fieldAssessmentModel.getFieldAssessmentsByBuilding(req.params.building_id);
        res.json(assessments);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.addItemsToFieldAssessment = async (req, res) => {
    try {
        const { items } = req.body;
        if (!Array.isArray(items) || !items.length) return res.status(400).json({ error: 'items array required' });
        await fieldAssessmentModel.addItemsToFieldAssessment(req.params.id, items);
        res.status(201).json({ message: 'Items added' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getItemsForFieldAssessment = async (req, res) => {
    try {
        const items = await fieldAssessmentModel.getItemsForFieldAssessment(req.params.id);
        res.json(items);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.updateRepairCosts = async (req, res) => {
    try {
        const { costs } = req.body;
        if (!Array.isArray(costs) || !costs.length) return res.status(400).json({ error: 'costs array required' });
        await fieldAssessmentModel.updateRepairCosts(req.params.id, costs);
        res.status(200).json({ message: 'Repair costs updated' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
