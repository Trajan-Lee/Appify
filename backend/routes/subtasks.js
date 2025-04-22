const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/authMiddleware');
const Subtask = require('../models/Subtask');
const Task = require('../models/Task');

// Create a new subtask
router.post('/', verifyToken, async (req, res) => {
    try {
        const { title, description, status, assignedTo, task } = req.body;

        // Ensure the parent task exists
        const parentTask = await Task.findById(task);
        if (!parentTask) {
            return res.status(404).json({ message: 'Parent task not found' });
        }

        const newSubtask = new Subtask({
            title,
            description,
            status,
            assignedTo,
            task,
        });

        const savedSubtask = await newSubtask.save();
        res.status(201).json(savedSubtask);
    } catch (error) {
        console.error('Error creating subtask:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Update a subtask
router.put('/:subtaskId', verifyToken, async (req, res) => {
    try {
        const subtaskId = req.params.subtaskId;
        const updates = req.body;

        // Find the subtask and update it
        const updatedSubtask = await Subtask.findByIdAndUpdate(subtaskId, updates, { new: true })
            .populate('assignedTo', '_id username') // Populate assigned users
            .populate('task', '_id title'); // Populate parent task details

        if (!updatedSubtask) {
            return res.status(404).json({ message: 'Subtask not found' });
        }

        res.status(200).json(updatedSubtask);
    } catch (error) {
        console.error('Error updating subtask:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Delete a subtask
router.delete('/:subtaskId', verifyToken, async (req, res) => {
    try {
        const subtaskId = req.params.subtaskId;

        // Find the subtask and delete it
        const deletedSubtask = await Subtask.findByIdAndDelete(subtaskId);

        if (!deletedSubtask) {
            return res.status(404).json({ message: 'Subtask not found' });
        }

        res.status(200).json({ message: 'Subtask deleted successfully' });
    } catch (error) {
        console.error('Error deleting subtask:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;