import React, { useState, useEffect } from "react";
import Pagination from "../../components/Pagination.js";
import { MdEdit, MdDelete } from "react-icons/md";
import api from "../../config/axiosConfig.js";
import { showToast } from "../../utils/toastNotifications.js";
export default function CadeauProduct() {
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [isModalEditOpen, setIsModalEditOpen] = useState(false);
  const [itemToUpdate, setItemToUpdate] = useState(null);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({
    giftName: "",
    pointValue: "",
    stock: "",
  });
  const [photos, setPhotos] = useState([]);
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await api.get("/gifts");
      setProducts(response.data.slice(0, 10));
    } catch (error) {
    }
  };

  const handleCloseModal = () => {
    setFormData({ giftName: "", pointValue: "", stock: "" }); // This should reset the form
  };

  const handleEditClick = (product) => {
    setItemToUpdate(product);
    setFormData({
      giftName: product.giftName,
      pointValue: product.pointValue,
      stock: product.stock,
    });
    setPhotos(product.photos || []); // Assuming the product includes an array of image URLs
    setIsModalEditOpen(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage("");

    try {
      const { _id } = itemToUpdate;

      await api.put(`/gifts/${_id}`, formData);

      if (photos.length > 0) {
        const formDataImages = new FormData();
        photos.forEach((photo) => {
          if (typeof photo !== "string") {
            // Upload only new files
            formDataImages.append("image", photo);
          }
        });

        await api.post(`/upload/add/gift/${_id}`, formDataImages, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      }
      showToast("Gift Updated successfully!","success");

      fetchProducts();
    } catch (error) {
      setMessage("Failed to update product. Please try again.");
    } finally {
      setIsModalEditOpen(false);
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (product) => {
    try {
      await api.delete(`/gifts/${product}`);
      await api.delete(`/upload/delete-images/gift/${product}`);
      showToast("Gift deleted successfully!","success");

      fetchProducts();
    } catch (error) {
      setMessage("Failed to delete product. Please try again.");
    } finally {
      setItemToDelete(null);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage("");
    try {
      const response = await api.post("/gifts", formData);

      const { _id } = response.data;

      if (photos.length > 0) {
        const formDataImages = new FormData();
        photos.forEach((photo) => {
          formDataImages.append("image", photo);
        });

        await api.post(`/upload/add/gift/${_id}`, formDataImages, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      }
      showToast("Gift created and image uploaded successfully!","success");


      setFormData({ giftName: "", pointValue: "", stock: "" });
      setPhotos([]);
      fetchProducts();
      setShowAddProductModal(false);
    } catch (error) {
      setMessage("Failed to create gift or upload image. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setPhotos((prevPhotos) => [...prevPhotos, ...selectedFiles]);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  return (
    <div>
      <div className="p-4 sm:ml-64">
        <h1 className="border border-blue-700 text-blue-600 dark:bg-green-500 font-medium rounded-lg text-lg px-5 py-5 text-center mb-5">
          Cadeau Management
        </h1>
        <button
          onClick={() => setShowAddProductModal(true)}
          className="text-blue-700 flex hover:text-white border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mb-2 dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-500 dark:focus:ring-blue-800"
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
          Add Gift
        </button>

        {showAddProductModal && (
          <AddProductModal
            formData={formData}
            handleChange={handleChange}
            handleFileChange={handleFileChange}
            handleSave={handleSave}
            isSubmitting={isSubmitting}
            photos={photos}
            message={message}
            setShowAddProductModal={setShowAddProductModal}
          />
        )}

        {isModalEditOpen && (
          <EditProductModal
            formData={formData}
            handleChange={handleChange}
            handleFileChange={handleFileChange}
            handleUpdate={handleUpdate}
            isSubmitting={isSubmitting}
            photos={photos}
            message={message}
            setIsModalEditOpen={setIsModalEditOpen}
            handleCloseModal={handleCloseModal}
          />
        )}

        <div className="overflow-x-auto shadow-md sm:rounded-lg">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Gift Name
                </th>
                <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Point Value
                </th>
                <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Stock
                </th>
                <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr
                  key={product._id}
                  className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-100"
                >
                  <td className="px-6 py-4 border-b border-gray-200 flex justify-centre items-centre">
                    <img
                      src={`${product.imagePath}`}
                      alt={product.giftName}
                      className="w-12 h-12 mr-4 rounded"
                    />
                    {product.giftName}
                  </td>{" "}
                  <td className="px-6 py-4 border-b border-gray-200">
                    {product.pointValue}
                  </td>
                  <td className="px-6 py-4 border-b border-gray-200">
                    {product.stock}
                  </td>
                  <td className="px-6 py-4 border-b border-gray-200">
                    <button
                      onClick={() => handleEditClick(product)}
                      className="text-blue-600 hover:text-red-900 ml-4"
                    >
                      <MdEdit className="inline mr-2" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(product._id)}
                      className="text-red-600 hover:text-red-900 ml-4"
                    >
                      <MdDelete className="inline mr-2" />
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <Pagination
          totalItems={products.length}
          itemsPerPage={10}
          onPageChange={fetchProducts}
        />
      </div>
    </div>
  );
}

const AddProductModal = ({
  formData,
  handleChange,
  handleFileChange,
  handleSave,
  isSubmitting,
  photos,
  message,
  setShowAddProductModal,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto bg-gray-800 bg-opacity-50">
      <div className="relative w-[120%] left-16 max-w-5xl max-h-[80vh] bg-white rounded-lg shadow-lg md:p-5 overflow-y-auto">
        <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
          <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Add Gift
            </h3>
            <button
              type="button"
              onClick={() => setShowAddProductModal(false)}
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
          <form onSubmit={handleSave} className="p-4 md:p-5">
            <div className="grid gap-4 mb-4 grid-cols-2">
              <div className="col-span-2 sm:col-span-1">
                <label
                  htmlFor="giftName"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Gift Name
                </label>
                <input
                  type="text"
                  name="giftName"
                  value={formData.giftName}
                  onChange={handleChange}
                  placeholder="Gift Name"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  required
                />
              </div>
              <div className="col-span-2 sm:col-span-1">
                <label
                  htmlFor="pointValue"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Point Value
                </label>
                <input
                  type="number"
                  name="pointValue"
                  min="1"
                  max="3"
                  value={formData.pointValue}
                  onChange={handleChange}
                  placeholder="Point Value"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  required
                />
              </div>
              <div className="col-span-2 sm:col-span-1">
                <label
                  htmlFor="stock"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Stock
                </label>
                <input
                  type="number"
                  name="stock"
                  value={formData.stock}
                  onChange={handleChange}
                  placeholder="Stock"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  required
                />
              </div>
              <div className="col-span-2 sm:col-span-1">
                <label
                  htmlFor="giftImage"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Gift Image
                </label>
                <input
                  type="file"
                  multiple
                  onChange={handleFileChange}
                  class="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                />
              </div>
              {photos.length > 0 && (
                <div className="col-span-2 grid grid-cols-3 gap-2 mt-2">
                  {photos.map((photo, index) => (
                    <img
                      key={index}
                      src={
                        typeof photo === "string"
                          ? photo
                          : URL.createObjectURL(photo)
                      }
                      alt="Gift"
                      className="w-full h-24 object-cover rounded-lg"
                    />
                  ))}
                </div>
              )}
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700"
            >
              {isSubmitting ? "Saving..." : "Save Gift"}
            </button>
          </form>
          {message && (
            <p className="text-center mt-2 text-red-500">{message}</p>
          )}
        </div>
      </div>
    </div>
  );
};

const EditProductModal = ({
  formData,
  handleChange,
  handleFileChange,
  handleUpdate,
  isSubmitting,
  photos,
  message,
  setIsModalEditOpen,
  handleCloseModal,
}) => {
  return (
    <div className="fixed inset-0 z-50 overflow-auto bg-smoke-800 flex">
      <div className="relative p-4 w-full max-w-lg m-auto flex-col flex bg-white rounded-lg shadow dark:bg-gray-700">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            Edit Gift
          </h3>
          <button
            onClick={() => {
              setIsModalEditOpen(false);
              handleCloseModal();
            }}
            className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
        <form onSubmit={handleUpdate} className="space-y-4">
          <input
            type="text"
            name="giftName"
            value={formData.giftName}
            onChange={handleChange}
            placeholder="Gift Name"
            className="w-full p-2 border rounded-lg"
            required
          />
          <input
            type="number"
            name="pointValue"
            value={formData.pointValue}
            onChange={handleChange}
            placeholder="Point Value"
            className="w-full p-2 border rounded-lg"
            required
          />
          <input
            type="number"
            name="stock"
            value={formData.stock}
            onChange={handleChange}
            placeholder="Stock"
            className="w-full p-2 border rounded-lg"
            required
          />
          <input
            type="file"
            multiple
            onChange={handleFileChange}
            className="w-full p-2 border rounded-lg"
          />
          {photos.length > 0 && (
            <div className="grid grid-cols-3 gap-2 mt-2">
              {photos.map((photo, index) => (
                <img
                  key={index}
                  src={
                    typeof photo === "string"
                      ? photo
                      : URL.createObjectURL(photo)
                  }
                  alt="Gift"
                  className="w-full h-24 object-cover rounded-lg"
                />
              ))}
            </div>
          )}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700"
          >
            {isSubmitting ? "Updating..." : "Update Gift"}
          </button>
        </form>
        {message && <p className="text-center mt-2 text-red-500">{message}</p>}
      </div>
    </div>
  );
};
