const mongoose = require('mongoose');

const progressSchema = new mongoose.Schema({
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  progress: { type: Object, default: {} }, // Store progress as key-value pairs
  lastAccessed: { type: Date, default: Date.now }
});

// Ensure one progress record per user per course
progressSchema.index({ courseId: 1, userId: 1 }, { unique: true });

module.exports = mongoose.model('Progress', progressSchema); 