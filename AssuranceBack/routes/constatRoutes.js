const express = require('express');
const router = express.Router();

const { authMiddleware, clientMiddleware, expertMiddleware, adminMiddleware } = require('../middlewares/authmiddlewares');
const ConstatController = require('../controllers/constatController');
const upload = require ('../middlewares/multerMiddleware')

// Client Routes (protected routes for authenticated clients)
router.post('/create',upload.array("photos", 6), authMiddleware, clientMiddleware, ConstatController.createConstat);
router.get('/client/getconstats/:clientId', authMiddleware, clientMiddleware, ConstatController.getConstatsForClient);



// Expert Routes (protected routes for authenticated experts)
router.get('/expert/assigned', authMiddleware, expertMiddleware, ConstatController.getConstatsForExpert);
router.put('/expert/status/:constatId', authMiddleware, expertMiddleware, ConstatController.updateConstatByExpert);

// Admin Routes (protected routes for authenticated admins)
router.get('/constats', authMiddleware, adminMiddleware, ConstatController.getAllConstats);
router.get('/experts', authMiddleware, adminMiddleware, ConstatController.getAvailableExperts);

router.put('/assign-expert/:constatId', authMiddleware, adminMiddleware, ConstatController.assignExpert);
router.delete('/:constatId', authMiddleware, adminMiddleware, ConstatController.deleteConstat);
module.exports = router;
