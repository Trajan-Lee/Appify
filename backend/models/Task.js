const mongoose = require('mongoose');
const Subtask = require('./Subtask');
const Project = require('./Project');

const TaskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  dueDate: {
    type: Date,
    required: true,
  },
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High'],
    default: 'Medium',
  },
  visibility: {
    type: String,
    enum: ['Team', 'Personal'],
  },
  status: {
    type: String,
    enum: ['Pending', 'In Progress', 'Completed'],
    default: 'Pending',
  },
  assignedTo: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Assuming you have a User model
  }],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Assuming the task creator is also a user
    required: true,
  },
  project: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Virtual field for subtasks
TaskSchema.virtual('subtasks', {
  ref: 'Subtask', // Reference the Subtask model
  localField: '_id', // Match the task's _id
  foreignField: 'task', // Match the subtask's task field
});

TaskSchema.set('toJSON', { virtuals: true });
TaskSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Task', TaskSchema);