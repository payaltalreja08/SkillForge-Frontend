const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { requireAuth } = require('../middleware/auth');

// User dashboard routes
router.get('/dashboard', requireAuth, userController.getUserDashboard);

module.exports = router; 