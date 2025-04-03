const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/authMiddleware');
const User = require('../models/User'); // Assuming you have a User model

// GET /user/profile - Fetch the authenticated user's profile
router.get('/profile', verifyToken, async (req, res) => {
    try {
      const userId = req.user.id; // Extracted from the token in the verifyToken middleware
      const user = await User.findById(userId); // Fetch only the username field
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      res.status(200).json(user);
    } catch (error) {
      console.error('Error fetching user profile:', error);
      res.status(500).json({ message: 'Failed to fetch user profile' });
    }
  });

  router.get('/subordinates', verifyToken, async (req, res) => {
    try {
      if (req.user.role !== 'manager') {
        console.log('Access denied for user:', req.user.id, 'Role:', req.user.role); // Debug output
        return res.status(403).json({ message: 'Access denied. Only managers can view subordinates.' });
      }
      const subordinates = await User.find({ managers: { $in: [req.user.id] } }).select('_id username');
      res.status(200).json(subordinates);
    } catch (error) {
      console.error('Error fetching subordinates for user:', req.user.id, error); // Debug output
      res.status(500).json({ message: 'Server error' });
    }
  });
  
  
  module.exports = router;