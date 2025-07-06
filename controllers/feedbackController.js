const Feedback = require('../models/Feedback');
const User = require('../models/User');

// Submit feedback for a course
exports.submitFeedback = async (req, res) => {
  try {
    const { courseId, rating, review } = req.body;
    
    if (!courseId || !rating || !review) {
      return res.status(400).json({ message: 'Missing required fields.' });
    }
    
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5.' });
    }
    
    if (review.length < 10) {
      return res.status(400).json({ message: 'Review must be at least 10 characters long.' });
    }
    
    // Check if user has purchased the course
    const user = await User.findById(req.user._id);
    if (!user.enrolledCourses.some(ec => ec.courseId.toString() === courseId)) {
      return res.status(403).json({ message: 'You must purchase the course before providing feedback.' });
    }
    
    // Create or update feedback
    const feedback = await Feedback.findOneAndUpdate(
      { courseId, userId: req.user._id },
      { rating, review },
      { upsert: true, new: true }
    );
    
    res.status(201).json(feedback);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ message: 'You have already submitted feedback for this course.' });
    }
    res.status(500).json({ message: 'Error submitting feedback', error: err.message });
  }
};

// Get feedback for a course
exports.getCourseFeedback = async (req, res) => {
  try {
    const { courseId } = req.params;
    const feedback = await Feedback.find({ courseId })
      .populate('userId', 'name profileImage')
      .sort({ createdAt: -1 });
    
    res.json(feedback);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching feedback', error: err.message });
  }
}; 