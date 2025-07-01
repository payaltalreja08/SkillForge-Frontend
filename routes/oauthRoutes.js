const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const router = express.Router();

// 👇 Google login start
router.get('/google', passport.authenticate('google', {
  scope: ['profile', 'email']
}));

// 👇 Callback handler
router.get('/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: '/login' }),
  (req, res) => {
    const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });

    // Redirect to frontend home page with token as query param
    const redirectUrl = `http://localhost:5173/?token=${token}`;
    res.redirect(redirectUrl);
  }
);

module.exports = router;
