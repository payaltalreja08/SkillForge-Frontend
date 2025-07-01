const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: function () { return this.authType !== 'oauth'; } },
authType: { type: String, enum: ['local', 'oauth'], default: 'local' },

  role: { type: String, enum: ['student', 'instructor'], required: true },
  profileImage: { type: String, default: '' },
  joinedDate: { type: Date, default: Date.now },

  // Student
  learnerType: { type: String, enum: ['student', 'professional'] },
  degree: { type: String },
  jobType: { type: String },
  enrolledCourses: [{
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
    enrolledDate: { type: Date, default: Date.now },
    progress: { type: Number, default: 0 },
    timeSpent: { type: Number, default: 0 },
    lastAccess: { type: Date, default: Date.now },
    completed: { type: Boolean, default: false }
  }],
  totalStreak: { type: Number, default: 0 },
  lastLoginDate: { type: Date, default: Date.now },
  currentStreak: { type: Number, default: 0 },
  longestStreak: { type: Number, default: 0 },
  certificates: [{ type: String }],

  // Instructor
  domain: { type: String },
  experience: { type: Number },
  totalRevenue: { type: Number, default: 0 },
  avgRating: { type: Number, default: 0 },

  purchasedCourses: [{
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
    purchasedDate: { type: Date, default: Date.now },
    modulesProgress: [{
      moduleIndex: Number,
      videosWatched: [Number], // indexes of watched videos in the module
      completed: { type: Boolean, default: false }
    }],
    quizzesProgress: [{
      moduleIndex: Number,
      quizzesCompleted: [Number] // indexes of completed quizzes in the module
    }],
    feedback: {
      submitted: { type: Boolean, default: false },
      content: { type: String, default: '' }
    },
    certificateUrl: { type: String, default: '' },
    completed: { type: Boolean, default: false },
    lastAccess: { type: Date, default: Date.now }
  }]

}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);

