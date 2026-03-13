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
exports.deleteProperty = exports.updateProperty = exports.getPropertyById = exports.getProperties = exports.createProperty = void 0;
const Property_1 = require("../models/Property");
const createProperty = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const propertyData = Object.assign(Object.assign({}, req.body), { owner: (_a = req.user) === null || _a === void 0 ? void 0 : _a.id });
        const property = yield Property_1.Property.create(propertyData);
        res.status(201).json(property);
    }
    catch (error) {
        res.status(500).json({ message: 'Error creating property', error });
    }
});
exports.createProperty = createProperty;
const getProperties = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const filters = {};
        if (req.query.city)
            filters['location.city'] = new RegExp(req.query.city, 'i');
        if (req.query.transactionType)
            filters.transactionType = req.query.transactionType;
        const properties = yield Property_1.Property.find(filters).populate('owner', 'name email phone');
        res.json(properties);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching properties', error });
    }
});
exports.getProperties = getProperties;
const getPropertyById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const property = yield Property_1.Property.findById(req.params.id).populate('owner', 'name email phone');
        if (property) {
            res.json(property);
        }
        else {
            res.status(404).json({ message: 'Property not found' });
        }
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching property', error });
    }
});
exports.getPropertyById = getPropertyById;
const updateProperty = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const property = yield Property_1.Property.findById(req.params.id);
        if (!property) {
            res.status(404).json({ message: 'Property not found' });
            return;
        }
        if (property.owner.toString() !== ((_a = req.user) === null || _a === void 0 ? void 0 : _a.id) && ((_b = req.user) === null || _b === void 0 ? void 0 : _b.role) !== 'admin') {
            res.status(403).json({ message: 'Not authorized to update this property' });
            return;
        }
        const updatedProperty = yield Property_1.Property.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedProperty);
    }
    catch (error) {
        res.status(500).json({ message: 'Error updating property', error });
    }
});
exports.updateProperty = updateProperty;
const deleteProperty = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const property = yield Property_1.Property.findById(req.params.id);
        if (!property) {
            res.status(404).json({ message: 'Property not found' });
            return;
        }
        if (property.owner.toString() !== ((_a = req.user) === null || _a === void 0 ? void 0 : _a.id) && ((_b = req.user) === null || _b === void 0 ? void 0 : _b.role) !== 'admin') {
            res.status(403).json({ message: 'Not authorized to delete this property' });
            return;
        }
        yield Property_1.Property.findByIdAndDelete(req.params.id);
        res.json({ message: 'Property removed' });
    }
    catch (error) {
        res.status(500).json({ message: 'Error deleting property', error });
    }
});
exports.deleteProperty = deleteProperty;
