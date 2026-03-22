const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const dotenv = require('dotenv');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const propertyRoutes = require('./routes/propertyRoutes');
const messageRoutes = require('./routes/messageRoutes');
const supervisionRoutes = require('./routes/supervisionRoutes');
const favoriteRoutes = require('./routes/favoriteRoutes');
const { setupSwagger } = require('./config/swagger');

dotenv.config();

const app = express();

// Security Middleware
app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" }
}));
app.use(cors());

// Rate Limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 1000, // Augmenté à 1000 pour éviter le blocage du polling en développement
    standardHeaders: true,
    legacyHeaders: false,
    message: { message: "Trop de requêtes, veuillez réessayer plus tard." } // Retourne du JSON
});
app.use(limiter);

app.use(express.json());

// Maintenir les dossiers d'uploads accessibles
const path = require('path');
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// Set up Swagger API Docs
setupSwagger(app);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/properties', propertyRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/supervision', supervisionRoutes);
app.use('/api/favorites', favoriteRoutes);

// Global error handler to always return JSON (including Multer errors)
app.use((err, req, res, next) => {
    console.error(err);
    const statusCode = err.status || (err.name === 'MulterError' ? 400 : 500);
    res.status(statusCode).json({
        message: err.message || 'Erreur serveur',
    });
});

app.get('/', (req, res) => {
    res.send('Fasohabitat API is running');
});

// Database Connection
connectDB();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
