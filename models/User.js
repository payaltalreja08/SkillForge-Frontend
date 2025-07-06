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
    completed: { type: Boolean, default: false },
    modulesProgress: {
      type: [
        {
          moduleIndex: Number,
          videosWatched: [Number],
          completed: { type: Boolean, default: false }
        }
      ],
      default: []
    },
    quizzesProgress: {
      type: [
        {
          moduleIndex: Number,
          quizzesCompleted: [Number]
        }
      ],
      default: []
    }
  }],
  totalStreak: { type: Number, default: 0 },
  certificates: [{ type: String }],

  // Instructor
  domain: { type: String },
  experience: { type: Number },
  totalRevenue: { type: Number, default: 0 },
  avgRating: { type: Number, default: 0 },

  // Remove purchasedCourses array from schema

}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);

