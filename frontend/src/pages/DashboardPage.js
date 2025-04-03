import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import authUtils from '../utils/authUtils'; 
import dbUtils from '../utils/dbUtils'; // Import userUtils to fetch username
//import './DashboardPage.css'; // Optional: Add custom styles here

const api_url = process.env.REACT_APP_API_URL;

const DashboardPage = () => {
  const [tasks, setTasks] = useState([]);
  const [username, setUsername] = useState('');
  const navigate = useNavigate();
  // Fetch tasks assigned to the user
  useEffect(() => {
    const fetchData = async () => {
      
      try {
        const tasks = await dbUtils.fetchTasks();
        setTasks(tasks);
      } catch (error) {
        console.error('Error fetching tasks:', error); // Debug: Log the error
      }
      
      try {
        const username = await dbUtils.fetchUsername();
        setUsername(username);
      } catch (error) {
        console.error('Error fetching username:', error); // Debug: Log the error
      }
    };
  
    fetchData();
  }, []);

  // Navigate to task details page
  const handleTaskClick = (taskId) => {
    navigate(`/tasks/${taskId}`);
  };

  // Navigate to create task page
  const handleCreateTask = () => {
    navigate('/tasks/create');
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Dashboard</h1>
        <p style={{ fontSize: '16px', color: '#555' }}>Logged in as <strong>{username}</strong></p>
      </div>
      <button onClick={authUtils.handleLogout} style={{ padding: '10px', backgroundColor: 'red', color: 'white' }}>
        Logout
      </button>
      {/* Task List */}
      <div style={{ marginBottom: '20px' }}>
        <Link to="/tasklist" style={{ textDecoration: 'none', color: 'inherit' }}>
          <h2>Assigned Tasks</h2>
        </Link>
        <div style={{ maxHeight: '200px', overflowY: 'scroll', border: '1px solid #ccc', padding: '10px' }}>
          {tasks.length > 0 ? (
          tasks.map((task) => {
              // Format the dueDate
              const formattedDueDate = new Intl.DateTimeFormat('en-US', {
                month: 'short', 
                day: '2-digit', 
                year: 'numeric',
              }).format(new Date(task.dueDate)); // Convert dueDate to a Date object

              return (
                <div
                  key={task._id}
                  style={{
                    padding: '10px',
                    borderBottom: '1px solid #ddd',
                    cursor: 'pointer',
                  }}
                  onClick={() => handleTaskClick(task._id)}
                >
                  <strong>{task.title} --- {formattedDueDate}</strong>
                  <p>{task.description}</p>
                  <p>Status: {task.status}</p>
                </div>
              );
            })
          ) : (
            <p>No tasks assigned.</p>
          )}
        </div>
      </div>

      {/* Create Task Button */}
      <button
        onClick={handleCreateTask}
        style={{
          padding: '10px 20px',
          backgroundColor: '#4caf50',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
        }}
      >
        Create New Task
      </button>

      {/* Gantt Chart */}
      <div style={{ marginTop: '40px' }}>
        <h2>Gantt Chart</h2>
        <div style={{ border: '1px solid #ccc', padding: '10px' }}>
          {tasks.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {tasks.map((task) => {
                // Calculate task duration and position
                const startDate = new Date(task.startDate);
                const dueDate = new Date(task.dueDate);
                const today = new Date();
                const totalDays = Math.ceil((dueDate - startDate) / (1000 * 60 * 60 * 24)); // Total task duration in days
                const daysFromStart = Math.max(0, Math.ceil((today - startDate) / (1000 * 60 * 60 * 24))); // Days since start

                // Calculate progress bar width and offset
                const progressWidth = Math.min((daysFromStart / totalDays) * 100, 100); // Percentage of task completed
                const offset = Math.max(0, (startDate - today) / (1000 * 60 * 60 * 24)) * 10; // Offset for tasks starting in the future

                return (
                  <div
                    key={task._id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      cursor: 'pointer',
                    }}
                    onClick={() => handleTaskClick(task._id)}
                  >
                    <span style={{ width: '150px' }}>{task.title}</span>
                    <div
                      style={{
                        flex: 1,
                        height: '20px',
                        backgroundColor: '#f0f0f0',
                        borderRadius: '5px',
                        overflow: 'hidden',
                        marginLeft: '10px',
                        position: 'relative',
                      }}
                    >
                      <div
                        style={{
                          position: 'absolute',
                          left: `${offset}px`,
                          width: `${progressWidth}%`,
                          height: '100%',
                          backgroundColor: '#4caf50',
                        }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p>No tasks to display in the Gantt chart.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;