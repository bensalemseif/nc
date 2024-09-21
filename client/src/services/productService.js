import api from "../config/axiosConfig";

export const getProductDetails = async (productId) => {
  try {
    const response = await api.get(`/products/${productId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const getProducts = async () => {
  try {
    const response = await api.get(`/products/?limit=8`);
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

// Function to add or remove a product from the wishlist
export const toggleWishlist = async (productId, isInWishlist) => {
    try {
      const url = isInWishlist
        ? `/wishlist/remove/${productId}`
        : `/wishlist/add/${productId}`;
        
      const method = isInWishlist ? 'DELETE' : 'POST';
      
      const response = await api({
        method,
        url,

      });
      return response.data;
    } catch (error) {
      throw error;
    }
  };
  
  // Function to check if a product is in the wishlist
  export const checkWishlistStatus = async (productId) => {
    try {
      const response = await api.get(`/wishlist/check/${productId}`, {

      });
      return response.data.isInWishlist;
    } catch (error) {
      throw error;
    }
  };



// Function to get available gifts
export const getAvailableGifts = async () => {
  try {
    const response = await api.get(`/gifts`, {

    });;
    return response.data; // Adjust based on your API response structure
  } catch (error) {
    throw error; // Re-throw error for handling in component
  }
};
  



export const getBestSellingProducts = async () => {
  try {
    const response = await api.get(`/admin/top-products`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
