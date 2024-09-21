import api from "../config/axiosConfig";
import { showToast } from "../utils/toastNotifications";

export const submitReview = async (productId, reviewData) => {
  try {
    const response = await api.post(
      `/reviews/${productId}/`,
      reviewData,
    );
    if(response.status===400){
      showToast('you','warning');
    }
    else{
      return response.data;

    }
  } catch (error) {
    throw error;
  }
};
