const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/authMiddleware');
const Task = require('../models/Task');
const User = require('../models/User');
const Project = require('../models/Project');

router.get('/assigned', verifyToken, async (req, res) => {
    try {
      const userId = req.user.id;
      console.log('Fetching tasks for user ID:', userId); // Log the user ID
      const tasks = await Task.find({ assignedTo: userId }).populate('assignedTo', '_id username');
      res.status(200).json(tasks);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });

  router.get('/all', verifyToken, async (req, res) => {
    try {
        // Optional: Check if the user has a manager role
        if (req.user.role !== 'manager') {
            return res.status(403).json({ message: 'Access denied. Only managers can view all tasks.' });
        }

        // Fetch all tasks and populate assignedTo and subtasks
        const tasks = await Task.find()
            .populate('assignedTo', '_id username') // Populate assigned users
            .populate('project', '_id name') // Populate project details
            .populate('createdBy', '_id username') // Populate creator details
            .populate({
                path: 'subtasks',
                populate: { path: 'assignedTo', select: '_id username' }, // Populate assigned users for subtasks
            });

        res.status(200).json(tasks);
    } catch (error) {
        console.error('Error fetching all tasks:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

  router.get('/:taskId', verifyToken, async (req, res) => {
    try {
        const taskId = req.params.taskId;

        // Fetch the task and populate subtasks and assignedTo fields
        const task = await Task.findById(taskId)
            .populate('assignedTo', '_id username') // Populate assigned users
            .populate({
                path: 'subtasks',
                populate: { path: 'assignedTo', select: '_id username' }, // Populate assigned users for subtasks
            });

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        res.status(200).json(task);
    } catch (error) {
        console.error('Error fetching task:', error);
        res.status(500).json({ message: 'Server error' });
    }
});


router.post('/', verifyToken, async (req, res) => {
    try {
        const {title, description, assignedTo, startDate, dueDate, priority, project} = req.body;
        const newTask = new Task({
            title,
            description,
            assignedTo,
            startDate,
            dueDate,
            priority,
            project,
            createdBy: req.user.id
        });
        const savedTask = await newTask.save();
        res.status(201).json(savedTask);
    } catch (error) {
        console.error('Error creating task:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;