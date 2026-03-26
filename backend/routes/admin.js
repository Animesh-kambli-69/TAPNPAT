const express = require('express');
const adminController = require('../controllers/adminController');
const authMiddleware = require('../middleware/auth');
const roleCheckMiddleware = require('../middleware/roleCheck');

const router = express.Router();

// All routes protected with auth
router.use(authMiddleware);
router.use(roleCheckMiddleware('admin'));

router.get('/dashboard', adminController.getDashboard);
router.get('/users', adminController.getUsers);
router.put('/users/:userId/role', adminController.updateUserRole);
router.get('/transactions', adminController.getTransactions);
router.get('/analytics', adminController.getAnalytics);

module.exports = router;
