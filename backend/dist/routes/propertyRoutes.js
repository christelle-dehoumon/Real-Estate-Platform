"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const propertyController_1 = require("../controllers/propertyController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = express_1.default.Router();
router.route('/')
    .post(authMiddleware_1.protect, propertyController_1.createProperty)
    .get(propertyController_1.getProperties);
router.route('/:id')
    .get(propertyController_1.getPropertyById)
    .put(authMiddleware_1.protect, propertyController_1.updateProperty)
    .delete(authMiddleware_1.protect, propertyController_1.deleteProperty);
exports.default = router;
