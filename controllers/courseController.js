const Course = require('../models/Course');
const User = require('../models/User');

const Feedback = require('../models/Feedback');

// Get all courses
exports.getAllCourses = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      category, 
      level, 
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    const query = { isActive: true };

    // Filter by category
    if (category) {
      query.category = category;
    }

    // Filter by level
    if (level) {
      query.level = level;
    }

    // Search functionality
    if (search) {
      query.$text = { $search: search };
    }

    // Sort options
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const courses = await Course.find(query)
      .populate('instructor', 'name email profileImage')
      .sort(sortOptions)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    // Get feedback data for all courses
    const courseIds = courses.map(course => course._id);
    const feedbackData = await Feedback.aggregate([
      { $match: { courseId: { $in: courseIds } } },
      { $group: {
        _id: '$courseId',
        averageRating: { $avg: '$rating' },
        totalFeedback: { $sum: 1 },
        ratingDistribution: {
          $push: '$rating'
        }
      }}
    ]);

    // Create a map of courseId to feedback data
    const feedbackMap = {};
    feedbackData.forEach(feedback => {
      const ratings = feedback.ratingDistribution;
      feedbackMap[feedback._id.toString()] = {
        averageRating: Math.round(feedback.averageRating * 10) / 10,
        totalFeedback: feedback.totalFeedback,
        ratingDistribution: {
          5: ratings.filter(r => r === 5).length,
          4: ratings.filter(r => r === 4).length,
          3: ratings.filter(r => r === 3).length,
          2: ratings.filter(r => r === 2).length,
          1: ratings.filter(r => r === 1).length
        }
      };
    });

    // Add feedback data to courses
    const coursesWithFeedback = courses.map(course => {
      const feedback = feedbackMap[course._id.toString()] || {
        averageRating: 0,
        totalFeedback: 0,
        ratingDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
      };
      
      return {
        ...course.toObject(),
        rating: feedback.averageRating,
        totalFeedback: feedback.totalFeedback,
        ratingDistribution: feedback.ratingDistribution
      };
    });

    const total = await Course.countDocuments(query);

    res.status(200).json({
      courses: coursesWithFeedback,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching courses', error: error.message });
  }
};

// Get course by ID
exports.getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate('instructor', 'name email profileImage domain experience');

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    if (!course.isActive) {
      return res.status(404).json({ message: 'Course is not available' });
    }

    res.status(200).json(course);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching course', error: error.message });
  }
};

// Helper to map uploaded videos and descriptions to modules
function attachVideosToModules(modules, files, body) {
  // files: array of video files (from req.files['videos'])
  // body: contains videoDescriptions as JSON strings with moduleIndex and videoIndex
  const moduleVideos = {};
  
  if (files && Array.isArray(files)) {
    // Parse video descriptions to get module and video indices
    const videoDescriptions = [];
    if (body.videoDescriptions) {
      // Handle both single string and array of strings
      const descriptions = Array.isArray(body.videoDescriptions) ? body.videoDescriptions : [body.videoDescriptions];
      descriptions.forEach(desc => {
        try {
          const videoInfo = JSON.parse(desc);
          videoDescriptions.push(videoInfo);
        } catch (e) {
          console.error('Error parsing video description:', e);
        }
      });
    }
    
    // Map files to modules based on videoDescriptions
    files.forEach((file, fileIndex) => {
      const videoInfo = videoDescriptions[fileIndex];
      if (videoInfo && videoInfo.moduleIndex !== undefined) {
        const moduleIdx = videoInfo.moduleIndex;
        if (!moduleVideos[moduleIdx]) moduleVideos[moduleIdx] = [];
        moduleVideos[moduleIdx].push({
          url: '/uploads/videos/' + file.filename,
          description: videoInfo.description || ''
        });
      }
    });
  }
  
  return modules.map((mod, idx) => {
    return {
      ...mod,
      videos: moduleVideos[idx] || []
    };
  });
}

