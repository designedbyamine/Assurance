const express = require('express');
const router = express.Router();
const expertController = require('../controllers/expertController');
const { authMiddleware, expertMiddleware, adminMiddleware } = require('../middlewares/authmiddlewares');

// Middleware for authentication and expert authorization
router.use(authMiddleware);
router.use(expertMiddleware);

// Route to list all assigned constats
router.get('/assigned-constats/',authMiddleware, expertMiddleware, expertController.listAssignedConstats);

// Route to view details of a specific constat
router.get('/constat-details/:constatId',authMiddleware, expertMiddleware, expertController.viewConstatDetails);

// Route to update a dossier
router.put('/update-dossier/:constatId',authMiddleware, expertMiddleware, expertController.updateDossier);

module.exports = router;
