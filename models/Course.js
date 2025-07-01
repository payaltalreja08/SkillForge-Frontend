const mongoose = require('mongoose');

const moduleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  topics: [{
    type: String,
    required: true
  }],
  duration: {
    type: Number, // in minutes 
    required: true
  },
  videos: [{
    url: { type: String, default: '' },
    description: { type: String, default: '' }
  }],
  quizzes: [
    {
      question: { type: String, required: true },
      options: [{ type: String, required: true }],
      correctAnswer: { type: String, required: true }
    }
  ]
});

const courseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide course name'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Please provide course description']
  },
  instructor: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  instructorName: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: [true, 'Please provide course price']
  },
  duration: {
    type: Number, // in hours
    required: true
  },
  modules: [moduleSchema],
  rating: {
    type: Number,
    default: 0
  },
  studentsEnrolled: {
    type: Number,
    default: 0
  },
  totalRevenue: {
    type: Number,
    default: 0
  },
  ratingDistribution: {
    1: { type: Number, default: 0 },
    2: { type: Number, default: 0 },
    3: { type: Number, default: 0 },
    4: { type: Number, default: 0 },
    5: { type: Number, default: 0 }
  },
  category: {
    type: String,
    required: true
  },
  level: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    required: true
  },
  thumbnail: {
    type: String,
    default: 'default-course.jpg'
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Index for search functionality
courseSchema.index({ 
  name: 'text', 
  description: 'text', 
  instructorName: 'text',
  category: 'text'
});

module.exports = mongoose.model('Course', courseSchema); 