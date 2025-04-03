const mongoose = require('mongoose');

const SubtaskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  status: {
    type: String,
    enum: ['Pending', 'In Progress', 'Completed'],
    default: 'Pending',
  },
  assignedTo: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to a user from the parent task's assignedTo field
    required: true,
  }],
  task: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Task', // Reference to the parent task
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Virtual field to inherit priority from the parent task
SubtaskSchema.virtual('priority').get(function () {
  return this._priority; // This will be populated dynamically
});

module.exports = mongoose.model('Subtask', SubtaskSchema);