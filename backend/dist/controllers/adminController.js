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
exports.getPlatformStats = exports.deleteUser = exports.getAllUsers = void 0;
const User_1 = require("../models/User");
const Property_1 = require("../models/Property");
// @desc    Obtenir la liste de tous les utilisateurs (Admin seulement)
// @route   GET /api/admin/users
// @access  Private/Admin
const getAllUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield User_1.User.find({}).select('-password');
        res.json(users);
    }
    catch (error) {
        res.status(500).json({ message: 'Erreur lors de la r\u00e9cup\u00e9ration des utilisateurs', error });
    }
});
exports.getAllUsers = getAllUsers;
// @desc    Supprimer un utilisateur (Admin seulement)
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield User_1.User.findById(req.params.id);
        if (user) {
            if (user.role === 'admin') {
                return res.status(400).json({ message: 'Impossible de supprimer un autre administrateur' });
            }
            yield User_1.User.deleteOne({ _id: user._id });
            // Optionnel: Supprimer aussi les propri\u00e9t\u00e9s de l'utilisateur
            yield Property_1.Property.deleteMany({ owner: user._id });
            res.json({ message: 'Utilisateur et ses propri\u00e9t\u00e9s supprim\u00e9s' });
        }
        else {
            res.status(404).json({ message: 'Utilisateur non trouv\u00e9' });
        }
    }
    catch (error) {
        res.status(500).json({ message: 'Erreur lors de la suppression', error });
    }
});
exports.deleteUser = deleteUser;
// @desc    Obtenir des statistiques globales (Admin seulement)
// @route   GET /api/admin/stats
// @access  Private/Admin
const getPlatformStats = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const totalUsers = yield User_1.User.countDocuments();
        const totalProperties = yield Property_1.Property.countDocuments();
        // Distinguer Vente et Location
        const propertiesForSale = yield Property_1.Property.countDocuments({ transactionType: 'sell' });
        const propertiesForRent = yield Property_1.Property.countDocuments({ transactionType: 'rent' });
        res.json({
            totalUsers,
            totalProperties,
            propertiesForSale,
            propertiesForRent
        });
    }
    catch (error) {
        res.status(500).json({ message: 'Erreur lors de la g\u00e9n\u00e9ration des statistiques', error });
    }
});
exports.getPlatformStats = getPlatformStats;
