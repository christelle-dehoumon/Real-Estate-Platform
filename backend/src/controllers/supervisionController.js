const Report = require('../models/Report');
const Property = require('../models/Property');
const User = require('../models/User');

// @desc    Créer un signalement
const createReport = async (req, res) => {
    try {
        const { propertyId, reason } = req.body;
        if (!propertyId || !reason) {
            return res.status(400).json({ message: 'L\'ID de la propriété et la raison sont requis' });
        }

        const report = await Report.create({
            reporter: req.user?.id,
            property: propertyId,
            reason
        });

        res.status(201).json(report);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la création du signalement', error: error.message });
    }
};

// @desc    Voir les signalements
const getReports = async (req, res) => {
    try {
        const reports = await Report.find({}).populate('reporter', 'name email').populate('property', 'title');
        res.json(reports);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la récupération des signalements', error: error.message });
    }
};

// @desc    Bloquer une annonce signalée
const blockProperty = async (req, res) => {
    try {
        const property = await Property.findById(req.params.propertyId);
        if (!property) {
            return res.status(404).json({ message: 'Propriété non trouvée' });
        }

        // Update status to rejected/blocked
        property.status = 'rejected';
        await property.save();

        res.json({ message: `Propriété ${req.params.propertyId} bloquée par l'administration` });
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors du blocage de la propriété', error: error.message });
    }
};

// @desc    Supprimer un signalement traité
const deleteReport = async (req, res) => {
    try {
        await Report.findByIdAndDelete(req.params.id);
        res.json({ message: 'Signalement supprimé' });
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la suppression du signalement', error: error.message });
    }
};

// @desc    Statistiques globales (Supervision)
const getGlobalStats = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalProperties = await Property.countDocuments();
        const pendingReports = await Report.countDocuments({ status: 'pending' });

        res.json({
            totalUsers,
            totalProperties,
            pendingReports,
            timestamp: new Date()
        });
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la récupération des statistiques', error: error.message });
    }
};

// @desc    Lister tous les utilisateurs (Supervision)
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({}).select('-password');
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la récupération des utilisateurs', error: error.message });
    }
};

// @desc    Supprimer un utilisateur (Supervision)
const deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'Utilisateur non trouvé' });
        }
        if (user.role === 'admin') {
            return res.status(400).json({ message: 'Impossible de supprimer un administrateur' });
        }

        await User.deleteOne({ _id: user._id });
        await Property.deleteMany({ owner: user._id });

        res.json({ message: 'Utilisateur et ses annonces supprimés avec succès' });
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la suppression de l\'utilisateur', error: error.message });
    }
};

// @desc    Approuver une annonce
const approveProperty = async (req, res) => {
    try {
        const property = await Property.findById(req.params.propertyId);
        if (!property) {
            return res.status(404).json({ message: 'Propriété non trouvée' });
        }

        property.status = 'approved';
        await property.save();

        res.json({ message: `Propriété ${req.params.propertyId} approuvée` });
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de l\'approbation de la propriété', error: error.message });
    }
};

// @desc    Récupérer toutes les propriétés (Admin)
const getAllProperties = async (req, res) => {
    try {
        const properties = await Property.find({}).populate('owner', 'name email');
        res.json(properties);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la récupération de toutes les propriétés', error: error.message });
    }
};

module.exports = {
    createReport,
    getReports,
    blockProperty,
    deleteReport,
    getGlobalStats,
    getAllUsers,
    deleteUser,
    approveProperty,
    getAllProperties
};
