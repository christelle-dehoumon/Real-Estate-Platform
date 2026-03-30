const Property = require('../models/Property');

const createProperty = async (req, res) => {
    try {
        const body = req.body;

        // Handle file uploads if any
        let images = [];
        let idCard = '';
        let titleDeedOrLease = '';

        if (req.files) {
            if (req.files.images) {
                images = req.files.images.map(file => file.path);
            }
            if (req.files.idCard) {
                idCard = `/uploads/${req.files.idCard[0].filename}`;
            }
            if (req.files.titleDeedOrLease) {
                titleDeedOrLease = `/uploads/${req.files.titleDeedOrLease[0].filename}`;
            }
        }

        // Parse nested fields if they come as strings (common with FormData)
        const location = typeof body.location === 'string' ? JSON.parse(body.location) : body.location;
        const features = typeof body.features === 'string' ? JSON.parse(body.features) : body.features;

        const amenities = typeof body.amenities === 'string' ? JSON.parse(body.amenities) : (body.amenities || []);

        const propertyData = {
            title: body.title,
            description: body.description,
            price: Number(body.price),
            transactionType: body.transactionType,
            propertyType: body.propertyType,
            location: location || { city: body.city, address: body.address },
            features: features || {
                area: Number(body.area || body.surface),
                bedrooms: Number(body.bedrooms),
                bathrooms: Number(body.bathrooms)
            },
            amenities: amenities,
            images: images.length > 0 ? images : (body.images ? (Array.isArray(body.images) ? body.images : [body.images]) : []),
            documents: {
                idCard,
                titleDeedOrLease
            },
            owner: req.user?.id
        };

        const property = await Property.create(propertyData);
        res.status(201).json(property);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la création de la propriété', error: error.message });
    }
};

const getProperties = async (req, res) => {
    try {
        const filters = {};
        if (req.query.city) filters['location.city'] = new RegExp(req.query.city, 'i');
        if (req.query.transactionType) filters.transactionType = req.query.transactionType;
        if (req.query.propertyType && req.query.propertyType !== 'all') filters.propertyType = req.query.propertyType;
        if (req.query.owner) filters.owner = req.query.owner;

        if (req.query.maxPrice) {
            filters.price = { $lte: Number(req.query.maxPrice) };
        }

        if (req.query.amenities) {
            const amenArr = Array.isArray(req.query.amenities) ? req.query.amenities : [req.query.amenities];
            filters.amenities = { $all: amenArr };
        }

        // Filter by status if not admin
        if (!req.user || req.user.role !== 'admin') {
            if (req.query.owner && req.user && req.query.owner === req.user.id) {
                // User can see their own properties regardless of status
            } else {
                filters.status = 'approved';
            }
        }

        const properties = await Property.find(filters).populate('owner', 'name email phone');
        res.json(properties);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la récupération des propriétés', error: error.message });
    }
};

const getPropertyById = async (req, res) => {
    try {
        const property = await Property.findById(req.params.id).populate('owner', 'name email phone');
        if (property) {
            res.json(property);
        } else {
            res.status(404).json({ message: 'Propriété non trouvée' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la récupération de la propriété', error: error.message });
    }
};

const updateProperty = async (req, res) => {
    try {
        const property = await Property.findById(req.params.id);
        if (!property) {
            return res.status(404).json({ message: 'Propriété non trouvée' });
        }

        if (property.owner.toString() !== req.user?.id && req.user?.role !== 'admin') {
            return res.status(403).json({ message: 'Non autorisé à modifier cette propriété' });
        }

        const updatedProperty = await Property.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedProperty);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la modification de la propriété', error: error.message });
    }
};

const deleteProperty = async (req, res) => {
    try {
        const property = await Property.findById(req.params.id);
        if (!property) {
            return res.status(404).json({ message: 'Propriété non trouvée' });
        }

        if (property.owner.toString() !== req.user?.id && req.user?.role !== 'admin') {
            return res.status(403).json({ message: 'Non autorisé à supprimer cette propriété' });
        }

        await Property.findByIdAndDelete(req.params.id);
        res.json({ message: 'Propriété supprimée' });
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la suppression de la propriété', error: error.message });
    }
};

module.exports = {
    createProperty,
    getProperties,
    getPropertyById,
    updateProperty,
    deleteProperty
};
