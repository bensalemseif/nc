import React, { useState, useEffect } from "react";
import { MdDelete, MdEdit, MdExpandMore, MdExpandLess } from "react-icons/md";
import api from "../../config/axiosConfig";
import Spinner from "../../components/Spinner";
import { showToast } from "../../utils/toastNotifications";
const CategoryPage = () => {
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState({});
  const [expandedCategoryId, setExpandedCategoryId] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [newCategory, setNewCategory] = useState({ name: "", parent: "" });
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchParentCat = async () => {
    try {
      const response = await api.get("/categories/adnin/parent");
      setCategories(response.data);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchParentCat();
  }, [categories]);

  const openAddModal = () => {
    setNewCategory({ name: null, parent: null });
    setShowAddModal(true);
  };

  const closeAddModal = () => {
    setShowAddModal(false);
  };

  const openEditModal = (category) => {
    setSelectedCategory(category);
    setNewCategory({
      name: category.name,
      parent: category.parent ? category.parent : "",
    });
    setShowEditModal(true);
  };

  const closeEditModal = () => {
    setShowEditModal(false);
  };

  const openDeleteModal = (category) => {
    setSelectedCategory(category);
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setSelectedCategory(null);
    setShowDeleteModal(false);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleAddCategory = async () => {
    try {
      const response = await api.post("/categories/", newCategory);
      const categoryId = response.data.category._id;

      if (image) {
        const formData = new FormData();
        formData.append("image", image);
        await api.post(`/upload/add/categorie/${categoryId}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      }
      setCategories([...categories, response.data]);
      showToast('categorie add successfuly','success');
    } catch (error) {
      console.error(error);
    }
    closeAddModal();
  };

  const handleEditCategory = async () => {
    const imagePath = selectedCategory.imagePath;

    if (selectedCategory) {
      try {
        await api.put(`/categories/${selectedCategory._id}`, newCategory);
        if (image) {
          const formData = new FormData();
          formData.append("image", image);
          await api.post(
            `/upload/add/categorie/${selectedCategory._id}`,
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          );
          await api.delete(
            `/upload/delete-image/categorie/${selectedCategory._id}`,
            { imagePath }
          );
        }
        fetchParentCat();
        showToast('categorie updated successfuly','success');

      } catch (error) {
        console.error(error);
      }
      closeEditModal();
    }
  };

  const handleDeleteCategory = async () => {
    if (selectedCategory) {
      try {
        await api.delete(`/categories/${selectedCategory._id}`);
        setCategories(
          categories.filter((cat) => cat._id !== selectedCategory._id)
        );
      } catch (error) {
        console.error(error);
      }
      closeDeleteModal();
    }
  };

  const handleDisableCategory = async (categoryId, isDisable) => {
    try {
      await api.put(`/categories/disable/${categoryId}`, { isDisable });
      fetchParentCat();
      showToast(`categorie updated successfuly`,'success');

    } catch (error) {
      console.error(error);
    }
  };

  const fetchSubcategories = async (categoryId) => {
    try {
      const response = await api.get(`/categories/subcategories/${categoryId}`);
      setSubcategories((prevSubcategories) => ({
        ...prevSubcategories,
        [categoryId]: response.data,
      }));
    } catch (error) {
      console.error(error);
    }
  };

  const toggleExpandCategory = (categoryId) => {
    if (expandedCategoryId === categoryId) {
      setExpandedCategoryId(null);
    } else {
      setExpandedCategoryId(categoryId);
      if (!subcategories[categoryId]) {
        fetchSubcategories(categoryId);
      }
    }
  };


  const filteredCategories = categories?.filter((category) =>
    category?.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner />
      </div>
    );

  return (
    <div className="relative">
      <div className="p-4 sm:ml-64">
        <h1 className="border border-blue-700 text-blue-600 dark:bg-green-500 font-medium rounded-lg text-lg px-5 py-5 text-center mb-5">
          Category Management
        </h1>
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={openAddModal}
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
            Add Category
          </button>
          <input
          type="text"
          placeholder="Search products..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="border border-gray-300 rounded-lg px-4 py-2 w-full max-w-xs ml-4 "
        />
        </div>


        <div className="overflow-x-auto bg-white dark:bg-gray-800 shadow-md rounded-lg">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th
                  className="py-3 px-6 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                  style={{ width: "33.33%" }}
                >
                  Name
                </th>
                <th
                  className="py-3 px-6 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                  style={{ width: "33.33%" }}
                >
                  Status
                </th>
                <th
                  className="py-3 px-6 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                  style={{ width: "33.33%" }}
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
              {filteredCategories.map((category) => (
                <React.Fragment key={category._id}>
                  <tr className="hover:bg-gray-100">
                    <td className="py-4 px-6 flex items-center">
                      <img
                        src={category.imagePath}
                        alt={category.name}
                        className="w-12 h-12 mr-4 rounded"
                      />
                      {category.name}
                    </td>
                    <td className="py-4 px-6">
                      <button
                        onClick={() =>
                          handleDisableCategory(
                            category._id,
                            !category.isDisabled
                          )
                        }
                        className={`px-4 py-2 rounded ${
                          category.isDisabled ? "bg-red-500 " : "bg-green-500"
                        } text-white`}
                      >
                        {category.isDisabled ? "Disable" : "Enable"}
                      </button>
                    </td>
                    <td className="py-4 px-6">
                      <button
                        onClick={() => openEditModal(category)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <MdEdit className="inline mr-2" />
                        Edit
                      </button>
                      <button
                        onClick={() => openDeleteModal(category)}
                        className="text-red-600 hover:text-red-900 ml-4"
                      >
                        <MdDelete className="inline mr-2" />
                        Delete
                      </button>
                      <button
                        onClick={() => toggleExpandCategory(category._id)}
                        className="text-gray-600 hover:text-gray-800 ml-2"
                      >
                        {expandedCategoryId === category._id ? (
                          <MdExpandLess size={20} />
                        ) : (
                          <MdExpandMore size={20} />
                        )}
                      </button>
                    </td>
                  </tr>
                  {expandedCategoryId === category._id &&
                    subcategories[category._id] && (
                      <tr>
                        <td
                          colSpan="3"
                          className="bg-gray-100 dark:bg-gray-700"
                        >
                          <table
                            className="min-w-full divide-y divide-gray-200 dark:divide-gray-700"
                            style={{ tableLayout: "fixed" }} // Ensure equal column width
                          >
                            <thead className="bg-blue-100 dark:bg-gray-700 ">
                              <tr>
                                <th
                                  className="py-3 px-6 text-left text-xs font-medium text-blue-500 dark:text-gray-400 uppercase tracking-wider"
                                  style={{ width: "33.33%" }}
                                >
                                  Subcategory Name
                                </th>
                                <th
                                  className="py-3 px-6 text-left text-xs font-medium text-blue-500 dark:text-gray-400 uppercase tracking-wider"
                                  style={{ width: "33.33%" }}
                                >
                                  Status
                                </th>
                                <th
                                  className="py-3 px-6 text-left text-xs font-medium text-blue-500 dark:text-gray-400 uppercase tracking-wider"
                                  style={{ width: "33.33%" }}
                                >
                                  Actions
                                </th>
                              </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                              {subcategories[category._id].map((sub) => (
                                <tr key={sub._id}>
                                  <td className="py-4 px-6 flex items-center">
                                    <img
                                      src={sub.imagePath}
                                      alt={sub.name}
                                      className="w-12 h-12 mr-4 rounded"
                                    />
                                    {sub.name}
                                  </td>
                                  <td className="py-4 px-6">
                                    <button
                                      onClick={() =>
                                        handleDisableCategory(
                                          sub._id,
                                          !sub.isDisable
                                        )
                                      }
                                      className={`px-4 py-2 rounded ${
                                        sub.isDisable
                                          ? "bg-red-500 "
                                          : "bg-green-500"
                                      } text-white`}
                                    >
                                      {sub.isDisable ? "Disable" : "Enable"}
                                    </button>
                                  </td>
                                  <td className="py-4 px-6">
                                    <button
                                      onClick={() => openEditModal(sub)}
                                      className="text-blue-600 hover:text-blue-900"
                                    >
                                      <MdEdit className="inline mr-2" />
                                      Edit
                                    </button>
                                    <button
                                      onClick={() => openDeleteModal(sub)}
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
                        </td>
                      </tr>
                    )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>

        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto bg-gray-800 bg-opacity-50">
            <div className="relative w-[120%] left-16 max-w-5xl max-h-[80vh] bg-white rounded-lg shadow-lg md:p-5 overflow-y-auto">
              {/* Modal content */}
              <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
                {/* Modal header */}
                <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Add Category
                  </h3>
                  <button
                    type="button"
                    onClick={closeAddModal}
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
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleAddCategory();
                  }}
                  className="p-4 md:p-5"
                >
                  <div className="grid gap-4 mb-4 grid-cols-2">
                    <div className="col-span-2">
                      <label
                        htmlFor="name"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                      >
                        Name
                      </label>
                      <input
                        id="name"
                        type="text"
                        value={newCategory.name}
                        onChange={(e) =>
                          setNewCategory({
                            ...newCategory,
                            name: e.target.value,
                          })
                        }
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                        required
                      />
                    </div>
                    <div className="col-span-2">
                      <label
                        htmlFor="parent"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                      >
                        Parent Category
                      </label>
                      <select
                        id="parent"
                        value={newCategory.parent}
                        onChange={(e) =>
                          setNewCategory({
                            ...newCategory,
                            parent: e.target.value,
                          })
                        }
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                      >
                        <option value="">None</option>
                        {categories.map((parentCat) => (
                          <option key={parentCat._id} value={parentCat._id}>
                            {parentCat.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="col-span-2">
                      <label
                        htmlFor="image"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                      >
                        Upload Image
                      </label>
                      <input
                        id="image"
                        type="file"
                        onChange={(e) => setImage(e.target.files[0])}
                        class="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={closeAddModal}
                      className="px-4 py-2 bg-gray-500 text-white rounded-md mr-2"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-green-500 text-white rounded-md"
                    >
                      Add Category
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Edit Category Modal */}
        {showEditModal && selectedCategory && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity">
            <div className="fixed inset-0 flex items-center justify-center p-4">
              <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
                <h2 className="text-xl font-semibold mb-4">Edit Category</h2>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleEditCategory();
                  }}
                >
                  <div className="mb-4">
                    <label htmlFor="name" className="block text-gray-700">
                      Name
                    </label>
                    <input
                      id="name"
                      type="text"
                      value={newCategory.name}
                      onChange={(e) =>
                        setNewCategory({ ...newCategory, name: e.target.value })
                      }
                      className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label htmlFor="parent" className="block text-gray-700">
                      Parent Category
                    </label>
                    <select
                      id="parent"
                      value={newCategory.parent}
                      onChange={(e) =>
                        setNewCategory({
                          ...newCategory,
                          parent: e.target.value,
                        })
                      }
                      className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                    >
                      <option value="">None</option>
                      {categories.map((parentCat) => (
                        <option key={parentCat._id} value={parentCat._id}>
                          {parentCat.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="mb-4">
                    <label htmlFor="image" className="block text-gray-700">
                      Upload Image
                    </label>
                    <input
                      id="image"
                      type="file"
                      onChange={(e) => setImage(e.target.files[0])}
                      class="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                    />
                  </div>
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={closeEditModal}
                      className="px-4 py-2 bg-gray-500 text-white rounded-md mr-2"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-500 text-white rounded-md"
                    >
                      Save Changes
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Delete Category Modal */}
        {showDeleteModal && selectedCategory && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity">
            <div className="fixed inset-0 flex items-center justify-center p-4">
              <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
                <h2 className="text-xl font-semibold mb-4">Delete Category</h2>
                <p>
                  Are you sure you want to delete the category "
                  {selectedCategory.name}"?
                </p>
                <div className="flex justify-end mt-4">
                  <button
                    type="button"
                    onClick={closeDeleteModal}
                    className="px-4 py-2 bg-gray-500 text-white rounded-md mr-2"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleDeleteCategory}
                    className="px-4 py-2 bg-red-500 text-white rounded-md"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryPage;
