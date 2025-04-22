const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/authMiddleware');
const Task = require('../models/Task');
const User = require('../models/User');
const Project = require('../models/Project');

// Get all projects
router.get('/all', verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const projects = await Project.find({ $or: [{ members: userId }, { managedBy: userId }] })
      .populate('managedBy', '_id username');
    res.status(200).json(projects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get a specific project
router.get('/:projectId', verifyToken, async (req, res) => {
  try {
    const project = await Project.findById(req.params.projectId)
      .populate('managedBy', '_id username')
      .populate('tasks');
    if (!project) {
      res.status(404).json({ message: 'Project not found' });
    } else {
      res.status(200).json(project);
    }
  } catch (error) {
    console.error('Error fetching project:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create a new project
router.post('/', verifyToken, async (req, res) => {
  try {
    const { name, description, managedBy, members } = req.body;

    const newProject = new Project({
      name,
      description,
      managedBy: managedBy || req.user.id, // Default to the current user if not provided
      members: members || [],
    });

    const savedProject = await newProject.save();
    res.status(201).json(savedProject);
  } catch (error) {
    console.error('Error creating project:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update a project
router.put('/:projectId', verifyToken, async (req, res) => {
  try {
    const { name, description, managedBy, members } = req.body;

    const updatedProject = await Project.findByIdAndUpdate(
      req.params.projectId,
      { name, description, managedBy, members },
      { new: true }
    )
      .populate('managedBy', '_id username')
      .populate('tasks');

    if (!updatedProject) {
      res.status(404).json({ message: 'Project not found' });
    } else {
      res.status(200).json(updatedProject);
    }
  } catch (error) {
    console.error('Error updating project:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete a project
router.delete('/:projectId', verifyToken, async (req, res) => {
  try {
    const deletedProject = await Project.findByIdAndDelete(req.params.projectId);

    if (!deletedProject) {
      res.status(404).json({ message: 'Project not found' });
    } else {
      res.status(200).json({ message: 'Project deleted successfully' });
    }
  } catch (error) {
    console.error('Error deleting project:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;