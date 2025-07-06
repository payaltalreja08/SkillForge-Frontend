const User = require('../models/User');
const Course = require('../models/Course');
const VideoWatchEvent = require('../models/VideoWatchEvent');

// Mark a video as watched
exports.markVideoWatched = async (req, res) => {
  try {
    const userId = req.user._id;
    const { courseId, moduleIndex, videoIndex } = req.body;
    if (moduleIndex === undefined || videoIndex === undefined) {
      return res.status(400).json({ message: 'moduleIndex and videoIndex are required.' });
    }
    const user = await User.findById(userId);
    const enrolled = user.enrolledCourses.find(ec => ec.courseId.toString() === courseId);
    if (!enrolled) return res.status(403).json({ message: 'Course not enrolled.' });
    let moduleProgress = enrolled.modulesProgress.find(mp => mp.moduleIndex === moduleIndex);
    if (!moduleProgress) {
      moduleProgress = { moduleIndex, videosWatched: [], completed: false };
      enrolled.modulesProgress.push(moduleProgress);
    }
    if (!moduleProgress.videosWatched.includes(videoIndex)) {
      moduleProgress.videosWatched.push(videoIndex);
    }
    await user.save();
    // Log video watch event
    await VideoWatchEvent.create({
      userId,
      courseId,
      moduleIndex,
      videoIndex,
      watchedAt: new Date()
    });
    res.json({ message: 'Video marked as watched.' });
  } catch (err) {
    res.status(500).json({ message: 'Error updating video progress', error: err.message });
  }
};

// Mark a quiz as completed
exports.markQuizCompleted = async (req, res) => {
  try {
    const userId = req.user._id;
    const { courseId, moduleIndex, quizIndex } = req.body;
    if (moduleIndex === undefined || quizIndex === undefined) {
      return res.status(400).json({ message: 'moduleIndex and quizIndex are required.' });
    }
    const user = await User.findById(userId);
    const enrolled = user.enrolledCourses.find(ec => ec.courseId.toString() === courseId);
    if (!enrolled) return res.status(403).json({ message: 'Course not enrolled.' });
    let quizProgress = enrolled.quizzesProgress.find(qp => qp.moduleIndex === moduleIndex);
    if (!quizProgress) {
      quizProgress = { moduleIndex, quizzesCompleted: [] };
      enrolled.quizzesProgress.push(quizProgress);
    }
    if (!quizProgress.quizzesCompleted.includes(quizIndex)) {
      quizProgress.quizzesCompleted.push(quizIndex);
    }
    await user.save();
    res.json({ message: 'Quiz marked as completed.' });
  } catch (err) {
    res.status(500).json({ message: 'Error updating quiz progress', error: err.message });
  }
};

// Get course progress
exports.getCourseProgress = async (req, res) => {
  try {
    const userId = req.user._id;
    const { courseId } = req.params;
    const user = await User.findById(userId);
    const enrolled = user.enrolledCourses.find(ec => ec.courseId.toString() === courseId);
    if (!enrolled) return res.status(403).json({ message: 'Course not enrolled.' });
    res.json({ modulesProgress: enrolled.modulesProgress, quizzesProgress: enrolled.quizzesProgress });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching progress', error: err.message });
  }
}; 