"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const favoriteController_1 = require("../controllers/favoriteController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = express_1.default.Router();
router.use(authMiddleware_1.protect); // Toutes les routes de favoris n\u00e9cessitent d'\u00eatre connect\u00e9
router.route('/')
    .post(favoriteController_1.addFavorite)
    .get(favoriteController_1.getMyFavorites);
router.route('/:propertyId')
    .delete(favoriteController_1.removeFavorite);
exports.default = router;
