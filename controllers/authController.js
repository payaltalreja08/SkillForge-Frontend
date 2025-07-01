const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  try {
    const { 
      name, 
      email, 
      password, 
      role, 
      learnerType, 
      degree, 
      jobType, 
      domain, 
      experience 
    } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);

    const profileImagePath = req.file ? req.file.path : '';

    const userData = {
      name,
      email,
      password: hashedPassword,
      role,
      profileImage: profileImagePath
    };

    // Add role-specific fields
    if (role === 'student') {
      userData.learnerType = learnerType;
      userData.degree = degree || '';
      userData.jobType = jobType || '';
    } else if (role === 'instructor') {
      userData.domain = domain;
      userData.experience = parseInt(experience) || 0;
    }

    const user = await User.create(userData);

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({ token, user });
  } catch (err) {
    res.status(500).json({ message: 'Registration failed', error: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.status(200).json({ token, user });
  } catch (err) {
    res.status(500).json({ message: 'Login failed', error: err.message });
  }
};
