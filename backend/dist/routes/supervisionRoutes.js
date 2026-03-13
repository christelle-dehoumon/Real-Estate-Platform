"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const supervisionController_1 = require("../controllers/supervisionController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = express_1.default.Router();
router.get('/reports', authMiddleware_1.protect, authMiddleware_1.adminOnly, supervisionController_1.getReports);
router.put('/block/:propertyId', authMiddleware_1.protect, authMiddleware_1.adminOnly, supervisionController_1.blockProperty);
router.delete('/report/:id', authMiddleware_1.protect, authMiddleware_1.adminOnly, supervisionController_1.deleteReport);
router.get('/stats', authMiddleware_1.protect, authMiddleware_1.adminOnly, supervisionController_1.getGlobalStats);
router.get('/users', authMiddleware_1.protect, authMiddleware_1.adminOnly, supervisionController_1.getAllUsers);
router.delete('/users/:id', authMiddleware_1.protect, authMiddleware_1.adminOnly, supervisionController_1.deleteUser);
exports.default = router;
