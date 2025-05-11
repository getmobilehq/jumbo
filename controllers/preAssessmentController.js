const { v4: uuidv4 } = require('uuid');
const preAssessmentModel = require('../models/preAssessmentModel');

exports.createPreAssessment = async (req, res) => {
    try {
        const { building_id } = req.body;
        if (!building_id) return res.status(400).json({ error: 'building_id required' });
        const id = uuidv4();
        await preAssessmentModel.createPreAssessment({ id, building_id, created_by: req.user.id });
        res.status(201).json({ id });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getAllPreAssessments = async (req, res) => {
    try {
        const assessments = await preAssessmentModel.getAllPreAssessments();
        res.json(assessments);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getPreAssessmentById = async (req, res) => {
    try {
        const assessment = await preAssessmentModel.getPreAssessmentById(req.params.id);
        if (!assessment) return res.status(404).json({ error: 'Pre-assessment not found' });
        res.json(assessment);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getPreAssessmentsByBuilding = async (req, res) => {
    try {
        const assessments = await preAssessmentModel.getPreAssessmentsByBuilding(req.params.building_id);
        res.json(assessments);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.addItemsToPreAssessment = async (req, res) => {
    try {
        const { items } = req.body;
        if (!Array.isArray(items) || !items.length) return res.status(400).json({ error: 'items array required' });
        await preAssessmentModel.addItemsToPreAssessment(req.params.id, items);
        res.status(201).json({ message: 'Items added' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getItemsForPreAssessment = async (req, res) => {
    try {
        const items = await preAssessmentModel.getItemsForPreAssessment(req.params.id);
        res.json(items);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
