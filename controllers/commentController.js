const Comment = require('../models/Comment');

// Post a comment
exports.addComment = async (req, res) => {
  try {
    const { courseId, moduleIndex, videoIndex, text } = req.body;
    if (!courseId || moduleIndex === undefined || videoIndex === undefined || !text) {
      return res.status(400).json({ message: 'Missing required fields.' });
    }
    const comment = await Comment.create({
      courseId,
      moduleIndex,
      videoIndex,
      userId: req.user._id,
      text
    });
    res.status(201).json(comment);
  } catch (err) {
    res.status(500).json({ message: 'Error posting comment', error: err.message });
  }
};

// Get comments for a video
exports.getComments = async (req, res) => {
  try {
    const { courseId, moduleIndex, videoIndex } = req.query;
    if (!courseId || moduleIndex === undefined || videoIndex === undefined) {
      return res.status(400).json({ message: 'Missing required query params.' });
    }
    const comments = await Comment.find({
      courseId,
      moduleIndex: Number(moduleIndex),
      videoIndex: Number(videoIndex)
    }).populate('userId', 'name profileImage').sort({ createdAt: 1 });
    res.json(comments);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching comments', error: err.message });
  }
}; 