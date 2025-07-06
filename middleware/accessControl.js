const User = require('../models/User');
const Course = require('../models/Course');

// Middleware: Only allow access if user has purchased the course (student) or is the instructor (instructor)
const requireCoursePurchase = async (req, res, next) => {
  try {
    const user = req.user;
    const courseId = req.params.courseId || req.body.courseId;
    console.log('--- ACCESS DEBUG ---');
    console.log('User ID:', user._id);
    console.log('User Role:', user.role);
    console.log('Course ID:', courseId);
    if (!courseId) {
      console.log('No courseId provided');
      return res.status(400).json({ message: 'Course ID is required.' });
    }
    const enrolled = user.enrolledCourses?.some(ec => ec.courseId.toString() === courseId.toString());
    console.log('Enrolled:', enrolled);
    if (user.role === 'student' && enrolled) {
      console.log('Access granted: student enrolled');
      return next();
    }
    if (user.role === 'instructor') {
      const course = await Course.findById(courseId);
      console.log('Course found:', !!course);
      if (course) {
        console.log('Course instructor:', course.instructor.toString());
        console.log('User is instructor:', course.instructor.toString() === user._id.toString());
      }
      if (course && course.instructor.toString() === user._id.toString()) {
        console.log('Access granted: instructor owns course');
        return next();
      }
    }
    console.log('Access denied');
    return res.status(403).json({ message: 'You do not have access to this course.' });
  } catch (err) {
    console.log('Access control error:', err);
    res.status(500).json({ message: 'Access control error', error: err.message });
  }
};

module.exports = { requireCoursePurchase }; 