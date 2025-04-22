import axios from 'axios';
const api_url = process.env.REACT_APP_API_URL;

const userUtils = {
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

  fetchUsername: async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No token found in localStorage');
      }
      const response = await axios.get(`${api_url}/users/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data.username;
    } catch (error) {
      console.error('Error fetching username:', error);
      throw error;
    }
  },

  fetchUserId: async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No token found in localStorage');
      }
      const response = await axios.get(`${api_url}/users/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data._id;
    } catch (error) {
      console.error('Error fetching user ID:', error);
      throw error;
    }
  },
  fetchUserById: async (userId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No token found in localStorage');
        throw new Error('Unauthorized');
      }
      const response = await axios.get(`${api_url}/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching user by ID:', error);
      throw error;
    }
  },

  // Fetch all managers
  fetchManagers: async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No token found in localStorage');
        throw new Error('Unauthorized');
      }
      const response = await axios.get(`${api_url}/users/managers`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching managers:', error);
      throw error;
    }
  },
  
// Create a new user
createUser: async (userData) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found in localStorage');
      throw new Error('Unauthorized');
    }
    const response = await axios.post(`${api_url}/users`, userData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
},

// Update an existing user
updateUser: async (userId, userData) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found in localStorage');
      throw new Error('Unauthorized');
    }
    const response = await axios.put(`${api_url}/users/${userId}`, userData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
},

// Delete a user
deleteUser: async (userId) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found in localStorage');
      throw new Error('Unauthorized');
    }
    const response = await axios.delete(`${api_url}/users/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
},
};

export default userUtils;