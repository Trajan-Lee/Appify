import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import projectUtils from '../utils/projectUtils';

const ProjectDetailsPage = () => {
  const { projectId } = useParams();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedProject, setEditedProject] = useState(null);
  const [showCompleted, setShowCompleted] = useState(true);
  const [showInProgress, setShowInProgress] = useState(true);
  const [showPending, setShowPending] = useState(true);

  useEffect(() => {
    const fetchProjectDetails = async () => {
      try {
        const projectData = await projectUtils.fetchProjectById(projectId);
        setProject(projectData);
        setEditedProject(projectData);
        setTasks(projectData.tasks || []);
      } catch (err) {
        console.error('Error fetching project details:', err);
        setError('Failed to load project details.');
      } finally {
        setLoading(false);
      }
    };

    fetchProjectDetails();
  }, [projectId]);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedProject((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveClick = async () => {
    try {
      await projectUtils.updateProject(projectId, editedProject);
      setProject(editedProject);
      setIsEditing(false);
    } catch (err) {
      console.error('Error saving project:', err);
      setError('Failed to save project changes.');
    }
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    if (name === 'completed') setShowCompleted(checked);
    if (name === 'inProgress') setShowInProgress(checked);
    if (name === 'pending') setShowPending(checked);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Project Details</h1>
      <div style={{ marginBottom: '20px', border: '1px solid #ccc', padding: '10px' }}>
        {isEditing ? (
          <>
            <input
              type="text"
              name="name"
              value={editedProject.name}
              onChange={handleInputChange}
              style={{ width: '100%', marginBottom: '10px', padding: '5px' }}
            />
            <textarea
              name="description"
              value={editedProject.description}
              onChange={handleInputChange}
              style={{ width: '100%', marginBottom: '10px', padding: '5px' }}
            />
            <button onClick={handleSaveClick} style={{ padding: '10px', backgroundColor: 'green', color: 'white' }}>
              Save
            </button>
          </>
        ) : (
          <>
            <h2>{project.name}</h2>
            <p><strong>Description:</strong> {project.description}</p>
            <button onClick={handleEditClick} style={{ padding: '10px', backgroundColor: 'blue', color: 'white' }}>
              Edit Project
            </button>
          </>
        )}
      </div>

      <h2>Tasks</h2>
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

export default ProjectDetailsPage;