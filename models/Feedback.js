const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  review: { type: String, required: true, minlength: 10 },
  createdAt: { type: Date, default: Date.now }
});

// Ensure one feedback per user per course
feedbackSchema.index({ courseId: 1, userId: 1 }, { unique: true });

module.exports = mongoose.model('Feedback', feedbackSchema); 