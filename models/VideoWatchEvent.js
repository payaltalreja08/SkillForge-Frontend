const mongoose = require('mongoose');

const videoWatchEventSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  moduleIndex: { type: Number, required: true },
  videoIndex: { type: Number, required: true },
  watchedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('VideoWatchEvent', videoWatchEventSchema); 