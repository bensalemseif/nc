import api from '../config/axiosConfig'; // Import the custom Axios instance

// Fetch user details by ID (using cookies for token)
export const getUserProfile = async () => {
  try {
    const response = await api.get('/users/profile'); 
    return response.data;
  } catch (error) {
    throw error;
  }
};
