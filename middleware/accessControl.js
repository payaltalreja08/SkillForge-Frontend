const User = require('../models/User');

// Middleware: Only allow access if user has purchased the course
const requireCoursePurchase = async (req, res, next) => {
  try {
    const user = req.user;
    const courseId = req.params.courseId || req.body.courseId;
    if (!courseId) {
      return res.status(400).json({ message: 'Course ID is required.' });
    }
    const purchased = user.purchasedCourses?.some(pc => pc.courseId.toString() === courseId.toString());
    if (!purchased) {
      return res.status(403).json({ message: 'You have not purchased this course.' });
    }
    next();
  } catch (err) {
    res.status(500).json({ message: 'Access control error', error: err.message });
  }
};

module.exports = { requireCoursePurchase }; 