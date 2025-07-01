const express = require('express');
const router = express.Router();
const progressController = require('../controllers/progressController');
const { authenticateToken } = require('../middleware/auth');
const { requireCoursePurchase } = require('../middleware/accessControl');

// Mark video as watched
router.post('/video', authenticateToken, requireCoursePurchase, progressController.markVideoWatched);
// Mark quiz as completed
router.post('/quiz', authenticateToken, requireCoursePurchase, progressController.markQuizCompleted);
// Get course progress
router.get('/:courseId', authenticateToken, requireCoursePurchase, progressController.getCourseProgress);

module.exports = router; 