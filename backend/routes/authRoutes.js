const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { verifyToken } = require('../middleware/authMiddleware');
require('dotenv').config();

const router = express.Router();

// Login route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    console.log('Login attempt with email:', email); // Log the email being searched

    // Find user by email
    const user = await User.findOne({ email: email.trim().toLowerCase() });
    if (!user) {
      console.log('User not found for email:', email); // Log if the user is not found
      return res.status(404).json({ message: 'User not found' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log('Invalid password for email:', email); // Log if the password is invalid
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate JWT
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    console.log('Login successful for email:', email); // Log successful login
    res.json({ token, user: { id: user._id, email: user.email, role: user.role } });
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/role', verifyToken, async (req, res) => {
  const userRole = req.user.role;
  try {
    if (!userRole) {
      return res.status(404).json({ message: 'Role not found' });
    }
    res.status(200).json({ role: userRole });
  } catch (error) {
    console.error('Error fetching user role:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;