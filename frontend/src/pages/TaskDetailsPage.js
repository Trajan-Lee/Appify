import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import dbUtils from '../utils/dbUtils';
import authUtils from '../utils/authUtils';

const TaskDetailsPage = () => {
  const { taskId } = useParams(); // Get the taskId from the URL
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [canEdit, setCanEdit] = useState(false);
  const [isEditing, setIsEditing] = useState(false); 
  const [editedTask, setEditedTask] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);
  
  useEffect(() => {
    const fetchTaskDetails = async () => {
      try {
        const userId = await dbUtils.fetchUserId();
        const taskData = await dbUtils.fetchTaskDetails(taskId);
        const userRole = await authUtils.getUserRole();
        setTask(taskData);
        setEditedTask(taskData);
        setCurrentUserId(userId); 
        if (userRole === 'manager' && taskData.visibility !== 'Personal' ||
            taskData.createdBy === currentUserId && taskData.visibility === 'Personal'
        ) {
          setCanEdit(true); // Allow editing if the user is a manager or assigned to the task
        }
      } catch (err) {
        console.error('Error fetching task details:', err);
        setError('Failed to load task details.');
      } finally {
        setLoading(false);
      }
    };

    fetchTaskDetails();
  }, [taskId, currentUserId]);

  const handleEditClick = () => {
    setIsEditing(true); // Enable editing mode
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedTask((prev) => ({ ...prev, [name]: value })); // Update the edited task state
  };

  const handleSaveClick = async () => {
    try {
      await dbUtils.updateTask(taskId, editedTask); // Call the API to update the task
      setTask(editedTask); // Update the task state with the edited data
      setIsEditing(false); // Disable editing mode
    } catch (err) {
      console.error('Error saving task:', err);
      setError('Failed to save task changes.');
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
<div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Task Details</h1>
      <div style={{ marginBottom: '20px', border: '1px solid #ccc', padding: '10px' }}>
        {isEditing ? (
          <>
            <input
              type="text"
              name="title"
              value={editedTask.title}
              onChange={handleInputChange}
              style={{ width: '100%', marginBottom: '10px', padding: '5px' }}
            />
            <textarea
              name="description"
              value={editedTask.description}
              onChange={handleInputChange}
              style={{ width: '100%', marginBottom: '10px', padding: '5px' }}
            />
            <input
              type="date"
              name="startDate"
              value={new Date(editedTask.startDate).toISOString().split('T')[0]}
              onChange={handleInputChange}
              style={{ marginBottom: '10px', padding: '5px' }}
            />
            <input
              type="date"
              name="dueDate"
              value={new Date(editedTask.dueDate).toISOString().split('T')[0]}
              onChange={handleInputChange}
              style={{ marginBottom: '10px', padding: '5px' }}
            />
            <select
              name="priority"
              value={editedTask.priority}
              onChange={handleInputChange}
              style={{ marginBottom: '10px', padding: '5px' }}
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
            <button onClick={handleSaveClick} style={{ padding: '10px', backgroundColor: 'green', color: 'white' }}>
              Save
            </button>
          </>
        ) : (
          <>
            <h2>{task.title}</h2>
            <p><strong>Description:</strong> {task.description}</p>
            <p><strong>Start Date:</strong> {new Date(task.startDate).toLocaleDateString()}</p>
            <p><strong>Due Date:</strong> {new Date(task.dueDate).toLocaleDateString()}</p>
            <p><strong>Priority:</strong> {task.priority}</p>
            <p><strong>Visibility:</strong> {task.visibility}</p>
            <p><strong>Status:</strong> {task.status}</p>
            <p><strong>Assigned To:</strong> {task.assignedTo.map(user => user.username).join(', ')}</p>
            {canEdit === true && (
              <button onClick={handleEditClick} style={{ padding: '10px', backgroundColor: 'blue', color: 'white' }}>
                Edit Task
              </button>
            )}
          </>
        )}
      </div>

      <h2>Subtasks</h2>
      {task.subtasks.length > 0 ? (
        <div style={{ border: '1px solid #ccc', padding: '10px' }}>
          {task.subtasks.map((subtask) => (
            <div
              key={subtask._id}
              style={{
                marginBottom: '10px',
                padding: '10px',
                borderBottom: '1px solid #ddd',
              }}
            >
              <h3>{subtask.title}</h3>
              <p><strong>Description:</strong> {subtask.description}</p>
              <p><strong>Status:</strong> {subtask.status}</p>
              <p><strong>Assigned To:</strong> {subtask.assignedTo.map(user => user.username).join(', ')}</p>
            </div>
          ))}
        </div>
      ) : (
        <p>No subtasks available.</p>
      )}
    </div>
  );
};

export default TaskDetailsPage;