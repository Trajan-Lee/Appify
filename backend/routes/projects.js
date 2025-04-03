const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/authMiddleware');
const Task = require('../models/Task');
const User = require('../models/User');
const Project = require('../models/Project');

router.get('/all', verifyToken, async (req, res) => {
    try {
      // Find projects where the user is a member
      const projects = await Project.find();
      res.status(200).json(projects);
    } catch (error) {
      console.error('Error fetching projects:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });

  module.exports = router;