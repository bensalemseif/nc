import React, { useState, useEffect } from "react";
import api from "../../config/axiosConfig";
import Modal from "react-modal";
import { MdDelete, MdEdit } from "react-icons/md";
import { TbListDetails } from "react-icons/tb";
import { showToast } from "../../utils/toastNotifications";
// Set the app element for accessibility reasons
Modal.setAppElement("#root");

const PromotionPage = () => {
  const [promotions, setPromotions] = useState([]);
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    discountRate: "",
    startDate: "",
    endDate: "",
    isActive: true,
    image: null, // For image upload
  });
  const [selectedPromotion, setSelectedPromotion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);

  useEffect(() => {
    fetchPromotions();
    fetchProducts();
  }, []);

  const fetchPromotions = async () => {
    try {
      const response = await api.get("/promotions");
      setPromotions(response.data);
    } catch (error) {
console.log(error)    }
  };

  const fetchProducts = async () => {
    try {
      const response = await api.get(
        "http://localhost:3030/api/products/admin/getall"
      );
      setProducts(response.data.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setFormData({ ...formData, image: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const apiUrl = isEditing
        ? `/promotions/${selectedPromotion._id}`
        : "/promotions";
      const method = isEditing ? "put" : "post";

      // Prepare the promotion data excluding the image
      const promotionData = {
        name: formData.name,
        discountRate: formData.discountRate,
        startDate: formData.startDate,
        endDate: formData.endDate,
        isActive: formData.isActive,
      };

      // Send the promotion data
      const response = await api[method](apiUrl, promotionData);
      // If an image is present, upload it using a separate API call
      if (formData.image) {
        const imageUrl = `/upload/add/promotion/${response.data._id}/`; // Assuming the image upload endpoint
        const imageFormData = new FormData();
        imageFormData.append("image", formData.image);
        await api.post(imageUrl, imageFormData);
      }
      showToast(  `Promotion ${isEditing ? "updated" : "created"} successfully`,"success");

  
      fetchPromotions();
      resetForm();
      closeModal();
    } catch (error) {
      console.log(error);
    }
  };

  const handleEditPromotion = (promotion) => {
    setFormData({
      name: promotion.name,
      discountRate: promotion.discountRate,
      startDate: promotion.startDate.split("T")[0],
      endDate: promotion.endDate.split("T")[0],
      isActive: promotion.isActive,
      image: null, // Reset image on edit
    });
    setSelectedPromotion(promotion);
    setIsEditing(true);
    openModal();
  };

  const handleDeletePromotion = async (promotionId) => {
    if (!window.confirm("Are you sure you want to delete this promotion?"))
      return;
    try {
      await api.delete(`/promotions/${promotionId}`);
      fetchPromotions();
      showToast(  `Promotion deleted successfully`,"success");

    } catch (error) {

      console.log(error);
    }
  };

  const handleProductAction = async (action, productId, promId) => {
    try {
      const endpoint = `/promotions/${promId}/${action}`;
      await api.put(endpoint, { productId });
      showToast(    `Product ${
        action === "assign" ? "assigned to" : "removed from"
      } promotion successfully`,"success");

  
      fetchProducts();
    } catch (error) {
      console.log(error)
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      discountRate: "",
      startDate: "",
      endDate: "",
      isActive: true,
      image: null,
    });
    setSelectedPromotion(null);
    setIsEditing(false);
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  const openProductModal = () => setIsProductModalOpen(true);
  const closeProductModal = () => setIsProductModalOpen(false);

  return (
    <div className="flex">
      <div className="flex-1 p-4 sm:ml-64">
        <h1 className="border border-blue-700 text-blue-600 dark:bg-green-500 font-medium rounded-lg text-lg px-5 py-5 text-center mb-5">
          Promotion Management
        </h1>

        <div>

          <div className="flex justify-between items-center mb-6">
            <button
              onClick={() => {
                resetForm();
                setIsEditing(false);
                openModal();
              }}
              class="text-blue-700 flex  hover:text-white border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-500 dark:focus:ring-blue-800"
            >
              <svg
                className="w-6 h-6 me-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
              Create New Promotion
            </button>
          </div>

          <div className="overflow-x-auto bg-white dark:bg-gray-800 shadow-md rounded-lg">
            {promotions.length > 0 ? (
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Image
                    </th>
                    <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Discount (%)
                    </th>
                    <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Start Date
                    </th>
                    <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      End Date
                    </th>

                    <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {promotions.map((promotion) => (
                    <tr key={promotion._id} className="hover:bg-gray-100">
                      <td className="px-6 py-4 border-b border-gray-200">
                        <img
                          src={`${promotion.imagePath}`}
                          alt={promotion.name}
                          className="w-16 h-16 object-cover rounded"
                        />
                      </td>
                      <td className="px-6 py-4 border-b border-gray-200">
                        {promotion.name}
                      </td>
                      <td className="px-6 py-4 border-b border-gray-200">
                        {promotion.discountRate}%
                      </td>
                      <td className="px-6 py-4 border-b border-gray-200">
                        {new Date(promotion.startDate).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 border-b border-gray-200">
                        {new Date(promotion.endDate).toLocaleDateString()}
                      </td>

                      <td className="px-6 py-4 border-b border-gray-200">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEditPromotion(promotion)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            <MdEdit className="inline mr-2" />
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeletePromotion(promotion._id)}
                            className="text-red-600 hover:text-red-900 ml-4"
                          >
                            <MdDelete className="inline mr-2" />
                            Delete
                          </button>
                          <button
                            onClick={() => {
                              setSelectedPromotion(promotion);
                              openProductModal();
                            }}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            <TbListDetails className="inline mr-2" />
                            Products
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-lg">No promotions found.</p>
            )}
          </div>

          <Modal
            isOpen={isModalOpen}
            onRequestClose={closeModal}
            contentLabel="Promotion Modal"
            className="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto bg-gray-800 bg-opacity-50"
            overlayClassName=""
          >
            <div className="relative w-[120%] left-16 max-w-5xl max-h-[80vh] bg-white rounded-lg shadow-lg md:p-5 overflow-y-auto">
              <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
                {/* Modal header */}
                <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {isEditing ? "Edit Promotion" : "Create a New Promotion"}
                  </h3>
                  <button
                    type="button"
                    onClick={closeModal}
                    className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                  >
                    <svg
                      className="w-3 h-3"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 14 14"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                      />
                    </svg>
                    <span className="sr-only">Close modal</span>
                  </button>
                </div>
                {/* Modal body */}
                <form onSubmit={handleSubmit} className="p-4 md:p-5">
                  <div className="grid gap-4 mb-4 grid-cols-2">
                    {/* Promotion Name */}
                    <div className="col-span-2 sm:col-span-1">
                      <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                        Promotion Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                        required
                      />
                    </div>
                    {/* Discount Rate */}
                    <div className="col-span-2 sm:col-span-1">
                      <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                        Discount Rate (%)
                      </label>
                      <input
                        type="number"
                        name="discountRate"
                        value={formData.discountRate}
                        onChange={handleInputChange}
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                        required
                        min="0"
                        max="100"
                      />
                    </div>
                    {/* Start Date */}
                    <div className="col-span-2 sm:col-span-1">
                      <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                        Start Date
                      </label>
                      <input
                        type="date"
                        name="startDate"
                        value={formData.startDate}
                        onChange={handleInputChange}
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                        required
                      />
                    </div>
                    {/* End Date */}
                    <div className="col-span-2 sm:col-span-1">
                      <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                        End Date
                      </label>
                      <input
                        type="date"
                        name="endDate"
                        value={formData.endDate}
                        onChange={handleInputChange}
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                        required
                      />
                    </div>

                    {/* Image Upload */}
                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                        Promotion Image
                      </label>
                      <input
                        type="file"
                        name="image"
                        accept="image/*"
                        onChange={handleInputChange}
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                        {...(!isEditing && { required: true })} // Make image required only for creation
                      />
                      {isEditing && selectedPromotion?.imageUrl && (
                        <img
                          src={selectedPromotion.imageUrl}
                          alt={selectedPromotion.name}
                          className="mt-2 w-32 h-32 object-cover rounded"
                        />
                      )}
                    </div>
                  </div>
                  {/* Action Buttons */}
                  <div className="flex justify-end mt-6 space-x-3">
                    <button
                      type="button"
                      onClick={closeModal}
                      className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                    >
                      {isEditing ? "Update Promotion" : "Create Promotion"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </Modal>

          {/* Product Modal */}
          <Modal
            isOpen={isProductModalOpen}
            onRequestClose={closeProductModal}
            contentLabel="Product Modal"
            className="bg-white p-6 rounded-lg shadow-lg max-w-2xl mx-auto my-8 outline-none"
            overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
          >
            <h2 className="text-2xl font-semibold mb-6">
              Manage Products for "{selectedPromotion?.name}"
            </h2>
            <div className="overflow-y-auto max-h-80">
              {products.length > 0 ? (
                <ul className="space-y-4">
                  {products.map((product) => {
                    // const isAssigned = selectedPromotion?.products?.includes(product._id);
                    const isAssigned =
                      product.promotion === null ||
                      product?.promotion?._id === selectedPromotion?._id
                        ? true
                        : false;

                    return (
                      <li
                        key={product._id}
                        className="flex justify-between items-center p-4 bg-gray-100 rounded-lg"
                      >
                        <span className="font-medium">
                          {product.productName}
                        </span>
                        <div className="flex space-x-2">
                          {!isAssigned ? (
                            <button
                              onClick={() =>
                                handleProductAction(
                                  "assign",
                                  product._id,
                                  selectedPromotion._id
                                )
                              }
                              className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition"
                            >
                              Assign
                            </button>
                          ) : (
                            <button
                              onClick={() =>
                                handleProductAction(
                                  "remove",
                                  product._id,
                                  selectedPromotion._id
                                )
                              }
                              className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition"
                            >
                              Remove
                            </button>
                          )}
                        </div>
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <p>No products available.</p>
              )}
            </div>
            <div className="flex justify-end mt-6">
              <button
                onClick={closeProductModal}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
              >
                Close
              </button>
            </div>
          </Modal>
        </div>
      </div>
    </div>
  );
};

export default PromotionPage;
