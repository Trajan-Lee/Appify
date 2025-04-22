import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
const api_url = process.env.REACT_APP_API_URL;


const authUtils = {

  getUserRole: async () => {
    try {
      const token = localStorage.getItem('token');

      if (!token) {
        console.error('No token found in localStorage');
      }

      const response = await axios.get(`${api_url}/auth/role`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data.role;
    } catch (error) {
      console.error('Error fetching role:', error);
      throw error;
    }
  },

// Function to log out the user
  handleLogout: () => {
    localStorage.removeItem('token'); // Remove the token from localStorage
    window.location.href = '/login'; // Redirect to the login page
  },
  
  // Function to check if the user is authenticated
  isAuthenticated: () => {
    const token = localStorage.getItem('token');
    if (!token) return false;

    try {
      const { exp } = jwtDecode(token); // Decode the token to get the expiration time
      if (Date.now() >= exp * 1000) {
        authUtils.handleLogout(); // Logout if the token is expired
        return false;
      }
      return true;
    } catch (error) {
      console.error('Invalid token:', error);
      return false;
    }
  },
};

export default authUtils;