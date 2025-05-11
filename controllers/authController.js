const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const userModel = require('../models/userModel');

exports.register = async (req, res) => {
    try {
        const { email, password, role } = req.body;
        if (!email || !password) return res.status(400).json({ error: 'Email and password required' });
        const password_hash = await bcrypt.hash(password, 10);
        const id = uuidv4();
        // Ensure role is always defined
        await userModel.createUser({ id, email, password_hash, role: role || 'user' });
        res.status(201).json({ id });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) return res.status(400).json({ error: 'Email and password required' });
        const user = await userModel.getUserByEmail(email);
        if (!user) return res.status(401).json({ error: 'Invalid credentials' });
        const match = await bcrypt.compare(password, user.password_hash);
        if (!match) return res.status(403).json({ error: 'Invalid credentials' });
        const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET);
        res.json({ token });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
