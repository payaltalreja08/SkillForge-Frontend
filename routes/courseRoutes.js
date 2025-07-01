const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');
const { authenticateToken, requireAuth } = require('../middleware/auth');
const uploadVideos = require('../middleware/uploadVideo');
const commentController = require('../controllers/commentController');
const feedbackController = require('../controllers/feedbackController');
const certificateController = require('../controllers/certificateController');
const upload = require('../middleware/upload');

// Custom middleware to handle any video field names
const handleVideoUploads = (req, res, next) => {
  // Use multer's any() to accept any field name
  const uploadAny = uploadVideos.any();
  uploadAny(req, res, (err) => {
    if (err) {
      console.error('Video upload error:', err);
      return next(err);
    }
    next();
  });
};

// Public routes
router.get('/', courseController.getAllCourses);
router.get('/categories', courseController.getCourseCategories);
router.get('/instructor/:instructorId', courseController.getCoursesByInstructor);

// Comments endpoints (before parameterized routes)
router.post('/comments', requireAuth, commentController.addComment);
router.get('/comments', commentController.getComments);

// Feedback endpoints (before parameterized routes)
router.post('/feedback', requireAuth, feedbackController.submitFeedback);
router.get('/feedback/:courseId', feedbackController.getCourseFeedback);

// Certificate endpoint (before parameterized routes)
router.get('/certificate/:courseId', requireAuth, certificateController.generateCertificate);

// Enrollment endpoints (before parameterized routes)
router.post('/enroll', requireAuth, courseController.enrollInCourse);
router.get('/enrollment/:courseId', requireAuth, courseController.checkEnrollment);
router.post('/update-time', requireAuth, courseController.updateTimeSpent);

// Parameterized routes (must come after specific routes)
router.get('/:id', courseController.getCourseById);

// Protected routes (require authentication)
router.post('/', authenticateToken, upload.single('thumbnail'), uploadVideos.array('videos', 20), courseController.createCourse);
router.put('/:id', authenticateToken, upload.single('thumbnail'), uploadVideos.array('videos', 20), courseController.updateCourse);
router.delete('/:id', authenticateToken, courseController.deleteCourse);

module.exports = router; 