"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const dotenv_1 = __importDefault(require("dotenv"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const db_1 = __importDefault(require("./config/db"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const propertyRoutes_1 = __importDefault(require("./routes/propertyRoutes"));
const messageRoutes_1 = __importDefault(require("./routes/messageRoutes"));
const supervisionRoutes_1 = __importDefault(require("./routes/supervisionRoutes"));
const favoriteRoutes_1 = __importDefault(require("./routes/favoriteRoutes"));
const swagger_1 = require("./config/swagger");
dotenv_1.default.config();
const app = (0, express_1.default)();
// Security Middleware
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)());
// Rate Limiting
const limiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    standardHeaders: true,
    legacyHeaders: false,
});
app.use(limiter);
app.use(express_1.default.json());
// Set up Swagger API Docs
(0, swagger_1.setupSwagger)(app);
// Routes
app.use('/api/auth', authRoutes_1.default);
app.use('/api/properties', propertyRoutes_1.default);
app.use('/api/messages', messageRoutes_1.default);
app.use('/api/supervision', supervisionRoutes_1.default);
app.use('/api/favorites', favoriteRoutes_1.default);
app.get('/', (req, res) => {
    res.send('Fasohabitat API is running');
});
// Database Connection
(0, db_1.default)();
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
