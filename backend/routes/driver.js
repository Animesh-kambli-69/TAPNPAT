const express = require('express');
const driverController = require('../controllers/driverController');
const authMiddleware = require('../middleware/auth');
const roleCheckMiddleware = require('../middleware/roleCheck');

const router = express.Router();

// All routes protected with auth
router.use(authMiddleware);
router.use(roleCheckMiddleware('driver'));

router.get('/dashboard', driverController.getDashboard);
router.get('/rides', driverController.getRides);
router.get('/earnings', driverController.getEarnings);
router.get('/analytics/:period', driverController.getAnalytics);
router.get('/transactions', driverController.getTransactions);

module.exports = router;
