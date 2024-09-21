import api from "../config/axiosConfig";

// Function to get the user's cart
export const getCart = async () => {
  try {
    const response = await api.get(`/carts`);
    return response.data;
  } catch (error) {
    throw error; // Re-throw error for handling in component
  }
};


export const addToCart = async (productId, selectedGiftIds= [], quantity = 1) => {
    try {
      const response = await api.post(
        `/carts/${productId}`,
        {
          selectedGiftIds, // Send selected gift IDs as a separate object
          quantity // Send quantity as a separate object
        }
      );
      return response.data; // Adjust based on your API response structure
    } catch (error) {
      throw error; // Re-throw error for handling in component
    }
  };


  
  export const updateCartQuantities = async (data) => {
    try {
      const response = await api.put('/carts',data);
      return response.data;
    } catch (error) {
      throw error; // Re-throw error for handling in component
    }
  };


  export const removeFromCart = async (productId) => {
    try {
      const response = await api.delete(`/carts/${productId}`);
      return response.data;
    } catch (error) {
      throw error; // Re-throw error for handling in component
    }
  };