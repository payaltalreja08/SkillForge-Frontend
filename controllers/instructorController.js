const User = require('../models/User');
const Course = require('../models/Course');
const Feedback = require('../models/Feedback');
const Comment = require('../models/Comment');
const VideoWatchEvent = require('../models/VideoWatchEvent');

// Get instructor dashboard data
exports.getInstructorDashboard = async (req, res) => {
  try {
    const instructorId = req.user._id;
    
    // Get instructor's courses with populated data
    const courses = await Course.find({ instructor: instructorId }).populate('instructor');
    
    // Get all feedback for instructor's courses
    const courseIds = courses.map(course => course._id);
    const allFeedback = await Feedback.find({ courseId: { $in: courseIds } });
    
    // Calculate course statistics
    const courseStats = await Promise.all(
      courses.map(async (course) => {
        const courseFeedback = allFeedback.filter(f => f.courseId.toString() === course._id.toString());
        const totalStudents = course.studentsEnrolled || 0;
        const totalRevenue = totalStudents * course.price;
        const averageRating = courseFeedback.length > 0 
          ? courseFeedback.reduce((sum, f) => sum + f.rating, 0) / courseFeedback.length 
          : 0;
        
        // Rating distribution
        const ratingDistribution = {
          5: courseFeedback.filter(f => f.rating === 5).length,
          4: courseFeedback.filter(f => f.rating === 4).length,
          3: courseFeedback.filter(f => f.rating === 3).length,
          2: courseFeedback.filter(f => f.rating === 2).length,
          1: courseFeedback.filter(f => f.rating === 1).length
        };
        
        // Recent comments
        const recentComments = await Comment.find({ courseId: course._id })
          .populate('userId', 'name profileImage')
          .sort({ createdAt: -1 })
          .limit(5);
        
        // Recent feedback
        const recentFeedback = await Feedback.find({ courseId: course._id })
          .populate('userId', 'name profileImage')
          .sort({ createdAt: -1 })
          .limit(5);
        
        return {
          _id: course._id,
          name: course.name,
          thumbnail: course.thumbnail,
          price: course.price,
          studentsEnrolled: totalStudents,
          revenue: totalRevenue,
          averageRating: Math.round(averageRating * 10) / 10,
          ratingDistribution,
          recentComments: recentComments.map(comment => ({
            _id: comment._id,
            text: comment.text,
            createdAt: comment.createdAt,
            user: {
              name: comment.userId.name,
              profileImage: comment.userId.profileImage
            }
          })),
          recentFeedback: recentFeedback.map(feedback => ({
            _id: feedback._id,
            rating: feedback.rating,
            review: feedback.review,
            createdAt: feedback.createdAt,
            user: {
              name: feedback.userId.name,
              profileImage: feedback.userId.profileImage
            }
          }))
        };
      })
    );
    
    // Calculate overall statistics
    const totalStudents = courseStats.reduce((sum, course) => sum + course.studentsEnrolled, 0);
    const totalRevenue = courseStats.reduce((sum, course) => sum + course.revenue, 0);
    const totalCourses = courses.length;
    const overallRating = courseStats.length > 0 
      ? courseStats.reduce((sum, course) => sum + course.averageRating, 0) / courseStats.length 
      : 0;
    
    // Get instructor profile
    const instructor = await User.findById(instructorId);
    
    const dashboardData = {
      instructor: {
        _id: instructor._id,
        name: instructor.name,
        email: instructor.email,
        profileImage: instructor.profileImage,
        domain: instructor.domain,
        experience: instructor.experience,
        joinedOn: instructor.createdAt
      },
      stats: {
        totalStudents,
        totalCourses,
        totalRevenue,
        averageRating: Math.round(overallRating * 10) / 10
      },
      courses: courseStats
    };
    
    res.json(dashboardData);
  } catch (err) {
    console.error('Error fetching instructor dashboard:', err);
    res.status(500).json({ message: 'Error fetching dashboard data', error: err.message });
  }
};

