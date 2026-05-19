const { validationResult } = require('express-validator');
const User = require('../models/User');
const { AUTH_COOKIE_NAME, getCookieOptions } = require('../utils/cookies');
const { signAuthToken } = require('../utils/authToken');

// Login
exports.login = async (req, res) => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // Generate token
    const token = signAuthToken(user);
    res.cookie(AUTH_COOKIE_NAME, token, getCookieOptions());

    res.json({
      success: true,
      user: {
        _id: user._id,
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Logout
exports.logout = async (req, res) => {
  res.clearCookie(AUTH_COOKIE_NAME, { ...getCookieOptions(), maxAge: undefined });
  res.json({ success: true, message: 'Logged out successfully' });
};

// Get current user
exports.me = async (req, res) => {
  res.json({ success: true, user: req.user });
};
