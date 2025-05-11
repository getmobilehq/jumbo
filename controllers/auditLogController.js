const auditLogModel = require('../models/auditLogModel');

exports.getAllAuditLogs = async (req, res) => {
    try {
        const logs = await auditLogModel.getAllAuditLogs();
        res.json(logs);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getAuditLogById = async (req, res) => {
    try {
        const log = await auditLogModel.getAuditLogById(req.params.id);
        if (!log) return res.status(404).json({ error: 'Audit log not found' });
        res.json(log);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
