const jwt = require('jsonwebtoken');

exports.authenticate = (req, res, next) => {
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

exports.authorize = (roles = []) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) return res.sendStatus(403);
        next();
    };
};
