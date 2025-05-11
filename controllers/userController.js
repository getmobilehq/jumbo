const userModel = require('../models/userModel');

exports.getMe = async (req, res) => {
    try {
        const user = await userModel.getUserById(req.user.id);
        if (!user) return res.status(404).json({ error: 'User not found' });
        res.json({ id: user.id, email: user.email, role: user.role });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getAllUsers = async (req, res) => {
    try {
        const users = await userModel.getAllUsers();
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getUserById = async (req, res) => {
    try {
        const user = await userModel.getUserById(req.params.id);
        if (!user) return res.status(404).json({ error: 'User not found' });
        res.json({ id: user.id, email: user.email, role: user.role });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.deleteUser = async (req, res) => {
    try {
        await userModel.deleteUser(req.params.id);
        res.status(204).send();
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
