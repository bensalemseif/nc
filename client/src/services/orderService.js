import api from "../config/axiosConfig";
import { showToast } from "../utils/toastNotifications";

export const createOrder = async (shippingInfo) => {
  try {
    const response = await api.post(`/orders/create`, shippingInfo);
    if (response.statusText === "Created") showToast('Order created successfully','success')
    return response.data;
  } catch (error) {
    showToast('something went wrong','error')

  }
};
