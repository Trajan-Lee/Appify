import axios from 'axios';
const api_url = process.env.REACT_APP_API_URL;

const subtaskUtils = {
    // Create a new subtask
    createSubtask: async (taskId, subtaskData) => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          console.error('No token found in localStorage');
          throw new Error('Unauthorized');
        }
        const response = await axios.post(`${api_url}/subtasks`, { ...subtaskData, task: taskId }, {
          headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
      } catch (error) {
        console.error('Error creating subtask:', error);
        throw error;
      }
    },
  
    // Update an existing subtask
    updateSubtask: async (subtaskId, updates) => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          console.error('No token found in localStorage');
          throw new Error('Unauthorized');
        }
        const response = await axios.put(`${api_url}/subtasks/${subtaskId}`, updates, {
          headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
      } catch (error) {
        console.error('Error updating subtask:', error);
        throw error;
      }
    },
  
    // Delete a subtask
    deleteSubtask: async (subtaskId) => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          console.error('No token found in localStorage');
          throw new Error('Unauthorized');
        }
        const response = await axios.delete(`${api_url}/subtasks/${subtaskId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
      } catch (error) {
        console.error('Error deleting subtask:', error);
        throw error;
      }
    },
  };
  
  export default subtaskUtils;