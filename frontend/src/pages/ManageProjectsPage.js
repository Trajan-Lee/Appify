import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import projectUtils from '../utils/projectUtils';
import './styles/uniformStyles.css';

const ManageProjectsPage = () => {
  const [projects, setProjects] = useState([]);
  const [error, setError] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false); // Toggle for the create form
  const [newProject, setNewProject] = useState({ name: '', description: '' }); // State for the new project

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const projects = await projectUtils.fetchUserProjects();
        setProjects(projects);
      } catch (error) {
        console.error('Error fetching projects:', error);
        setError('Failed to load projects.');
      }
    };

    fetchProjects();
  }, []);

  const handleCreateProject = async () => {
    try {
      const createdProject = await projectUtils.createProject(newProject);
      setProjects((prev) => [createdProject, ...prev]); // Add the new project to the top of the list
      setNewProject({ name: '', description: '' }); // Reset the form
      setShowCreateForm(false); // Hide the form
    } catch (error) {
      console.error('Error creating project:', error);
      setError('Failed to create project.');
    }
  };

  if (error) return <p className="error-message">{error}</p>;

  return (
    <div className="uniform-container">
      <div className="uniform-header">
        <h1>Manage Projects</h1>
        <button
          onClick={() => setShowCreateForm((prev) => !prev)}
          className="uniform-create-button"
        >
          {showCreateForm ? 'Cancel' : 'Create New Project'}
        </button>
      </div>

      {showCreateForm && (
        <div style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '20px', borderRadius: '5px' }}>
          <h3>Create New Project</h3>
          <input
            type="text"
            placeholder="Project Name"
            value={newProject.name}
            onChange={(e) => setNewProject((prev) => ({ ...prev, name: e.target.value }))}
            style={{ width: '100%', marginBottom: '10px', padding: '5px' }}
          />
          <textarea
            placeholder="Project Description"
            value={newProject.description}
            onChange={(e) => setNewProject((prev) => ({ ...prev, description: e.target.value }))}
            style={{ width: '100%', marginBottom: '10px', padding: '5px' }}
          />
          <button
            onClick={handleCreateProject}
            style={{ padding: '10px', backgroundColor: 'green', color: 'white', border: 'none', borderRadius: '5px' }}
          >
            Create Project
          </button>
        </div>
      )}

      <div className="uniform-section">
        <h2>Projects</h2>
        <table className="uniform-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            {projects.length > 0 ? (
              projects.map((project) => (
                <tr key={project._id}>
                  <td>
                    <Link to={`/projects/${project._id}`} className="uniform-link">
                      {project.name}
                    </Link>
                  </td>
                  <td>{project.description}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="2" className="no-data-message">No projects available.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageProjectsPage;