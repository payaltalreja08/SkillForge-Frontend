const User = require('../models/User');

// Middleware to track user login streaks
exports.updateStreak = async (req, res, next) => {
  try {
    if (!req.user) {
      return next();
    }

    const userId = req.user._id;
    const user = await User.findById(userId);
    
    if (!user) {
      return next();
    }

    const today = new Date();
    const lastLogin = new Date(user.lastLoginDate);
    
    // Reset time to compare only dates
    const todayDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const lastLoginDate = new Date(lastLogin.getFullYear(), lastLogin.getMonth(), lastLogin.getDate());
    
    // Calculate days difference
    const daysDiff = Math.floor((todayDate - lastLoginDate) / (1000 * 60 * 60 * 24));
    
    if (daysDiff === 0) {
      // Same day login, no change to streak
      return next();
    } else if (daysDiff === 1) {
      // Consecutive day login, increment streak
      user.currentStreak += 1;
      if (user.currentStreak > user.longestStreak) {
        user.longestStreak = user.currentStreak;
      }
    } else {
      // Missed a day or more, reset streak
      user.currentStreak = 1;
    }
    
    // Update last login date and total streak
    user.lastLoginDate = today;
    user.totalStreak = user.longestStreak; // Keep total streak as longest achieved
    
    await user.save();
    next();
  } catch (error) {
    console.error('Error updating streak:', error);
    next(); // Continue even if streak update fails
  }
};

// Function to get streak info (can be called from controllers)
exports.getStreakInfo = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) return null;
    
    return {
      currentStreak: user.currentStreak,
      longestStreak: user.longestStreak,
      totalStreak: user.totalStreak,
      lastLoginDate: user.lastLoginDate
    };
  } catch (error) {
    console.error('Error getting streak info:', error);
    return null;
  }
}; 