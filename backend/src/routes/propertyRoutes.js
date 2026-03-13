const express = require('express');
const { createProperty, getProperties, getPropertyById, updateProperty, deleteProperty } = require('../controllers/propertyController');
const { protect, optionalProtect } = require('../middleware/authMiddleware');

const upload = require('../middleware/uploadMiddleware');

const router = express.Router();

router.route('/')
    .post(protect, upload.fields([
        { name: 'images', maxCount: 10 },
        { name: 'idCard', maxCount: 1 },
        { name: 'titleDeedOrLease', maxCount: 1 }
    ]), createProperty)
    .get(optionalProtect, getProperties);

router.route('/:id')
    .get(getPropertyById)
    .put(protect, updateProperty)
    .delete(protect, deleteProperty);

module.exports = router;
