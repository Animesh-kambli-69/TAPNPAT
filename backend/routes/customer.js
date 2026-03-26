const express = require('express');
const customerController = require('../controllers/customerController');
const authMiddleware = require('../middleware/auth');
const roleCheckMiddleware = require('../middleware/roleCheck');

const router = express.Router();

// All routes protected with auth
router.use(authMiddleware);
router.use(roleCheckMiddleware('customer'));

router.get('/wallet', customerController.getWallet);
router.post('/topup', customerController.topupWallet);
router.get('/transactions', customerController.getTransactions);
router.get('/rides', customerController.getRideHistory);
router.get('/analytics', customerController.getAnalytics);

module.exports = router;
