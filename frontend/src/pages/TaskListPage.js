import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import taskUtils from '../utils/taskUtils';
import userUtils from '../utils/userUtils';
import authUtils from '../utils/authUtils';

const TaskListPage = () => {
  const [tasks, setTasks] = useState([]);
  const [username, setUsername] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const role = await authUtils.getUserRole(); // Fetch the user's role

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

  if (error) return <p>{error}</p>;

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>{username}'s Task List</h1>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
        <thead>
          <tr>
            <th style={{ border: '1px solid #ccc', padding: '10px' }}>Title</th>
            <th style={{ border: '1px solid #ccc', padding: '10px' }}>Start Date</th>
            <th style={{ border: '1px solid #ccc', padding: '10px' }}>End Date</th>
            <th style={{ border: '1px solid #ccc', padding: '10px' }}>Priority</th>
            <th style={{ border: '1px solid #ccc', padding: '10px' }}>Assigned To</th>
            <th style={{ border: '1px solid #ccc', padding: '10px' }}>Visibility</th>
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
                  <td style={{ border: '1px solid #ccc', padding: '10px' }}>
                    <Link to={`/tasks/${task._id}`}>
                      {task.title}
                    </Link>
                  </td>
                  <td style={{ border: '1px solid #ccc', padding: '10px' }}>{formattedStartDate}</td>
                  <td style={{ border: '1px solid #ccc', padding: '10px' }}>{formattedEndDate}</td>
                  <td style={{ border: '1px solid #ccc', padding: '10px' }}>{task.priority}</td>
                  <td style={{ border: '1px solid #ccc', padding: '10px' }}>{assignedUsernames}</td>
                  <td style={{ border: '1px solid #ccc', padding: '10px' }}>
                    {task.visibility === 'Public' ? 'Public' : 'Personal'}
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan="6" style={{ textAlign: 'center', padding: '10px' }}>
                No tasks available.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TaskListPage;