// authRoutes.js
const express = require('express');
const router = express.Router();

// Importez correctement le contrôleur d'authentification
const AuthController = require('../controllers/authController');

// Assurez-vous que la méthode login est correctement définie dans le contrôleur
router.post('/login', AuthController.login);
router.post('/signup', AuthController.signup);

module.exports = router;
