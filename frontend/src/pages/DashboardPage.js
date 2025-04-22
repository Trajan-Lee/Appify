import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import authUtils from '../utils/authUtils';
import projectUtils from '../utils/projectUtils';
import userUtils from '../utils/userUtils';
import taskUtils from '../utils/taskUtils';

import './styles/uniformStyles.css'; // Import the uniform styles
//import { Chart } from 'react-google-charts';

const DashboardPage = () => {
  const [tasks, setTasks] = useState([]);
  const [username, setUsername] = useState('');
  const [error, setError] = useState(null);
  const [isManager, setIsManager] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const role = await authUtils.getUserRole(); // Fetch the user's role
        setIsManager(role === 'manager'); // Set manager status

        // Fetch tasks based on the user's role
        const tasks = role === 'manager'
          ? await taskUtils.fetchAllTasks() // Fetch all tasks for managers
          : await taskUtils.fetchTasks(); // Fetch assigned tasks for regular users

        setTasks(tasks);
      } catch (error) {
        console.error('Error fetching tasks:', error);
        setError('Failed to load tasks.');
      }

      try {
        const username = await userUtils.fetchUsername();
        setUsername(username);
      } catch (error) {
        console.error('Error fetching username:', error);
      }
    };

    fetchData();
  }, []);


  // Navigate to create task page
  const handleCreateTask = () => {
    navigate('/tasks/create');
  };

  /*
  const generateGanttData = () => {
    const data = [
      { type: "string", label: "Task ID" },
      { type: "string", label: "Task Name" },
      { type: "string", label: "Resource" },
      { type: "date", label: "Start Date" },
      { type: "date", label: "End Date" },
      { type: "number", label: "Duration" },
      { type: "number", label: "Percent Complete" },
      { type: "string", label: "Dependencies" },
    ];
  
    tasks.forEach((task) => {
      const percentComplete = Math.min(
        (Math.max(0, new Date() - task.startDate) / (task.dueDate - task.startDate)) * 100,
        100
      );
  
      data.push([
        task._id,          
        task.title,        
        '',                
        task.startDate,         
        task.dueDate,           
        null,              
        percentComplete,   
        null,              
      ]);
    });
  
    return data;
  };
  
  const ganttOptions = {
    height: 400,
    gantt: {
      trackHeight: 30,
    },
  };
  */

  if (error) return <p>{error}</p>;

  return (
    <div className="uniform-container"> {/* Apply uniform container class */}
      <div className="uniform-header"> {/* Apply uniform header class */}
        <h1>Dashboard</h1>
        <p>Logged in as <strong>{username}</strong></p>
      </div>

      {/* Task List */}
      <div className="uniform-section">
        <Link to="/tasklist">
          <h2>Assigned Tasks</h2>
        </Link>
        <table className="uniform-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Priority</th>
              <th>Assigned To</th>
              <th>Visibility</th>
            </tr>
          </thead>
          <tbody>
            {tasks.length > 0 ? (
              tasks.map((task) => {
                // Format dates
                const formattedStartDate = new Intl.DateTimeFormat('en-US', {
                  month: 'short',
                  day: '2-digit',
                  year: 'numeric',
                }).format(new Date(task.startDate));

                const formattedEndDate = new Intl.DateTimeFormat('en-US', {
                  month: 'short',
                  day: '2-digit',
                  year: 'numeric',
                }).format(new Date(task.dueDate));

                // Get assigned usernames
                const assignedUsernames = task.assignedTo.map((user) => user.username).join(', ');

                return (
                  <tr key={task._id}>
                    <td>
                      <Link to={`/tasks/${task._id}`}>
                        {task.title}
                      </Link>
                    </td>
                    <td>{formattedStartDate}</td>
                    <td>{formattedEndDate}</td>
                    <td>{task.priority}</td>
                    <td>{assignedUsernames}</td>
                    <td>
                      {task.visibility === 'Public' ? 'Public' : 'Personal'}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="6">No tasks available.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="button-container">
        <button onClick={handleCreateTask} className="uniform-create-button">
          Create New Task
        </button>
        {isManager && (
          <>
            <button
              onClick={() => navigate('/projects')}
              className="uniform-create-button"
            >
              Manage Projects
            </button>
            <button
              onClick={() => navigate('/users')}
              className="uniform-create-button"
            >
              Manage Users
            </button>
          </>
        )}
      </div>

      <div className="logout-container">
        <button onClick={authUtils.handleLogout} className="uniform-logout-button">
          Logout
        </button>
      </div>

      {/* Gantt Chart 
      <div className="uniform-section">
        <h2>Gantt Chart</h2>
        <div className="uniform-gantt-container">
          {tasks.length > 0 ? (
            <Chart
              chartType="Gantt"
              width="100%"
              data={generateGanttData()}
              options={ganttOptions}
            />
          ) : (
            <p>No tasks to display in the Gantt chart.</p>
          )}
        </div>
      </div>
      */}
    </div>
  );
};

export default DashboardPage;