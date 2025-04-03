import axios from 'axios';
const api_url = process.env.REACT_APP_API_URL;
console.log('API URL:', api_url);
const userUtils = {
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

  fetchSubordinates: async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${api_url}/users/subordinates`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching subordinates:', error);
      throw error;
    }
  },

  fetchUserProjects: async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${api_url}/projects/all`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching user projects:', error);
      throw error;
    }
  },

  fetchTasks: async () => {
    try {
      console.log('fetchTasks called'); // Debug: Check if fetchTasks is called
      const token = localStorage.getItem('token');

      //console.log('Token:', token); // Debug: Check if the token exists
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
      console.log('fetchAllTasks called'); // Debug: Check if fetchAllTasks is called
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
      console.log('fetchTaskDetails called'); // Debug: Check if fetchTaskDetails is called
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
  
  fetchUsername: async () => {
    try {
      console.log('fetchUsername called'); // Debug: Check if fetchUsername is called
      const token = localStorage.getItem('token');

      if (!token) {
        console.error('No token found in localStorage');
      }

      const response = await axios.get(`${api_url}/users/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log('Fetched username from API:', response.data.username); // Debug: Log API response
      return response.data.username;
    } catch (error) {
      console.error('Error fetching username:', error);
      throw error;
    }
  },

  fetchUserId: async () => {
    try {
      console.log('fetchUserId called'); // Debug: Check if fetchUserId is called
      const token = localStorage.getItem('token');

      if (!token) {
        console.error('No token found in localStorage');
      }

      const response = await axios.get(`${api_url}/users/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log('Fetched user ID from API:', response.data._id); // Debug: Log API response
      return response.data._id;
    } catch (error) {
      console.error('Error fetching user ID:', error);
      throw error;
    }
  }
}

export default userUtils;