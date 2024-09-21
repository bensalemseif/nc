import api from '../config/axiosConfig';

// Function to get active promotions
export const getPromotions = async () => {
  try {
    const response = await api.get('/promotions/active');
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

// Function to get upcoming promotions
export const getPromotionsUpcoming = async () => {
  try {
    const response = await api.get('/promotions/upcoming');
    return response.data.data;
  } catch (error) {
    throw error;
  }
};
