// ONYX Backend - Express.js + MySQL (Clean Architecture)

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
const mysql = require('mysql2/promise');
const Joi = require('joi');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));

// 🔐 JWT Auth Middleware
const authenticate = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.sendStatus(401);
    const token = authHeader.split(' ')[1];
    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        req.user = payload;
        next();
    } catch (err) {
        return res.sendStatus(403);
    }
};

const authorize = (roles = []) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) return res.sendStatus(403);
        next();
    };
};

// 🧱 MySQL Connection
const db = mysql.createPool({
    host: '143.198.58.191',
    user: 'danonyx',
    password: 'M0ntg0m3r!',
    database: 'onyxdb',
});

// 🔐 Auth Routes
app.post('/auth/register', async (req, res) => {
    const { email, password, role = 'user' } = req.body;
    const hashed = await bcrypt.hash(password, 10);
    const id = uuidv4();
    await db.execute('INSERT INTO users (id, email, password, role) VALUES (?, ?, ?, ?)', [id, email, hashed, role]);
    res.status(201).json({ id });
});

app.post('/auth/login', async (req, res) => {
    const { email, password } = req.body;
    const [rows] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
    const user = rows[0];
    if (!user) return res.sendStatus(401);
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.sendStatus(403);
    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET);
    res.json({ token });
});

// ✨ Buildings Endpoints
app.post('/buildings', authenticate, async (req, res) => {
    const { name, type, square_footage, cost_per_sqft } = req.body;
    const id = uuidv4();
    try {
        await db.execute('INSERT INTO buildings (id, name, type, square_footage, cost_per_sqft) VALUES (?, ?, ?, ?, ?)', [id, name, type, square_footage, cost_per_sqft]);
        await logAction(req.user.id, 'CREATE', 'building', id);
        res.status(201).json({ id });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/buildings', authenticate, async (req, res) => {
    const [rows] = await db.execute('SELECT * FROM buildings');
    res.json(rows);
});

app.get('/buildings/:id', authenticate, async (req, res) => {
    const [rows] = await db.execute('SELECT * FROM buildings WHERE id = ?', [req.params.id]);
    if (!rows.length) return res.sendStatus(404);
    res.json(rows[0]);
});

// 🏢 Building Types Endpoint
app.get('/building-types/:type', authenticate, async (req, res) => {
    try {
        const [rows] = await db.execute(
            'SELECT * FROM building_type_mappings WHERE building_type = ?',
            [req.params.type]
        );
        if (!rows.length) return res.status(404).json({ message: 'Building type not found' });
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 📝 Pre-Assessment Endpoints
app.post('/pre-assessments', authenticate, async (req, res) => {
    const { building_id } = req.body;
    const id = uuidv4();
    try {
        await db.execute('INSERT INTO pre_assessments (id, building_id, created_by, created_at) VALUES (?, ?, ?, NOW())', [id, building_id, req.user.id]);
        await logAction(req.user.id, 'CREATE', 'pre_assessment', id);
        res.status(201).json({ id });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/pre-assessments/:id/items', authenticate, async (req, res) => {
    const assessment_id = req.params.id;
    const { items } = req.body; // Array of { category, subcategory, score }
    try {
        for (const item of items) {
            const item_id = uuidv4();
            await db.execute(
                'INSERT INTO pre_assessment_items (id, pre_assessment_id, category, subcategory, score) VALUES (?, ?, ?, ?, ?)',
                [item_id, assessment_id, item.category, item.subcategory, item.score]
            );
        }
        await logAction(req.user.id, 'ADD_ITEMS', 'pre_assessment', assessment_id);
        res.status(201).json({ message: 'Items added' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/pre-assessments/:building_id', authenticate, async (req, res) => {
    try {
        const [rows] = await db.execute(
            'SELECT * FROM pre_assessments WHERE building_id = ?',
            [req.params.building_id]
        );
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 🧾 Field Assessment Endpoints
app.post('/field-assessments', authenticate, async (req, res) => {
    const { building_id } = req.body;
    const id = uuidv4();
    try {
        await db.execute('INSERT INTO field_assessments (id, building_id, created_by, created_at) VALUES (?, ?, ?, NOW())', [id, building_id, req.user.id]);
        await logAction(req.user.id, 'CREATE', 'field_assessment', id);
        res.status(201).json({ id });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/field-assessments/:id/items', authenticate, async (req, res) => {
    const assessment_id = req.params.id;
    const { items } = req.body; // Array of { category, subcategory, condition }
    try {
        for (const item of items) {
            const item_id = uuidv4();
            await db.execute(
                'INSERT INTO field_assessment_items (id, field_assessment_id, category, subcategory, condition) VALUES (?, ?, ?, ?, ?)',
                [item_id, assessment_id, item.category, item.subcategory, item.condition]
            );
        }
        await logAction(req.user.id, 'ADD_ITEMS', 'field_assessment', assessment_id);
        res.status(201).json({ message: 'Items added' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/field-assessments/:id/repair-costs', authenticate, async (req, res) => {
    const assessment_id = req.params.id;
    const { costs } = req.body; // Array of { item_id, repair_cost }
    try {
        for (const entry of costs) {
            await db.execute(
                'UPDATE field_assessment_items SET repair_cost = ? WHERE id = ?',
                [entry.repair_cost, entry.item_id]
            );
        }
        await logAction(req.user.id, 'UPDATE_COSTS', 'field_assessment', assessment_id);
        res.status(200).json({ message: 'Repair costs updated' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 🪵 Audit Logger
const logAction = async (userId, action, objectType, objectId) => {
    const id = uuidv4();
    await db.execute(
        'INSERT INTO audit_logs (id, user_id, action, object_type, object_id, timestamp) VALUES (?, ?, ?, ?, ?, NOW())',
        [id, userId, action, objectType, objectId]
    );
};

// 🏁 Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`ONYX API running on port ${PORT}`));
