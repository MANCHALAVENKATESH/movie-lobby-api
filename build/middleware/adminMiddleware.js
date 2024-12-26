"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const adminMiddleware = (req, res, next) => {
    if (!req.headers.isadmin || req.headers.isadmin !== 'true') {
        res.status(403).json({ error: 'Admin privileges required' });
    }
    next(); // If the user is an admin, proceed to the next middleware or route handler
};
exports.default = adminMiddleware;
