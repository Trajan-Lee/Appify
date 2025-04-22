import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Select from 'react-select';
import projectUtils from '../utils/projectUtils';
import taskUtils from '../utils/taskUtils';
import subtaskUtils from '../utils/subtaskUtils';
import userUtils from '../utils/userUtils';
import authUtils from '../utils/authUtils';

const TaskDetailsPage = () => {
  const { taskId } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [canEdit, setCanEdit] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTask, setEditedTask] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [subordinates, setSubordinates] = useState([]);
  const [projects, setProjects] = useState([]);
  const [userRole, setUserRole] = useState('');
  const [subtasks, setSubtasks] = useState([]);
  const [newSubtask, setNewSubtask] = useState({ title: '', description: '', assignedTo: [] });
  const [editingSubtaskId, setEditingSubtaskId] = useState(null); // Track which subtask is being edited
  const [showCreateSubtaskForm, setShowCreateSubtaskForm] = useState(false); // Toggle for the create subtask form

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const userId = await userUtils.fetchUserId();
        const taskData = await taskUtils.fetchTaskDetails(taskId);
        const userRole = await authUtils.getUserRole();
        setTask(taskData);
        setEditedTask(taskData);
        setSubtasks(taskData.subtasks);
        setCurrentUserId(userId);
        setUserRole(userRole);

        if (
          (userRole === 'manager' && taskData.visibility !== 'Personal') ||
          (taskData.createdBy === userId && taskData.visibility === 'Personal')
        ) {
          setCanEdit(true);
        }

        if (userRole === 'manager') {
          const subordinates = await userUtils.fetchSubordinates();
          setSubordinates(subordinates);
        }

        const userProjects = await projectUtils.fetchUserProjects();
        setProjects(userProjects);
      } catch (err) {
        console.error('Error fetching task details:', err);
        setError('Failed to load task details.');
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [taskId]);

  const handleSubtaskChange = (subtaskId, field, value) => {
    setSubtasks((prev) =>
      prev.map((subtask) =>
        subtask._id === subtaskId ? { ...subtask, [field]: value } : subtask
      )
    );
  };

  const handleSaveSubtask = async (subtaskId) => {
    try {
      const subtask = subtasks.find((subtask) => subtask._id === subtaskId);
      await subtaskUtils.updateSubtask(subtaskId, subtask);
      setTask((prev) => ({
        ...prev,
        subtasks: subtasks.map((s) => (s._id === subtaskId ? subtask : s)),
      }));
      setEditingSubtaskId(null); // Exit editing mode
    } catch (error) {
      console.error('Error updating subtask:', error);
      setError('Failed to update subtask.');
    }
  };

  const handleDeleteSubtask = async (subtaskId) => {
    try {
      await subtaskUtils.deleteSubtask(subtaskId);
      setSubtasks((prev) => prev.filter((subtask) => subtask._id !== subtaskId));
    } catch (error) {
      console.error('Error deleting subtask:', error);
      setError('Failed to delete subtask.');
    }
  };

  const handleCreateSubtask = async () => {
    try {
      const createdSubtask = await subtaskUtils.createSubtask(taskId, newSubtask);
      setSubtasks((prev) => [createdSubtask, ...prev]); // Add the new subtask to the top of the list
      setNewSubtask({ title: '', description: '', assignedTo: [] });
      setShowCreateSubtaskForm(false); // Hide the form after creation
    } catch (error) {
      console.error('Error creating subtask:', error);
      setError('Failed to create subtask.');
    }
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedTask((prev) => ({ ...prev, [name]: value }));
  };

  const handleProjectChange = (e) => {
    setEditedTask((prev) => ({ ...prev, project: e.target.value }));
  };

  const handleSubordinatesChange = (selectedOptions) => {
    setEditedTask((prev) => ({
      ...prev,
      assignedTo: selectedOptions.map((option) => option.value),
    }));
  };

  const handleSaveClick = async () => {
    try {
      await taskUtils.updateTask(taskId, editedTask);
      setTask(editedTask);
      setIsEditing(false);
    } catch (err) {
      console.error('Error saving task:', err);
      setError('Failed to save task changes.');
    }
  };

  const handleDeleteClick = async () => {
    try {
      await taskUtils.deleteTask(taskId);
      navigate('/tasks');
    } catch (err) {
      console.error('Error deleting task:', err);
      setError('Failed to delete the task.');
    }
  };

  const filteredSubordinates = subordinates.filter((subordinate) =>
    task?.assignedTo.some((assignedUser) => assignedUser._id === subordinate._id)
  );

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
            <select
              name="project"
              value={editedTask.project}
              onChange={handleProjectChange}
              style={{ marginBottom: '10px', padding: '5px' }}
            >
              <option value="">Select a project</option>
              {projects.map((project) => (
                <option key={project._id} value={project._id}>
                  {project.name}
                </option>
              ))}
            </select>
            {userRole === 'manager' && editedTask.visibility === 'Team' && (
              <div>
                <label>Assign To:</label>
                <Select
                  isMulti
                  options={subordinates.map((subordinate) => ({
                    value: subordinate._id,
                    label: subordinate.username,
                  }))}
                  onChange={handleSubordinatesChange}
                  value={subordinates
                    .filter((subordinate) => editedTask.assignedTo.includes(subordinate._id))
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
            <button
              onClick={handleSaveClick}
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
            <h2>{task.title}</h2>
            <p><strong>Description:</strong> {task.description}</p>
            <p><strong>Start Date:</strong> {new Date(task.startDate).toLocaleDateString()}</p>
            <p><strong>Due Date:</strong> {new Date(task.dueDate).toLocaleDateString()}</p>
            <p><strong>Priority:</strong> {task.priority}</p>
            <p><strong>Visibility:</strong> {task.visibility}</p>
            <p><strong>Status:</strong> {task.status}</p>
            <p><strong>Project:</strong> {task.project.name}</p>
            <p><strong>Assigned To:</strong> {task.assignedTo.map(user => user.username).join(', ')}</p>
            {canEdit && (
              <>
                <button
                  onClick={handleEditClick}
                  style={{ padding: '10px', backgroundColor: 'blue', color: 'white', marginRight: '10px' }}
                >
                  Edit Task
                </button>
                <button
                  onClick={handleDeleteClick}
                  style={{ padding: '10px', backgroundColor: 'red', color: 'white' }}
                >
                  Delete Task
                </button>
              </>
            )}
          </>
        )}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Subtasks</h2>
        <button
          onClick={() => setShowCreateSubtaskForm((prev) => !prev)}
          style={{ padding: '5px 10px', backgroundColor: 'blue', color: 'white', border: 'none', borderRadius: '5px' }}
        >
          {showCreateSubtaskForm ? 'Cancel' : 'Create New Subtask'}
        </button>
      </div>

      {showCreateSubtaskForm && (
        <div style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '20px' }}>
          <h3>Create New Subtask</h3>
          <input
            type="text"
            placeholder="Subtask Title"
            value={newSubtask.title}
            onChange={(e) => setNewSubtask((prev) => ({ ...prev, title: e.target.value }))}
            style={{ width: '100%', marginBottom: '5px', padding: '5px' }}
          />
          <textarea
            placeholder="Subtask Description"
            value={newSubtask.description}
            onChange={(e) => setNewSubtask((prev) => ({ ...prev, description: e.target.value }))}
            style={{ width: '100%', marginBottom: '5px', padding: '5px' }}
          />
          <Select
            isMulti
            options={filteredSubordinates.map((subordinate) => ({
              value: subordinate._id,
              label: subordinate.username,
            }))}
            value={filteredSubordinates
              .filter((subordinate) => newSubtask.assignedTo.includes(subordinate._id))
              .map((subordinate) => ({
                value: subordinate._id,
                label: subordinate.username,
              }))}
            onChange={(selectedOptions) =>
              setNewSubtask((prev) => ({
                ...prev,
                assignedTo: selectedOptions.map((option) => option.value),
              }))
            }
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
          <button
            onClick={handleCreateSubtask}
            style={{ padding: '10px', backgroundColor: 'green', color: 'white', border: 'none', borderRadius: '5px' }}
          >
            Create Subtask
          </button>
        </div>
      )}

      <div style={{ border: '1px solid #ccc', padding: '10px' }}>
        {subtasks.map((subtask) => (
          <div
            key={subtask._id}
            style={{
              marginBottom: '10px',
              padding: '10px',
              borderBottom: '1px solid #ddd',
            }}
          >
            {editingSubtaskId === subtask._id ? (
              <>
                <input
                  type="text"
                  value={subtask.title}
                  onChange={(e) => handleSubtaskChange(subtask._id, 'title', e.target.value)}
                  style={{ width: '100%', marginBottom: '5px', padding: '5px' }}
                />
                <textarea
                  value={subtask.description}
                  onChange={(e) => handleSubtaskChange(subtask._id, 'description', e.target.value)}
                  style={{ width: '100%', marginBottom: '5px', padding: '5px' }}
                />
                <Select
                  isMulti
                  options={filteredSubordinates.map((subordinate) => ({
                    value: subordinate._id,
                    label: subordinate.username,
                  }))}
                  value={filteredSubordinates
                    .filter((subordinate) => subtask.assignedTo.includes(subordinate._id))
                    .map((subordinate) => ({
                      value: subordinate._id,
                      label: subordinate.username,
                    }))}
                  onChange={(selectedOptions) =>
                    handleSubtaskChange(
                      subtask._id,
                      'assignedTo',
                      selectedOptions.map((option) => option.value)
                    )
                  }
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
                <button
                  onClick={() => handleSaveSubtask(subtask._id)}
                  style={{ padding: '5px', backgroundColor: 'green', color: 'white', marginRight: '5px' }}
                >
                  Save
                </button>
                <button
                  onClick={() => setEditingSubtaskId(null)}
                  style={{ padding: '5px', backgroundColor: 'gray', color: 'white' }}
                >
                  Cancel
                </button>
              </>
            ) : (
              <>
                <h3>{subtask.title}</h3>
                <p>{subtask.description}</p>
                <p><strong>Assigned To:</strong> {subtask.assignedTo.map((user) => user.username).join(', ')}</p>
                <button
                  onClick={() => setEditingSubtaskId(subtask._id)}
                  style={{ padding: '5px', backgroundColor: 'blue', color: 'white', marginRight: '5px' }}
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteSubtask(subtask._id)}
                  style={{ padding: '5px', backgroundColor: 'red', color: 'white' }}
                >
                  Delete
                </button>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TaskDetailsPage;