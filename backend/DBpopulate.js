const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Project = require('./models/Project');
const Task = require('./models/Task');
const Subtask = require('./models/Subtask');

const MONGO_URI = process.env.MONGO_URI;

// Connect to MongoDB
mongoose.connect(MONGO_URI, {
});

const createSampleData = async () => {
  try {
    // Clear existing data
    await User.deleteMany({});
    await Project.deleteMany({});
    await Task.deleteMany({});
    await Subtask.deleteMany({});

    const manager = await User.create({
      email: 'manager@appify.com',
      password: 'password123', // This will be hashed by the pre('save') middleware
      username: 'manager1',
      role: 'manager',
      orgJob: 'Team Lead',
    });

    // Hash passwords for subordinates
    const hashedPassword = await bcrypt.hash('password123', 10);

    // Create Subordinates
    const subordinates = await User.insertMany([
      {
        email: 'sub1@appify.com',
        password: hashedPassword, 
        username: 'subordinate1',
        role: 'subordinate',
        orgJob: 'Developer',
        managers: [manager._id],
      },
      {
        email: 'sub2@appify.com',
        password: hashedPassword, 
        username: 'subordinate2',
        role: 'subordinate',
        orgJob: 'Developer',
        managers: [manager._id],
      },
      {
        email: 'sub3@appify.com',
        password: hashedPassword, 
        username: 'subordinate3',
        role: 'subordinate',
        orgJob: 'Tester',
        managers: [manager._id],
      },
      {
        email: 'sub4@appify.com',
        password: hashedPassword, 
        username: 'subordinate4',
        role: 'subordinate',
        orgJob: 'Designer',
        managers: [manager._id],
      },
      {
        email: 'sub5@appify.com',
        password: hashedPassword, 
        username: 'subordinate5',
        role: 'subordinate',
        orgJob: 'Support',
        managers: [manager._id],
      },
    ]);

    console.log('Users created:', manager, subordinates);

    // Create Project
    const project = await Project.create({
      name: 'Website Redesign',
      description: 'Redesign the company website for better UX.',
      managedBy: [manager._id],
      createdBy: manager._id,
    });

    console.log('Project created:', project);

    // Create Tasks
    const tasks = await Task.insertMany([
      {
        title: 'Design Homepage',
        description: 'Create a new homepage design.',
        startDate: new Date('2025-04-01'), // Added start date
        dueDate: new Date('2025-05-01'),
        priority: 'High',
        visibility: 'Team',
        status: 'In Progress',
        assignedTo: [subordinates[0]._id, subordinates[3]._id],
        createdBy: manager._id,
        project: project._id,
      },
      {
        title: 'Develop Login Feature',
        description: 'Implement the login functionality.',
        startDate: new Date('2025-04-05'), // Added start date
        dueDate: new Date('2025-05-05'),
        priority: 'Medium',
        visibility: 'Personal',
        status: 'Pending',
        assignedTo: [subordinates[1]._id, subordinates[2]._id],
        createdBy: manager._id,
        project: project._id,
      },
      {
        title: 'Test Payment Gateway',
        description: 'Ensure the payment gateway works as expected.',
        startDate: new Date('2025-04-10'), // Added start date
        dueDate: new Date('2025-05-10'),
        priority: 'High',
        visibility: 'Team',
        status: 'Pending',
        assignedTo: [subordinates[2]._id],
        createdBy: manager._id,
        project: project._id,
      },
      {
        title: 'Create User Documentation',
        description: 'Write user documentation for the new features.',
        startDate: new Date('2025-04-15'), // Added start date
        dueDate: new Date('2025-05-15'),
        priority: 'Low',
        visibility: 'Personal',
        status: 'Pending',
        assignedTo: [subordinates[4]._id],
        createdBy: subordinates[4]._id,
        project: project._id,
      },
      {
        title: 'Optimize Database',
        description: 'Improve database performance.',
        startDate: new Date('2025-04-20'), // Added start date
        dueDate: new Date('2025-05-20'),
        priority: 'Medium',
        visibility: 'Team',
        status: 'Pending',
        assignedTo: [subordinates[0]._id, subordinates[1]._id],
        createdBy: manager._id,
        project: project._id,
      },
    ]);

    console.log('Tasks created:', tasks);

    // Create Subtasks
    const subtasks = await Subtask.insertMany([
      {
        title: 'Design Header',
        description: 'Create the header for the homepage.',
        status: 'Pending',
        assignedTo: subordinates[3]._id,
        task: tasks[0]._id,
      },
      {
        title: 'Design Footer',
        description: 'Create the footer for the homepage.',
        status: 'Pending',
        assignedTo: subordinates[3]._id,
        task: tasks[0]._id,
      },
      {
        title: 'Implement Login API',
        description: 'Develop the backend API for login.',
        status: 'In Progress',
        assignedTo: subordinates[1]._id,
        task: tasks[1]._id,
      },
      {
        title: 'Write Test Cases',
        description: 'Write test cases for the payment gateway.',
        status: 'Pending',
        assignedTo: subordinates[2]._id,
        task: tasks[2]._id,
      },
      {
        title: 'Optimize Queries',
        description: 'Optimize database queries for better performance.',
        status: 'Pending',
        assignedTo: subordinates[0]._id,
        task: tasks[4]._id,
      },
    ]);

    console.log('Subtasks created:', subtasks);

    console.log('Sample data created successfully!');
    process.exit();
  } catch (error) {
    console.error('Error creating sample data:', error);
    process.exit(1);
  }
};

createSampleData();