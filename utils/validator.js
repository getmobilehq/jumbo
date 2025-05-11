const Joi = require('joi');

// Generic validation middleware
exports.validateBody = (schema) => (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }
    next();
};

// Schemas
exports.schemas = {
    register: Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().min(8).required(),
        role: Joi.string().valid('user', 'admin').optional()
    }),
    login: Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().min(8).required()
    }),
    building: Joi.object({
        name: Joi.string().min(2).required(),
        type: Joi.string().required(),
        square_footage: Joi.number().integer().min(1).required(),
        cost_per_sqft: Joi.number().positive().required()
    })
};
