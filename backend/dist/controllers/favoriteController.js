"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeFavorite = exports.getMyFavorites = exports.addFavorite = void 0;
const Favorite_1 = require("../models/Favorite");
// @desc    Ajouter une annonce aux favoris
// @route   POST /api/favorites
const addFavorite = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { propertyId } = req.body;
        if (!propertyId) {
            return res.status(400).json({ message: 'Property ID is required' });
        }
        const favorite = yield Favorite_1.Favorite.create({
            user: (_a = req.user) === null || _a === void 0 ? void 0 : _a.id,
            property: propertyId
        });
        res.status(201).json(favorite);
    }
    catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ message: 'Property already in favorites' });
        }
        res.status(500).json({ message: 'Error adding favorite', error });
    }
});
exports.addFavorite = addFavorite;
// @desc    Lister toutes les annonces favorites de l\u2019utilisateur connect\u00e9
// @route   GET /api/favorites
const getMyFavorites = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const favorites = yield Favorite_1.Favorite.find({ user: (_a = req.user) === null || _a === void 0 ? void 0 : _a.id })
            .populate({
            path: 'property',
            populate: { path: 'owner', select: 'name email' }
        });
        res.json(favorites);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching favorites', error });
    }
});
exports.getMyFavorites = getMyFavorites;
// @desc    Retirer une annonce des favoris
// @route   DELETE /api/favorites/:propertyId
const removeFavorite = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const result = yield Favorite_1.Favorite.findOneAndDelete({
            user: (_a = req.user) === null || _a === void 0 ? void 0 : _a.id,
            property: req.params.propertyId
        });
        if (!result) {
            return res.status(404).json({ message: 'Favorite not found' });
        }
        res.json({ message: 'Annonce retir\u00e9e des favoris' });
    }
    catch (error) {
        res.status(500).json({ message: 'Error removing favorite', error });
    }
});
exports.removeFavorite = removeFavorite;
