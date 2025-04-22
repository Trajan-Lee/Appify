import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import authUtils from '../utils/authUtils';
import projectUtils from '../utils/projectUtils';
import userUtils from '../utils/userUtils';
import taskUtils from '../utils/taskUtils';

const CreateTaskPage = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [visibility, setVisibility] = useState('Personal');
  const [assignedTo, setAssignedTo] = useState([]);
  const [subordinates, setSubordinates] = useState([]);
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState('');
  const [userRole, setUserRole] = useState('');
  const [currentUserId, setCurrentUserId] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const role = await authUtils.getUserRole();
        const userId = await userUtils.fetchUserId();
        setUserRole(role);
        setCurrentUserId(userId);

        // If the user is a manager, fetch subordinates
        if (role === 'manager') {
          const subordinates = await userUtils.fetchSubordinates();
          setSubordinates(subordinates);
          console.log('Subordinates:', subordinates); // Debug: Log the fetched subordinates
        }

        // Fetch projects where the user is a member
        const userProjects = await projectUtils.fetchUserProjects();
        setProjects(userProjects);
      } catch (err) {
        console.error('Error fetching user data:', err);
        setError('Failed to load user data.');
      }
    };

    fetchUserData();
  }, []);

  const handleAssignedToChange = (selectedOptions) => {
    // Update the assignedTo state with the selected user IDs
    setAssignedTo(selectedOptions.map((option) => option.value));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const taskData = {
        title,
        description,
        startDate,
        dueDate,
        priority,
        visibility,
        assignedTo: visibility === 'Personal' ? [currentUserId] : assignedTo,
        project: selectedProject,
      };

      await taskUtils.createTask(taskData);
      setSuccess('Task created successfully!');
      setTitle('');
      setDescription('');
      setStartDate('');
      setDueDate('');
      setPriority('Medium');
      setVisibility('Personal');
      setAssignedTo([]);
      setSelectedProject('');
    } catch (err) {
      console.error('Error creating task:', err);
      setError('Failed to create task.');
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Create Task</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Title:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            style={{ width: '100%', marginBottom: '10px', padding: '5px' }}
          />
        </div>
        <div>
          <label>Description:</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={{ width: '100%', marginBottom: '10px', padding: '5px' }}
          />
        </div>
        <div>
          <label>Start Date:</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
            style={{ marginBottom: '10px', padding: '5px' }}
          />
        </div>
        <div>
          <label>Due Date:</label>
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            required
            style={{ marginBottom: '10px', padding: '5px' }}
          />
        </div>
        <div>
          <label>Priority:</label>
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            style={{ marginBottom: '10px', padding: '5px' }}
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>
        <div>
          <label>Project:</label>
          <select
            value={selectedProject}
            onChange={(e) => setSelectedProject(e.target.value)}
            required
            style={{ marginBottom: '10px', padding: '5px' }}
          >
            <option value="">Select a project</option>
            {projects.map((project) => (
              <option key={project._id} value={project._id}>
                {project.name}
              </option>
            ))}
          </select>
        </div>
        {userRole === 'manager' && (
          <div>
            <label>Visibility:</label>
            <select
              value={visibility}
              onChange={(e) => setVisibility(e.target.value)}
              style={{ marginBottom: '10px', padding: '5px' }}
            >
              <option value="Personal">Personal</option>
              <option value="Team">Team</option>
            </select>
          </div>
        )}
      {visibility === 'Team' && userRole === 'manager' && (
        <div>
          <label>Assign To:</label>
          <Select
            isMulti
            options={subordinates.map((subordinate) => ({
              value: subordinate._id,
              label: subordinate.username,
            }))}
            onChange={handleAssignedToChange}
            value={subordinates
              .filter((subordinate) => assignedTo.includes(subordinate._id))
              .map((subordinate) => ({
                value: subordinate._id,
                label: subordinate.username,
              }))}
              styles={{
                container: (base) => ({ ...base, marginBottom: '10px' }),
                control: (base) => ({ ...base, color: 'black' }),
                option: (base, state) => ({
                  ...base,
                  color: 'black',
                  backgroundColor: state.isFocused ? '#f0f0f0' : 'white',
                }),
              }}
          />
        </div>
      )}
        <button type="submit" style={{ padding: '10px', backgroundColor: 'blue', color: 'white' }}>
          Create Task
        </button>
      </form>
    </div>
  );
};

export default CreateTaskPage;