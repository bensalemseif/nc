// categoryService.js
import api from '../config/axiosConfig';
// Service to get all categories as a tree
export const getCategories = async () => {
  try {
    const response = await api.get('/categories/');
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Service to get a single category by ID with subcategories
export const getCategoryById = async (id) => {
  try {
    const response = await api.get(`/categories/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Service to get subcategories of a specific category by ID
export const getSubCategory = async (id) => {
  try {
    const response = await api.get(`/categories/subcategories/${id}/`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
