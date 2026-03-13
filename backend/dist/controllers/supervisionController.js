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
exports.deleteUser = exports.getAllUsers = exports.getGlobalStats = exports.deleteReport = exports.blockProperty = exports.getReports = void 0;
const Report_1 = require("../models/Report");
const Property_1 = require("../models/Property");
const User_1 = require("../models/User");
// @desc    Voir les signalements
const getReports = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const reports = yield Report_1.Report.find({}).populate('reporter', 'name email').populate('property', 'title');
        res.json(reports);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching reports', error });
    }
});
exports.getReports = getReports;
// @desc    Bloquer une annonce signal\u00e9e
const blockProperty = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const property = yield Property_1.Property.findById(req.params.propertyId);
        if (!property) {
            return res.status(404).json({ message: 'Property not found' });
        }
        res.json({ message: `Propri\u00e9t\u00e9 ${req.params.propertyId} bloqu\u00e9e par l'administration` });
    }
    catch (error) {
        res.status(500).json({ message: 'Error blocking property', error });
    }
});
exports.blockProperty = blockProperty;
// @desc    Supprimer un signalement trait\u00e9
const deleteReport = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield Report_1.Report.findByIdAndDelete(req.params.id);
        res.json({ message: 'Signalement supprim\u00e9' });
    }
    catch (error) {
        res.status(500).json({ message: 'Error deleting report', error });
    }
});
exports.deleteReport = deleteReport;
// @desc    Statistiques globales (Supervision)
const getGlobalStats = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const totalUsers = yield User_1.User.countDocuments();
        const totalProperties = yield Property_1.Property.countDocuments();
        const pendingReports = yield Report_1.Report.countDocuments({ status: 'pending' });
        res.json({
            totalUsers,
            totalProperties,
            pendingReports,
            timestamp: new Date()
        });
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching stats', error });
    }
});
exports.getGlobalStats = getGlobalStats;
// @desc    Lister tous les utilisateurs (Supervision)
const getAllUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield User_1.User.find({}).select('-password');
        res.json(users);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching users', error });
    }
});
exports.getAllUsers = getAllUsers;
// @desc    Supprimer un utilisateur (Supervision)
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield User_1.User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        if (user.role === 'admin') {
            return res.status(400).json({ message: 'Cannot delete an admin' });
        }
        yield User_1.User.deleteOne({ _id: user._id });
        yield Property_1.Property.deleteMany({ owner: user._id });
        res.json({ message: 'User and their properties removed' });
    }
    catch (error) {
        res.status(500).json({ message: 'Error deleting user', error });
    }
});
exports.deleteUser = deleteUser;
