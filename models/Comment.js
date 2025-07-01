const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  moduleIndex: {
    type: Number,
    required: true
  },
  videoIndex: {
    type: Number,
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  text: {
    type: String,
    required: true,
    trim: true
  }
}, {
  timestamps: true
});

// Index for efficient querying
commentSchema.index({ courseId: 1, moduleIndex: 1, videoIndex: 1 });

module.exports = mongoose.model('Comment', commentSchema); 