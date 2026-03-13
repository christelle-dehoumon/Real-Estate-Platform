const express = require('express');
const { addFavorite, getMyFavorites, removeFavorite } = require('../controllers/favoriteController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect); // Toutes les routes de favoris nécessitent d'être connecté

router.route('/')
    .post(addFavorite)
    .get(getMyFavorites);

router.route('/:propertyId')
    .delete(removeFavorite);

module.exports = router;
