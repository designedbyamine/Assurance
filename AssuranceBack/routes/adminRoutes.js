const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { authMiddleware, adminMiddleware } = require('../middlewares/authmiddlewares');

// Middleware for authentication and admin authorization
router.use(authMiddleware);
router.use(adminMiddleware);

// Route to approve an expert account
router.put('/approve-expert/:userId',authMiddleware, adminMiddleware, adminController.approveExpert);

// Route to reject a pending expert account
router.delete('/reject-expert/:userId',authMiddleware, adminMiddleware, adminController.rejectExpert);

// Route to list all pending expert accounts
router.get('/pending-experts',authMiddleware, adminMiddleware, adminController.listPendingExperts);

// Route to view all constats submitted by clients
router.get('/constats',authMiddleware, adminMiddleware, adminController.viewAllConstats);

// Route to approve or reject a constat
router.put('/constat/:constatId/status',authMiddleware, adminMiddleware, adminController.approveOrRejectConstat);

// Route to assign an expert to an approved constat
router.put('/constat/:constatId/assign-expert',authMiddleware, adminMiddleware, adminController.assignExpertToConstat);

// Route to list all available experts
router.get('/available-experts',authMiddleware, adminMiddleware, adminController.listAvailableExperts);

// Route to get global dashboard statistics
router.get('/stats',authMiddleware, adminMiddleware, adminController.getGlobalStats);

module.exports = router;