// Get detailed analytics for a specific course
exports.getCourseAnalytics = async (req, res) => {
  try {
    const { courseId } = req.params;
    const instructorId = req.user._id;
    
    // Verify course belongs to instructor
    const course = await Course.findOne({ _id: courseId, instructor: instructorId });
    if (!course) {
      return res.status(404).json({ message: 'Course not found or access denied' });
    }
    
    // Get course feedback
    const feedback = await Feedback.find({ courseId }).populate('userId', 'name profileImage');
    
    // Calculate analytics
    const totalStudents = course.studentsEnrolled || 0;
    const totalRevenue = totalStudents * course.price;
    const averageRating = feedback.length > 0 
      ? feedback.reduce((sum, f) => sum + f.rating, 0) / feedback.length 
      : 0;
    
    // Rating distribution
    const ratingDistribution = {
      5: feedback.filter(f => f.rating === 5).length,
      4: feedback.filter(f => f.rating === 4).length,
      3: feedback.filter(f => f.rating === 3).length,
      2: feedback.filter(f => f.rating === 2).length,
      1: feedback.filter(f => f.rating === 1).length
    };
    
    // Recent comments
    const recentComments = await Comment.find({ courseId })
      .populate('userId', 'name profileImage')
      .sort({ createdAt: -1 })
      .limit(10);
    
    // Monthly revenue data (simulated)
    const monthlyRevenue = [
      { month: 'Jan', revenue: Math.floor(Math.random() * 5000) + 1000 },
      { month: 'Feb', revenue: Math.floor(Math.random() * 5000) + 1000 },
      { month: 'Mar', revenue: Math.floor(Math.random() * 5000) + 1000 },
      { month: 'Apr', revenue: Math.floor(Math.random() * 5000) + 1000 },
      { month: 'May', revenue: Math.floor(Math.random() * 5000) + 1000 },
      { month: 'Jun', revenue: Math.floor(Math.random() * 5000) + 1000 }
    ];

    // Student engagement over time (per week)
    const engagementRaw = await VideoWatchEvent.aggregate([
      { $match: { courseId: course._id } },
      { $group: {
        _id: { $isoWeek: "$watchedAt" },
        week: { $first: { $isoWeek: "$watchedAt" } },
        year: { $first: { $isoWeekYear: "$watchedAt" } },
        uniqueStudents: { $addToSet: "$userId" },
        totalViews: { $sum: 1 }
      }},
      { $sort: { year: 1, week: 1 } }
    ]);
    const userEngagement = engagementRaw.map(e => ({
      week: `Week ${e.week}, ${e.year}`,
      students: e.uniqueStudents.length,
      views: e.totalViews
    }));

    // Peak watch times (hour of day)
    const peakRaw = await VideoWatchEvent.aggregate([
      { $match: { courseId: course._id } },
      { $group: {
        _id: { $hour: "$watchedAt" },
        hour: { $first: { $hour: "$watchedAt" } },
        viewers: { $sum: 1 }
      }},
      { $sort: { hour: 1 } }
    ]);
    const peakWatchTimes = peakRaw.map(e => ({
      time: `${e.hour}:00`,
      viewers: e.viewers
    }));

    const analyticsData = {
      course: {
        _id: course._id,
        name: course.name,
        thumbnail: course.thumbnail,
        price: course.price,
        duration: course.duration,
        description: course.description
      },
      stats: {
        totalStudents,
        totalRevenue,
        averageRating: Math.round(averageRating * 10) / 10,
        totalFeedback: feedback.length
      },
      ratingDistribution,
      monthlyRevenue,
      userEngagement,
      peakWatchTimes,
      recentFeedback: feedback.slice(0, 10).map(f => ({
        _id: f._id,
        rating: f.rating,
        review: f.review,
        createdAt: f.createdAt,
        user: {
          name: f.userId.name,
          profileImage: f.userId.profileImage
        }
      })),
      recentComments: recentComments.map(comment => ({
        _id: comment._id,
        text: comment.text,
        createdAt: comment.createdAt,
        user: {
          name: comment.userId.name,
          profileImage: comment.userId.profileImage
        }
      }))
    };
    
    res.json(analyticsData);
  } catch (err) {
    console.error('Error fetching course analytics:', err);
    res.status(500).json({ message: 'Error fetching analytics data', error: err.message });
  }
}; 