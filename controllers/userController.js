const User = require('../models/User');
const Course = require('../models/Course');
const Progress = require('../models/Progress');
const Feedback = require('../models/Feedback');
const { getStreakInfo } = require('../middleware/streakTracker');

// Get user dashboard data
exports.getUserDashboard = async (req, res) => {
  try {
    const userId = req.user._id;
    
    // Get user with populated enrolled courses
    const user = await User.findById(userId).populate('enrolledCourses.courseId');
    
    // Get progress for all enrolled courses
    const progressData = await Progress.find({ userId });
    const progressMap = {};
    progressData.forEach(p => {
      progressMap[p.courseId.toString()] = p.progress;
    });
    
    // Calculate course statistics from enrolled courses
    const enrolledCourses = await Promise.all(
      user.enrolledCourses.map(async (enrollment) => {
        const course = enrollment.courseId;
        if (!course) return null; // Skip if course doesn't exist
        
        const courseProgress = progressMap[course._id.toString()] || {};
        const completedVideos = Object.values(courseProgress).filter(p => p.completed).length;
        const totalVideos = course.modules.reduce((total, module) => total + module.videos.length, 0);
        const progressPercentage = totalVideos > 0 ? Math.round((completedVideos / totalVideos) * 100) : 0;
        
        // Calculate time spent (simulated - in real app, track actual time)
        let timeSpent = 0;
        if (course.modules && course.modules.length > 0) {
          // For each module, check if all videos are watched
          course.modules.forEach((module, mIdx) => {
            const moduleVideos = module.videos.length;
            const watchedVideos = Object.keys(courseProgress)
              .filter(k => k.startsWith(`${mIdx}-`) && courseProgress[k].completed).length;
            if (watchedVideos === moduleVideos) {
              // Module fully completed, add full module duration
              timeSpent += module.duration || 0;
            } else if (watchedVideos > 0 && moduleVideos > 0) {
              // Module partially completed, add proportional duration
              timeSpent += ((watchedVideos / moduleVideos) * (module.duration || 0));
            }
          });
          timeSpent = Math.round(timeSpent * 100) / 100; // round to 2 decimals
        }
        
        // Get last accessed date
        const lastAccessed = enrollment.lastAccess || user.createdAt;
        
        // Check if course is completed
        const isCompleted = progressPercentage === 100;
        
        // Get certificate if completed
        let certificate = null;
        if (isCompleted) {
          certificate = {
            courseId: course._id,
            courseName: course.name,
            completedAt: new Date(),
            certificateId: `SF-${course._id.toString().slice(-8)}-${userId.toString().slice(-8)}`
          };
        }
        
        return {
          _id: course._id,
          name: course.name,
          thumbnail: course.thumbnail,
          instructorName: course.instructorName,
          duration: course.duration,
          progress: progressPercentage,
          timeSpent,
          lastAccessed,
          isCompleted,
          certificate,
          enrolledDate: enrollment.enrolledDate
        };
      })
    );
    
    // Filter out null courses and get real streak data
    const validEnrolledCourses = enrolledCourses.filter(course => course !== null);
    const streakInfo = await getStreakInfo(userId);
    const totalStreak = streakInfo ? streakInfo.currentStreak : 0;
    
    // Calculate total time spent
    const totalTimeSpent = validEnrolledCourses.reduce((total, course) => total + course.timeSpent, 0);
    
    // Calculate average progress
    const averageProgress = validEnrolledCourses.length > 0 
      ? Math.round(validEnrolledCourses.reduce((total, course) => total + course.progress, 0) / validEnrolledCourses.length)
      : 0;
    
    const dashboardData = {
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        profileImage: user.profileImage,
        joinedOn: user.createdAt,
        role: user.role
      },
      stats: {
        totalCourses: validEnrolledCourses.length,
        totalTimeSpent,
        averageProgress,
        totalStreak,
        completedCourses: validEnrolledCourses.filter(c => c.isCompleted).length
      },
      enrolledCourses: validEnrolledCourses
    };
    
    res.json(dashboardData);
  } catch (err) {
    console.error('Error fetching user dashboard:', err);
    res.status(500).json({ message: 'Error fetching dashboard data', error: err.message });
  }
}; 