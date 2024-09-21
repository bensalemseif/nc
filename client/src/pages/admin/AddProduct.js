import React, { useState, useEffect } from "react";
import Pagination from "../../components/Pagination.js";
import { MdDelete, MdDisabledByDefault } from "react-icons/md";
import { TbListDetails } from "react-icons/tb";
import { PiKeyReturn } from "react-icons/pi";
import api from "../../config/axiosConfig.js";
import { useNavigate } from "react-router-dom";
import { TagsInput } from "react-tag-input-component";
import { showToast } from "../../utils/toastNotifications.js";
export default function AddProduct() {
  const [selected, setSelected] = useState([]);

  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [productToDelete, setProductToDelete] = useState(null);
  const [categories, setCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  const [photos, setPhotos] = useState([]);
  const navigate = useNavigate();
  const [form, setForm] = useState({
    productName: "",
    price: "",
    stock: "",
    realStock: "",
    description: "",
    category: "",
    includingGift: false,
    giftPoints: "",
    video: "",
    Ingredients: [],
  });
  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setPhotos(selectedFiles);
  };

  const handleAddProduct = async (event) => {
    event.preventDefault();
    form.Ingredients = selected;
    try {
      const response = await api.post("/products", form);
      const _id = response.data;
      if (photos.length > 0) {
        const formDataImages = new FormData();
        photos.forEach((photo) => {
          formDataImages.append("images", photo);
        });
        await api.post(`/upload/add/multiple/product/${_id}`, formDataImages);
      }
      setShowAddProductModal(false);
      setForm({
        productName: "",
        price: "",
        stock: "",
        realStock: "",
        description: "",
        category: "",
        includingGift: false,
        giftPoints: "",
        video: "",
        Ingredients: [],
      });
      showToast(`product added successfuly`,'success');

      setSelected([]);
    } catch (error) {
console.log(error)    }
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get("/categories/select/all");
        setCategories(response.data);
      } catch (err) {

console.log(err)      }
    };

    fetchCategories();
  }, []);

  const handleDelete = async () => {
    try {
      const response = await api.delete(`/products/${productToDelete._id}`);
      setProducts(
        products.filter((product) => product._id !== productToDelete._id)
      );
      setIsDeleteModalOpen(false);
      setProductToDelete(null);
   
      return response;
    } catch (error) {
    }
  };

  const closeAddProductModal = () => {
    setShowAddProductModal(false);
  };

  const openAddProductModal = () => {
    setShowAddProductModal(true);
  };

  const fetchProducts = async () => {
    try {
      const params = new URLSearchParams({
        page: currentPage,
        search: searchQuery,
      });
      const response = await api.get(`/products/admin/getall?${params.toString()}`);
      setProducts(response.data.data);
      setTotalPages(response.data.pagination.totalPages);
    } catch (error) {
    }
  };
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  useEffect(() => {
    fetchProducts();
  }, [searchQuery, currentPage]);

  const handleInputChange = (e) => {
    const { name, value, type, files, checked } = e.target;
    if (type === "checkbox") {
      setForm((prev) => ({ ...prev, [name]: checked }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };
  const handleCardClick = (productId) => {
    navigate(`/admin/product-details/${productId}`);
  };

  const DisableProudct = async (id, isDisable) => {
    try {
      await api.put(`/products/disable/${id}`, { isDisable });
      
      showToast(`Product ${isDisable ? "disabled" : "enabled"} successfuly`,'success');

      fetchProducts();



    } catch (error) {
console.log(error)    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div>
      <div className="p-4 sm:ml-64">
        <h1
          class=" border border-blue-700 text-blue-600 
dark:bg-green-500 font-medium rounded-lg text-lg px-5  py-5 text-center mb-5"
        >
          Product Management
        </h1>

        <div className="flex justify-between items-center">
          <button
            onClick={openAddProductModal}
            className="text-blue-700 flex hover:text-white border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-500 dark:focus:ring-blue-800"
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
            Add Product
          </button>
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="border border-gray-300 rounded-lg px-4 py-2 w-full max-w-xs ml-4"
          />
        </div>

        {/* Add Product Modal */}
        {showAddProductModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto bg-gray-800 bg-opacity-50">
            <div className="relative w-[120%] left-16 max-w-5xl max-h-[80vh] bg-white rounded-lg shadow-lg  md:p-5 overflow-y-auto">
              {/* Modal content */}
              <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
                {/* Modal header */}
                <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Add New Product
                  </h3>
                  <button
                    type="button"
                    onClick={closeAddProductModal}
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
                <form onSubmit={handleAddProduct} className="p-4 md:p-5">
                  <div className="grid gap-4 mb-4 grid-cols-2">
                    <div className="col-span-2 sm:col-span-1">
                      <label
                        htmlFor="productName"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                      >
                        Product Name
                      </label>
                      <input
                        type="text"
                        name="productName"
                        id="productName"
                        value={form.productName}
                        onChange={handleInputChange}
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                        placeholder="Type product name"
                        required
                      />
                    </div>
                    <div className="col-span-2 sm:col-span-1">
                      <label
                        htmlFor="price"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                      >
                        Price
                      </label>
                      <input
                        type="number"
                        name="price"
                        id="price"
                        value={form.price}
                        onChange={handleInputChange}
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                        placeholder="150TND"
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
                        id="stock"
                        value={form.stock}
                        onChange={handleInputChange}
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                        placeholder="Stock quantity"
                        required
                      />
                    </div>
                    <div className="col-span-2 sm:col-span-1">
                      <label
                        htmlFor="realStock"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                      >
                        Real Stock
                      </label>
                      <input
                        type="number"
                        name="realStock"
                        id="realStock"
                        value={form.realStock}
                        onChange={handleInputChange}
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                        placeholder="Real stock quantity"
                        required
                      />
                    </div>
                    <div className="col-span-2 sm:col-span-1">
                      <label
                        htmlFor="size"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                      >
                        Size
                      </label>
                      <input
                        type="text"
                        name="size"
                        id="size"
                        value={form.size}
                        onChange={handleInputChange}
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                        placeholder="Product size"
                      />
                    </div>
                    <div className="col-span-2 sm:col-span-1">
                      <label
                        htmlFor="video"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                      >
                        Link Video
                      </label>
                      <input
                        type="url"
                        name="video"
                        id="video"
                        value={form.video}
                        onChange={handleInputChange}
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                        placeholder="URL to video"
                      />
                    </div>
                    <div className="col-span-2">
                      <label
                        htmlFor="description"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                      >
                        Description
                      </label>
                      <textarea
                        name="description"
                        id="description"
                        value={form.description}
                        onChange={handleInputChange}
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                        placeholder="Write product description here"
                        rows="4"
                        required
                      />
                    </div>
                    <div className="col-span-2">
                      <label
                        htmlFor="category"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                      >
                        Category
                      </label>
                      <select
                        name="category"
                        id="category"
                        value={form.category}
                        onChange={handleInputChange}
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                        required
                      >
                        <option value="">Select Category</option>
                        {categories.map((category) => (

                          <option key={category._id} value={category._id}>
                            {category.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="col-span-2">
                      <label
                        htmlFor="productImage"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                      >
                        Product Image
                      </label>
                      <input
                        type="file"
                        name="productImage"
                        id="productImage"
                        onChange={handleFileChange}
                        class="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                        multiple
                      />
                    </div>
                    <div className="col-span-2">
                      <label
                        htmlFor="ingredients"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                      >
                        Ingredients
                      </label>
                      <div className="relative">
                        <TagsInput
                          value={selected}
                          onChange={setSelected}
                          name="fruits"
                          placeHolder="enter your ingredient"
                          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                          style={{ color: "red" }}
                        />
                      </div>
                    </div>
                    <div className="col-span-2">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          name="includingGift"
                          checked={form.includingGift}
                          onChange={handleInputChange}
                          className="mr-2"
                        />
                        Include Gift
                      </label>
                    </div>
                    {form.includingGift && (
                      <div className="col-span-2">
                        <label
                          htmlFor="giftPoints"
                          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                        >
                          Gift Points
                        </label>
                        <input
                          type="number"
                          name="giftPoints"
                          id="giftPoints"
                          value={form.giftPoints}
                          onChange={handleInputChange}
                          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                        />
                      </div>
                    )}
                  </div>
                  <button
                    type="submit"
                    className="text-white inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                  >
                    <svg
                      className="me-1 -ms-1 w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Add Product
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Delete Product Modal */}
        {isDeleteModalOpen && productToDelete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto bg-gray-800 bg-opacity-50">
            <div className="relative w-full max-w-sm mx-auto bg-white p-6 rounded-lg shadow-lg">
              <h2 className="text-xl font-bold mb-4">Confirm Deletion</h2>
              <p>
                Are you sure you want to delete {productToDelete.productName}?
              </p>
              <div className="flex justify-end mt-4">
                <button
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="px-4 py-2 bg-gray-300 rounded-md text-gray-700 mr-2"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 bg-red-600 text-white rounded-md"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Product List */}
        {/* Product Table */}
        <div className="overflow-x-auto mt-6">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product Image
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stock
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {products.map((product) => (
                <tr key={product._id} className="hover:bg-gray-100">
                  <td className="px-6 py-4 border-b border-gray-200">
                    <img
                    
                      src={product.imagePath[0]}
                      alt={product.productName}
                      className="w-16 h-16 object-cover rounded"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {product.productName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {product?.category.name || "N/A"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {product.stock}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {product.price} TND
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleCardClick(product._id)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      <TbListDetails className="inline mr-2" />
                      Details
                    </button>
                    <button
                      onClick={() => {
                        setProductToDelete(product);
                        setIsDeleteModalOpen(true);
                      }}
                      className="text-red-600 hover:text-red-900 ml-4"
                    >
                      <MdDelete className="inline mr-2" />
                      Delete
                    </button>
                    <button
                      onClick={() => {
                        DisableProudct(product._id, !product.isDisabled);
                      }}
                      className={`"text-red-600 hover:text-red-900 ml-6 h-4 text-lg"${
                        product.isDisabled ? "bg-red-500 " : "bg-green-500"
                      } text-blue`}
                    >
                      {product.isDisabled ? (
                        <div className="text-red-600">
                          <MdDisabledByDefault className="inline mr-2" />{" "}
                          disabled
                        </div>
                      ) : (
                        <div className="text-green-600">
                          {" "}
                          <PiKeyReturn className="inline mr-2" /> enabled
                        </div>
                      )}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <Pagination
              totalPages={totalPages}
              currentPage={currentPage}
              onPageChange={handlePageChange}
/>
      </div>

    </div>
  );
}