// Create new course (instructor only)
exports.createCourse = async (req, res) => {
  try {
    console.log('=== CREATE COURSE DEBUG ===');
    console.log('Request body keys:', Object.keys(req.body));
    console.log('Request files:', req.files);
    console.log('Request file:', req.file);
    console.log('User:', req.user);
    console.log('========================');

    const { name, description, price, duration, category, level } = req.body;
    
    // Validate required fields
    if (!name || !description || !price || !duration || !category || !level) {
      return res.status(400).json({ 
        message: 'Missing required fields', 
        missing: {
          name: !name,
          description: !description,
          price: !price,
          duration: !duration,
          category: !category,
          level: !level
        }
      });
    }

    let modules = req.body.modules;
    if (typeof modules === 'string') {
      try {
        modules = JSON.parse(modules);
      } catch (parseError) {
        console.error('Error parsing modules JSON:', parseError);
        return res.status(400).json({ message: 'Invalid modules JSON format' });
      }
    }

    // Check if user is an instructor
    if (req.user.role !== 'instructor') {
      return res.status(403).json({ message: 'Only instructors can create courses' });
    }

    // Handle modules with videos if files are uploaded
    let modulesWithVideos;
    const videoFiles = req.files && req.files['videos'] ? req.files['videos'] : [];
    if (videoFiles.length > 0) {
      modulesWithVideos = attachVideosToModules(modules, videoFiles, req.body);
    } else {
      modulesWithVideos = modules.map((mod, idx) => ({
        ...mod,
        videos: []
      }));
    }

    // Handle thumbnail image upload
    let thumbnailPath = '/uploads/default-course.jpg';
    if (req.files && req.files['thumbnail'] && req.files['thumbnail'][0]) {
      thumbnailPath = '/uploads/' + req.files['thumbnail'][0].filename;
    }

    console.log('Creating course with data:', {
      name,
      description,
      instructor: req.user.id,
      instructorName: req.user.name,
      price,
      duration,
      modules: modulesWithVideos,
      category,
      level,
      thumbnail: thumbnailPath
    });

    const course = await Course.create({
      name,
      description,
      instructor: req.user.id,
      instructorName: req.user.name,
      price,
      duration,
      modules: modulesWithVideos,
      category,
      level,
      thumbnail: thumbnailPath
    });

    console.log('Course created successfully:', course._id);
    res.status(201).json(course);
  } catch (error) {
    console.error('Error creating course:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({ 
      message: 'Error creating course', 
      error: error.message,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

// Update course (instructor only)
exports.updateCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    if (course.instructor.toString() !== req.user.id) {
      return res.status(403).json({ message: 'You can only update your own courses' });
    }
    let modules = req.body.modules;
    if (typeof modules === 'string') modules = JSON.parse(modules);
    const videoFiles = req.files && req.files['videos'] ? req.files['videos'] : [];
    const newModulesWithVideos = attachVideosToModules(modules, videoFiles, req.body);
    // Merge with existing videos if no new videos uploaded for a module
    const mergedModules = newModulesWithVideos.map((mod, idx) => {
      if (!mod.videos || mod.videos.length === 0) {
        return {
          ...mod,
          videos: course.modules[idx]?.videos || []
        };
      }
      return mod;
    });
    // Handle thumbnail image upload
    let thumbnailPath = course.thumbnail;
    if (req.files && req.files['thumbnail'] && req.files['thumbnail'][0]) {
      thumbnailPath = '/uploads/' + req.files['thumbnail'][0].filename;
    }
    const updatedCourse = await Course.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
        modules: mergedModules,
        thumbnail: thumbnailPath
      },
      { new: true, runValidators: true }
    );
    res.status(200).json(updatedCourse);
  } catch (error) {
    res.status(500).json({ message: 'Error updating course', error: error.message });
  }
};

// Delete course (instructor only)
exports.deleteCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Check if user is the course instructor
    if (course.instructor.toString() !== req.user.id) {
      return res.status(403).json({ message: 'You can only delete your own courses' });
    }

    await Course.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: 'Course deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting course', error: error.message });
  }
};

// Get courses by instructor
exports.getCoursesByInstructor = async (req, res) => {
  try {
    const courses = await Course.find({ 
      instructor: req.params.instructorId,
      isActive: true 
    }).populate('instructor', 'name email profileImage');

    res.status(200).json(courses);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching instructor courses', error: error.message });
  }
};

// Get course categories
exports.getCourseCategories = async (req, res) => {
  try {
    const categories = await Course.distinct('category', { isActive: true });
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching categories', error: error.message });
  }
};

// Enroll user in a course (purchase)
exports.enrollInCourse = async (req, res) => {
  try {
    const userId = req.user._id;
    const { courseId } = req.body;

    if (!courseId) {
      return res.status(400).json({ message: 'Course ID is required' });
    }

    // Check if course exists
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Get user and check if already enrolled
    const user = await User.findById(userId);
    const alreadyEnrolled = user.enrolledCourses.some(
      enrollment => enrollment.courseId.toString() === courseId
    );

    if (alreadyEnrolled) {
      return res.status(400).json({ message: 'Already enrolled in this course' });
    }

    // Add course to user's enrolled courses
    user.enrolledCourses.push({
      courseId: courseId,
      enrolledDate: new Date(),
      progress: 0,
      timeSpent: 0,
      lastAccess: new Date(),
      completed: false
    });

    // Update course enrollment count
    course.studentsEnrolled = (course.studentsEnrolled || 0) + 1;

    // Save both user and course
    await Promise.all([user.save(), course.save()]);

    res.json({ 
      message: 'Successfully enrolled in course',
      course: {
        _id: course._id,
        name: course.name,
        instructorName: course.instructorName,
        thumbnail: course.thumbnail,
        duration: course.duration
      }
    });

  } catch (err) {
    console.error('Error enrolling in course:', err);
    res.status(500).json({ message: 'Error enrolling in course', error: err.message });
  }
};

// Check if user is enrolled in a course
exports.checkEnrollment = async (req, res) => {
  try {
    const userId = req.user._id;
    const { courseId } = req.params;

    const user = await User.findById(userId);
    const isEnrolled = user.enrolledCourses.some(
      enrollment => enrollment.courseId.toString() === courseId
    );

    res.json({ isEnrolled });
  } catch (err) {
    console.error('Error checking enrollment:', err);
    res.status(500).json({ message: 'Error checking enrollment', error: err.message });
  }
};

// Update time spent on a course for a user
exports.updateTimeSpent = async (req, res) => {
  try {
    const userId = req.user._id;
    const { courseId, timeSpent } = req.body;
    if (!courseId || typeof timeSpent !== 'number') {
      return res.status(400).json({ message: 'Course ID and timeSpent are required.' });
    }
    const user = await User.findById(userId);
    const enrollment = user.enrolledCourses.find(e => e.courseId.toString() === courseId);
    if (!enrollment) {
      return res.status(404).json({ message: 'Not enrolled in this course.' });
    }
    enrollment.timeSpent = (enrollment.timeSpent || 0) + timeSpent;
    enrollment.lastAccess = new Date();
    await user.save();
    res.json({ message: 'Time spent updated.' });
  } catch (err) {
    console.error('Error updating time spent:', err);
    res.status(500).json({ message: 'Error updating time spent', error: err.message });
  }
}; 