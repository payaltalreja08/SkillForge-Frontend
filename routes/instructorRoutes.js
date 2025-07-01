const express = require('express');
const router = express.Router();
const instructorController = require('../controllers/instructorController');
const { requireAuth } = require('../middleware/auth');

// Instructor dashboard routes
router.get('/dashboard', requireAuth, instructorController.getInstructorDashboard);
router.get('/analytics/:courseId', requireAuth, instructorController.getCourseAnalytics);

module.exports = router; 