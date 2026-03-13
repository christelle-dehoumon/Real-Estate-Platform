const express = require('express');
const { createReport, getReports, blockProperty, approveProperty, getAllProperties, deleteReport, getGlobalStats, getAllUsers, deleteUser } = require('../controllers/supervisionController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

const router = express.Router();

// Routes accessed by any authenticated user
router.use(protect);
router.post('/report', createReport);

// All routes below require admin access
router.use(adminOnly);

router.get('/reports', getReports);
router.put('/block/:propertyId', blockProperty);
router.delete('/report/:id', deleteReport);
router.get('/stats', getGlobalStats);
router.get('/users', getAllUsers);
router.delete('/users/:id', deleteUser);
router.put('/approve/:propertyId', approveProperty);
router.get('/properties', getAllProperties);

module.exports = router;
