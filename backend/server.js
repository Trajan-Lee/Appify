const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const bodyParser = require('body-parser');


//import routes
const authRoutes = require('./routes/authRoutes');
const tasksRoutes = require('./routes/tasks');
const userRoutes = require('./routes/users');
const projectRoutes = require('./routes/projects');
const subtaskRoutes = require('./routes/subtasks');


app.use(express.json());
app.use(cors());
app.use(bodyParser.json());

//register routes here
app.use('/api/auth', authRoutes);
app.use('/api/tasks', tasksRoutes);
app.use('/api/users', userRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/subtasks', subtaskRoutes);

const mURI = process.env.MONGO_URI;
const PORT = process.env.PORT

mongoose.connect(mURI, {
}).then(() => {
    console.log('Connected to MongoDB');
}).catch((error) => {
    console.error(error);
});

app.get('/', (req, res) => {
    res.send('Hello Backend is running');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});