const express = require('express');
const { getClientProfile, updateClientProfile, getClientConstats } = require('../controllers/clientController');
const { authMiddleware, clientMiddleware, expertMiddleware, adminMiddleware } = require('../middlewares/authmiddlewares'); // Adjust middleware path if necessary

const router = express.Router();

// Route to get client's profile
router.get('/myprofile',authMiddleware, clientMiddleware, getClientProfile);

// Route to update client's profile
router.put('/profile', authMiddleware, clientMiddleware, updateClientProfile);

//get my constats as a client
router.get('/myconstats', authMiddleware, clientMiddleware, getClientConstats);


module.exports = router;
