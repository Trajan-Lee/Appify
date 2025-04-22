const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/authMiddleware');
const User = require('../models/User'); // Assuming you have a User model
const bcrypt = require('bcryptjs');

// GET /user/profile - Fetch the authenticated user's profile
router.get('/profile', verifyToken, async (req, res) => {
  try {
    const userId = req.user.id; // Extracted from the token in the verifyToken middleware
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ message: 'Failed to fetch user profile' });
  }
});

// GET /subordinates - Fetch subordinates for a manager
router.get('/subordinates', verifyToken, async (req, res) => {
  try {
    if (req.user.role !== 'manager') {
      return res.status(403).json({ message: 'Access denied. Only managers can view subordinates.' });
    }

    const subordinates = await User.find({ managers: req.user.id }).select('_id username orgJob email');
    res.status(200).json(subordinates);
  } catch (error) {
    console.error('Error fetching subordinates:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /managers - Fetch all users with the role of 'manager'
router.get('/managers', verifyToken, async (req, res) => {
  try {
    const managers = await User.find({ role: 'manager' }).select('_id username email orgJob');
    res.status(200).json(managers);
  } catch (error) {
    console.error('Error fetching managers:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /:userId - Fetch a specific user by ID
router.get('/:userId', verifyToken, async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId).select('_id username orgJob email');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error('Error fetching user by ID:', error);
    res.status(500).json({ message: 'Failed to fetch user' });
  }
});

// POST / - Create a new user
router.post('/', verifyToken, async (req, res) => {
  try {
    const { email, password, username, role, orgJob, managers } = req.body;

    // Check if the email or username already exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ message: 'Email or username already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      email,
      password: hashedPassword,
      username,
      role,
      orgJob,
      managers,
    });

    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /:userId - Update a user
router.put('/:userId', verifyToken, async (req, res) => {
  try {
    const { email, username, role, orgJob, managers } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      req.params.userId,
      { email, username, role, orgJob, managers },
      { new: true }
    ).select('_id username orgJob email role managers');

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE /:userId - Delete a user
router.delete('/:userId', verifyToken, async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.userId);

    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;