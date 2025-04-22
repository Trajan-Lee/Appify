import axios from 'axios';
const api_url = process.env.REACT_APP_API_URL;

const taskUtils = {
  createTask: async (taskData) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${api_url}/tasks`, taskData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      console.error('Error creating task:', error);
      throw error;
    }
  },

  fetchTasks: async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No token found in localStorage');
      }
      const response = await axios.get(`${api_url}/tasks/assigned`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching tasks:', error);
      throw error;
    }
  },

  fetchAllTasks: async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No token found in localStorage');
        throw new Error('Unauthorized');
      }
      const response = await axios.get(`${api_url}/tasks/all`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching all tasks:', error);
      throw error;
    }
  },

  fetchTaskDetails: async (taskId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No token found in localStorage');
      }
      const response = await axios.get(`${api_url}/tasks/${taskId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching task details:', error);
      throw error;
    }
  },

  fetchTasksByUserId: async (userId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No token found in localStorage');
        throw new Error('Unauthorized');
      }
      const response = await axios.get(`${api_url}/tasks/user/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching tasks by user ID:', error);
      throw error;
    }
  },
  updateTask: async (taskId, updates) => {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            console.error('No token found in localStorage');
            throw new Error('Unauthorized');
        }
        const response = await axios.put(`${api_url}/tasks/${taskId}`, updates, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    } catch (error) {
        console.error('Error updating task:', error);
        throw error;
    }
  },

  deleteTask: async (taskId) => {
      try {
          const token = localStorage.getItem('token');
          if (!token) {
              console.error('No token found in localStorage');
              throw new Error('Unauthorized');
          }
          const response = await axios.delete(`${api_url}/tasks/${taskId}`, {
              headers: { Authorization: `Bearer ${token}` },
          });
          return response.data;
      } catch (error) {
          console.error('Error deleting task:', error);
          throw error;
      }
  },
  
};

export default taskUtils;