const jwt = require('jsonwebtoken');

const protect = (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
            req.user = decoded;
            return next();
        } catch (error) {
            return res.status(401).json({ message: 'Non autorisé, échec du jeton' });
        }
    }

    if (!token) {
        return res.status(401).json({ message: 'Non autorisé, pas de jeton' });
    }
};

const optionalProtect = (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
            req.user = decoded;
        } catch (error) {
            // Ignorer l'erreur pour l'optionnel
        }
    }
    next();
};

const adminOnly = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ message: 'Non autorisé, accès administrateur requis' });
    }
};

module.exports = {
    protect,
    optionalProtect,
    adminOnly
};
