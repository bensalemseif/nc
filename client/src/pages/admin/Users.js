import React, { useState, useEffect } from "react";
import { MdDelete } from "react-icons/md";
import { TiDocumentText } from "react-icons/ti";
import Pagination from "../../components/Pagination";
import { toast } from "react-toastify";
import api from "../../config/axiosConfig";
import Spinner from "../../components/Spinner";


const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [currentPage, setCurrentPage] = useState(1); // Current page
  const [totalPages, setTotalPages] = useState(1); // Total pages for pagination

  // Fetch users with sorting and pagination
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.get(`/users?page=${currentPage}`);
        setUsers(response.data.users); // Adjust according to API response structure
        setTotalPages(response.data.totalPages); // Adjust according to API response structure
        setLoading(false);
      } catch (error) {
        toast.error("Failed to fetch users. Please check your credentials.");
        setLoading(false);
      }
    };

    fetchUsers();
  }, [currentPage]);

  const openDetailsModal = (user) => {
    setSelectedUser(user);
    setShowDetailsModal(true);
  };

  const closeDetailsModal = () => {
    setSelectedUser(null);
    setShowDetailsModal(false);
  };

  const openDeleteModal = (user) => {
    setSelectedUser(user);
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setSelectedUser(null);
    setShowDeleteModal(false);
  };

  const handleDeleteUser = async () => {
    if (selectedUser) {
      try {
        await api.delete(`/users/${selectedUser._id}`);
        setUsers(users.filter((user) => user._id !== selectedUser._id));
        toast.success("User deleted successfully");
      } catch (error) {
        toast.error("Error deleting user");
      }
      setSelectedUser(null);
      setShowDeleteModal(false);
    }
  };

  if (loading)   return (
    <div className="flex justify-center items-center min-h-screen">
      <Spinner />
    </div>
  );

  return (
    <div className="relative">
      <div className="p-4 sm:ml-64">
        <h1 className="border border-blue-700 text-blue-600 dark:bg-green-500 font-medium rounded-lg text-lg px-5 py-5 text-center mb-5">
          User Management
        </h1>

        <div className="overflow-x-auto bg-white dark:bg-gray-800 shadow-md rounded-lg">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Name & Picture
                </th>
                <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Email
                </th>
                <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Phone Number
                </th>
                <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Address
                </th>
                <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200 dark:divide-gray-700 dark:bg-gray-800">
              {users.map((user) => (
                <tr
                  key={user._id}
                  className="hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <td className="py-4 px-6 flex items-center space-x-4">
                    <img
                      src={`${user.profile.imagePath}`}
                      className="w-12 h-12 rounded-full object-cover"
                      alt={`${user.profile.firstName}'s profile`}
                    />
                    <span className="font-medium text-gray-900 dark:text-gray-100">
                      {user.profile.firstName} {user.profile.lastName}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-gray-500 dark:text-gray-400">
                    {user.email}
                  </td>
                  <td className="py-4 px-6 text-gray-500 dark:text-gray-400">
                    {user.phoneNumber}
                  </td>
                  <td className="py-4 px-6 text-gray-500 dark:text-gray-400">
                    {`${user.address.streetAddress}, ${user.address.City}`}
                  </td>
                  <td className="py-4 px-6 flex space-x-2">
                    <button
                      onClick={() => openDetailsModal(user)}
                      className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 focus:outline-none"
                      aria-label="View Details"
                    >
                      <TiDocumentText />
                    </button>
                    <button
                      onClick={() => openDeleteModal(user)}
                      className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 focus:outline-none"
                      aria-label="Delete User"
                    >
                      <MdDelete />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(page) => setCurrentPage(page)}
          className="mt-4"
        />
      </div>


      {/* Details Modal */}
      {showDetailsModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-30">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full relative">
            <div className="absolute top-2 right-2">
              <button
                onClick={closeDetailsModal}
                className="text-gray-500 hover:text-gray-700 focus:outline-none"
                aria-label="Close Modal"
              >
                &times;
              </button>
            </div>
            <div className="flex justify-center mb-4">
              <img
                src={`${selectedUser.profile.imagePath}`}
                alt="Profile"
                className="w-24 h-24 rounded-full object-cover"
              />
            </div>
            <div className="text-center">
              <h2 className="text-2xl font-semibold mb-2">{`${selectedUser.profile.firstName} ${selectedUser.profile.lastName}`}</h2>
              <p className="text-gray-700 dark:text-gray-400 mb-1">
                Username: {selectedUser.userName}
              </p>
              <p className="text-gray-700 dark:text-gray-400 mb-1">
                Email: {selectedUser.email}
              </p>
              <p className="text-gray-700 dark:text-gray-400 mb-1">
                Phone Number: {selectedUser.phoneNumber}
              </p>
              <div className="mt-4">
                <h3 className="text-xl font-semibold">Address</h3>
                <p className="text-gray-700 dark:text-gray-400 mb-1">
                  Street: {selectedUser.address.streetAddress}
                </p>
                <p className="text-gray-700 dark:text-gray-400">
                  City: {selectedUser.address.City}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-30">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full relative">
            <div className="absolute top-2 right-2">
              <button
                onClick={closeDeleteModal}
                className="text-gray-500 hover:text-gray-700 focus:outline-none"
                aria-label="Close Modal"
              >
                &times;
              </button>
            </div>
            <h2 className="text-xl font-semibold mb-4">Confirm Deletion</h2>
            <p className="text-gray-700 dark:text-gray-400 mb-4">
              Are you sure you want to delete {selectedUser.profile.firstName}{" "}
              {selectedUser.profile.lastName}?
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={handleDeleteUser}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 focus:outline-none"
              >
                Delete
              </button>
              <button
                onClick={closeDeleteModal}
                className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 focus:outline-none"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;
