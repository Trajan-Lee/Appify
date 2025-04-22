import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import userUtils from '../utils/userUtils';
import taskUtils from '../utils/taskUtils';

const UserDetailsPage = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState(null);
  const [showCompleted, setShowCompleted] = useState(true);
  const [showInProgress, setShowInProgress] = useState(true);
  const [showPending, setShowPending] = useState(true);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const userData = await userUtils.fetchUserById(userId);
        setUser(userData);
        setEditedUser(userData);

        const userTasks = await taskUtils.fetchTasksByUserId(userId);
        setTasks(userTasks);
      } catch (err) {
        console.error('Error fetching user details or tasks:', err);
        setError('Failed to load user details or tasks.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, [userId]);

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    if (name === 'completed') setShowCompleted(checked);
    if (name === 'inProgress') setShowInProgress(checked);
    if (name === 'pending') setShowPending(checked);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      const updatedUser = await userUtils.updateUser(userId, editedUser);
      setUser(updatedUser);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating user:', error);
      setError('Failed to update user.');
    }
  };

  const handleDelete = async () => {
    try {
      await userUtils.deleteUser(userId);
      navigate('/users'); // Redirect to the users list page after deletion
    } catch (error) {
      console.error('Error deleting user:', error);
      setError('Failed to delete user.');
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>User Details</h1>
      {user && (
        <div style={{ marginBottom: '20px', border: '1px solid #ccc', padding: '10px' }}>
          {isEditing ? (
            <>
              <label>
                <strong>Username:</strong>
                <input
                  type="text"
                  name="username"
                  value={editedUser.username}
                  onChange={handleInputChange}
                  style={{ width: '100%', marginBottom: '10px', padding: '5px' }}
                />
              </label>
              <label>
                <strong>Email:</strong>
                <input
                  type="email"
                  name="email"
                  value={editedUser.email}
                  onChange={handleInputChange}
                  style={{ width: '100%', marginBottom: '10px', padding: '5px' }}
                />
              </label>
              <label>
                <strong>Role:</strong>
                <input
                  type="text"
                  name="orgJob"
                  value={editedUser.orgJob}
                  onChange={handleInputChange}
                  style={{ width: '100%', marginBottom: '10px', padding: '5px' }}
                />
              </label>
              <button
                onClick={handleSave}
                style={{ padding: '10px', backgroundColor: 'green', color: 'white', marginRight: '10px' }}
              >
                Save
              </button>
              <button
                onClick={() => setIsEditing(false)}
                style={{ padding: '10px', backgroundColor: 'gray', color: 'white' }}
              >
                Cancel
              </button>
            </>
          ) : (
            <>
              <p><strong>Username:</strong> {user.username}</p>
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Role:</strong> {user.orgJob}</p>
              <button
                onClick={() => setIsEditing(true)}
                style={{ padding: '10px', backgroundColor: 'blue', color: 'white', marginRight: '10px' }}
              >
                Edit
              </button>
              <button
                onClick={handleDelete}
                style={{ padding: '10px', backgroundColor: 'red', color: 'white' }}
              >
                Delete
              </button>
            </>
          )}
        </div>
      )}

      <h2>Assigned Tasks</h2>
      <div style={{ marginBottom: '20px' }}>
        <label style={{ marginRight: '10px' }}>
          <input
            type="checkbox"
            name="completed"
            checked={showCompleted}
            onChange={handleCheckboxChange}
          />
          Show Completed
        </label>
        <label style={{ marginRight: '10px' }}>
          <input
            type="checkbox"
            name="inProgress"
            checked={showInProgress}
            onChange={handleCheckboxChange}
          />
          Show In Progress
        </label>
        <label>
          <input
            type="checkbox"
            name="pending"
            checked={showPending}
            onChange={handleCheckboxChange}
          />
          Show Pending
        </label>
      </div>
      {tasks
        .filter((task) => {
          if (task.status === 'Completed' && !showCompleted) return false;
          if (task.status === 'In Progress' && !showInProgress) return false;
          if (task.status === 'Pending' && !showPending) return false;
          return true;
        })
        .map((task) => {
          const statusClass =
            task.status === 'Completed'
              ? 'status-completed'
              : task.status === 'In Progress'
              ? 'status-in-progress'
              : 'status-pending';

          return (
            <div
              key={task._id}
              style={{
                marginBottom: '10px',
                padding: '10px',
                borderBottom: '1px solid #ddd',
              }}
            >
              <h3>
                <Link to={`/tasks/${task._id}`}>
                  {task.title}
                </Link>{' '}
                <span className={statusClass}>
                  ({task.status})
                </span>
              </h3>
              <p><strong>Description:</strong> {task.description}</p>
            </div>
          );
        })}
    </div>
  );
};

export default UserDetailsPage;