"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const adminController_1 = require("../controllers/adminController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = express_1.default.Router();
// Routes r\u00e9serv\u00e9es aux Administrateurs
router.route('/users')
    .get(authMiddleware_1.protect, authMiddleware_1.adminOnly, adminController_1.getAllUsers);
router.route('/users/:id')
    .delete(authMiddleware_1.protect, authMiddleware_1.adminOnly, adminController_1.deleteUser);
router.route('/stats')
    .get(authMiddleware_1.protect, authMiddleware_1.adminOnly, adminController_1.getPlatformStats);
exports.default = router;
