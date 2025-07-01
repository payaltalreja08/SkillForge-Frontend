require('dotenv').config();
const express = require('express');
const session = require('express-session');
const cors = require('cors');
const path = require('path');

const connectDB = require('./config/db');
const passport = require('./config/passport');
const { updateStreak } = require('./middleware/streakTracker');

// ✅ Properly named imports
const authRoutes = require('./routes/authRoutes');
const oauthRoutes = require('./routes/oauthRoutes');
const courseRoutes = require('./routes/courseRoutes');
const progressRoutes = require('./routes/progressRoutes');
const userRoutes = require('./routes/userRoutes');
const instructorRoutes = require('./routes/instructorRoutes');
const aiRoutes = require('./routes/aiRoutes');

const app = express();
connectDB();

app.use(cors({
  origin: 'http://localhost:5173', // or your frontend URL
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
}));

app.use(passport.initialize());
app.use(passport.session());

// ✅ Attach routes with streak tracking for authenticated routes
app.use('/api/auth', authRoutes);   // for register/login with email
app.use('/api/oauth', oauthRoutes); // for Google OAuth
app.use('/api/courses', courseRoutes); // for course operations
app.use('/api/progress', progressRoutes);
app.use('/api/user', userRoutes);
app.use('/api/instructor', instructorRoutes);
app.use('/api/ai', aiRoutes);

// Apply streak tracking to all authenticated routes
app.use('/api/user', updateStreak);
app.use('/api/instructor', updateStreak);
app.use('/api/progress', updateStreak);
app.use('/api/courses', updateStreak);

// Global error handler
app.use((err, req, res, next) => {
  console.error('Global error handler:', err);
  
  // Handle Multer errors specifically
  if (err.code === 'LIMIT_UNEXPECTED_FILE') {
    console.error('Multer error - Unexpected field:', err.field);
    return res.status(400).json({ 
      message: 'File upload error', 
      error: `Unexpected field: ${err.field}`,
      details: 'The field name is not accepted by the upload middleware'
    });
  }
  
  res.status(500).json({ 
    message: 'Internal server error', 
    error: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong' 
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));