import React, { useState, useEffect, useRef } from "react";
import { MdEdit, MdDelete } from "react-icons/md";
import { TbListDetails } from "react-icons/tb";
import { FaCalendarAlt, FaHourglassHalf, FaTruck, FaBan } from "react-icons/fa";
import Pagination from "../../components/Pagination.js";
import { FiPrinter } from "react-icons/fi";
import { IoCheckmarkDoneCircleSharp } from "react-icons/io5";
import ReactToPrint from "react-to-print";
import OrderDetailsToPrint from "../../components/OrderDetailsToPrint.js"; // Import the print component
import api from "../../config/axiosConfig.js";
import { showToast } from "../../utils/toastNotifications.js";
export default function Order() {
  const [page, setPage] = useState(1); // Current page
  const [totalPages, setTotalPages] = useState(0);

  const printRef = useRef();

  const [orders, setOrders] = useState([]);
  const [ordersDeleted, setOrdersDeleted] = useState([]);
  const [statOrder, setStatOrder] = useState({
    Shipped: 0,
    ordersAwaiting: 0,
    processed: 0,
    Cancelled: 0,
    Delivered: 0,
  });
  const [loading, setLoading] = useState(true); // State to manage loading state

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get("/admin/order-stats-by-status");
        setStatOrder({
          Shipped: response.data.statusCounts?.Shipped || "0",
          ordersAwaiting: response.data.statusCounts?.ordersAwaiting || "0",
          processed: response.data.statusCounts?.Processing || "0",
          Cancelled: response.data.statusCounts?.Cancelled || "0",
          Delivered: response.data.statusCounts?.Delivered || "0",
        });
      } catch (error) {}
    };
    fetchStats();
  }, []);
  useEffect(() => {
    // Fetch orders from the API with sorting and pagination
    const fetchOrders = async () => {
      try {
        const response = await api.get(`/orders?page=${page}}`);
        const ordersData = response.data.orders.map((order) => ({
          id: order?._id ?? "Unknown ID",
          createdAt: order?.createdAt
            ? new Date(order.createdAt).toLocaleDateString()
            : "Unknown Date", // Format date as 'DD/MM/YYYY'
          totalPrice: order?.total?.toFixed(2) ?? 0, // Format total price
          user: `${order?.user?.profile?.firstName ?? "Unknown"} ${
            order?.user?.profile?.lastName ?? "Unknown"
          }`,
          userEmail: order?.user?.email ?? "Unknown Email",
          userPhone: order?.user?.phoneNumber ?? "Unknown Phone",
          userAddress: `${
            order?.user?.address?.streetAddress ?? "Unknown Address"
          }, ${order?.user?.address?.City ?? "Unknown City"}, ${
            order?.user?.address?.Region ?? "Unknown Region"
          }, ${order?.user?.address?.postalCode ?? "Unknown Postal Code"}`,
          products:
            order?.products?.map((p) => ({
              productName: p?.product?.productName ?? "Unknown Product",
              quantity: p?.quantity ?? 0,
              productPrice: p?.productPrice?.toFixed(2) ?? 0,
              gifts:p?.gifts
            })) ?? [],
          status: order?.status ?? "Unknown Status",
        }));
        setTotalPages(response.data.totalPages);
        setOrders(ordersData);
        setLoading(false); // Set loading to false after data is fetched
      } catch (error) {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [page]); // Depend on page and limit

  // Handle page change (you can add buttons or other controls to change page)
  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  // State for showing modals
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showFacture, setShowFacture] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [newStatus, setNewStatus] = useState(""); // State to hold the new status

  // Functions to handle modals
  const openFactureModal = (order) => {
    setSelectedOrder(order);

    setShowFacture(true);
  };
  const closeFactureModal = () => {
    setSelectedOrder(null);
    setShowFacture(false);
  };

  const openDetailsModal = (order) => {
    setSelectedOrder(order);
    setShowDetailsModal(true);
  };

  const closeDetailsModal = () => {
    setSelectedOrder(null);
    setShowDetailsModal(false);
  };

  const openUpdateModal = (order) => {
    setSelectedOrder(order);
    setNewStatus(order.status); // Set the new status to the current status
    setShowUpdateModal(true);
  };

  const closeUpdateModal = () => {
    setSelectedOrder(null);
    setShowUpdateModal(false);
  };

  const openDeleteModal = (order) => {
    setSelectedOrder(order);
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setSelectedOrder(null);
    setShowDeleteModal(false);
  };

  const handleDelete = async () => {
    try {
      const response = await api.delete(`/orders/${selectedOrder.id}`);
      if (response.status === 200) {
        setOrders(orders.filter((order) => order.id !== selectedOrder.id));
        showToast("order deleted successfully!","success");
      } 
    } catch (error) {
      console.log(error);
    }
    closeDeleteModal();
  };

  // API call to update order status
  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      // Check if newStatus is a valid status
      const validStatuses = [
        "ordersAwaiting",
        "Processing",
        "Shipped",
        "Delivered",
        "Cancelled",
      ];
      if (!validStatuses.includes(newStatus)) {
        return;
      }
      const response = await api.put(
        `/orders/${orderId}`,

        { status: newStatus }
      );

      if (response.status === 200) {
        setOrders(
          orders.map((order) =>
            order.id === orderId ? { ...order, status: newStatus } : order
          )
        );
        showToast("Order status updated successfully.","success");

      } else {
        console.log("error")
        }
    } catch (error) {
      console.log(error)
    }
  };

  // Handle save changes button click
  const handleSaveChanges = () => {
    if (selectedOrder) {
      updateOrderStatus(selectedOrder.id, newStatus);
      closeUpdateModal();
    }
  };
  return (
    <div>
      <div className="p-4 sm:ml-64">
        <h1
          class=" border border-blue-700 text-blue-600 
       dark:bg-green-500 font-medium rounded-lg text-lg px-5  py-5 text-center mb-5"
        >
          Order Management
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 mb-4">
          <div className="flex items-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md dark:shadow-gray-700 border border-blue-600 hover:bg-blue-50 dark:hover:bg-blue-700 hover:border-blue-700 transition-all duration-300">
            <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white">
              <FaTruck className="text-xl" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                {" "}
                in shippeing
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {statOrder.Shipped}
              </p>
            </div>
          </div>
          <div className="flex items-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md dark:shadow-gray-700 border border-blue-600 hover:bg-yellow-50 dark:hover:bg-yellow-700 hover:border-yellow-700 transition-all duration-300">
            <div className="w-12 h-12 bg-yellow-300 rounded-full flex items-center justify-center text-white">
              <FaHourglassHalf className="text-xl" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Orders Awaiting
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {statOrder.ordersAwaiting}
              </p>
            </div>
          </div>
          <div className="flex items-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md dark:shadow-gray-700 border border-blue-600 hover:bg-green-50 dark:hover:bg-green-700 hover:border-green-700 transition-all duration-300">
            <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white">
              <FaCalendarAlt className="text-xl" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Processed
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {statOrder.processed}
              </p>
            </div>
          </div>
          <div className="flex items-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md dark:shadow-gray-700 border border-blue-600 hover:bg-red-50 dark:hover:bg-red-700 hover:border-red-700 transition-all duration-300">
            <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center text-white">
              <FaBan className="text-xl" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Canceled
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {statOrder.Cancelled}
              </p>
            </div>
          </div>
          <div className="flex items-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md dark:shadow-gray-700 border border-blue-600 hover:bg-gray-100 dark:hover:bg-gray-700 hover:border-gray-700 transition-all duration-300">
            <div className="w-12 h-12 bg-orange-300 rounded-full flex items-center justify-center text-white">
              <IoCheckmarkDoneCircleSharp className="text-2xl" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Delivered
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {statOrder.Delivered}
              </p>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto bg-white dark:bg-gray-800 shadow-md rounded-lg">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Date
                </th>
                <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Total Price
                </th>
                <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  User
                </th>
                <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200 dark:divide-gray-700 dark:bg-gray-800">
              {loading ? (
                <tr>
                  <td
                    colSpan="5"
                    className="text-center py-4 text-gray-500 dark:text-gray-400"
                  >
                    Loading...
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr
                    key={order?.id}
                    className="hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <td className="py-4 px-6 text-gray-900 dark:text-gray-100">
                      {order?.createdAt}
                    </td>
                    <td className="py-4 px-6 text-gray-900 dark:text-gray-100">
                      {" "}
                      {order?.totalPrice} TND
                    </td>
                    <td className="p-5 whitespace-nowrap text-sm leading-6 font-medium text-gray-900">
                      <div
                        className={`py-1.5 px-4 rounded-full flex items-center justify-center w-20 gap-1 ${
                          order?.status === "Shipped"
                            ? "bg-blue-100 text-blue-600"
                            : order?.status === "ordersAwaiting"
                            ? "bg-yellow-100 text-yellow-600 w-30 h-30 px-6"
                            : order?.status === "Processing"
                            ? "bg-green-100 text-green-600 px-4"
                            : order?.status === "Cancelled"
                            ? "bg-red-100 text-red-600"
                            : order?.status === "Delivered"
                            ? "bg-orange-100 text-orange-600"
                            : "bg-white text-gray-600"
                        }`}
                      >
                        <svg
                          width="5"
                          height="6"
                          viewBox="0 0 5 6"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <circle
                            cx="2.5"
                            cy="3"
                            r="2.5"
                            fill={
                              order.status === "Shipped"
                                ? "#F59E0B"
                                : order.status === "Orders Awaiting"
                                ? "#F59E0B"
                                : order.status === "Processing"
                                ? "bg-green-100"
                                : order.status === "Cancelled"
                                ? "#EF4444"
                                : order.status === "Delivered"
                                ? "#6B7280"
                                : "#6B7280"
                            }
                          />
                        </svg>
                        <span className="font-medium text-xs">
                          {order?.status}
                        </span>
                      </div>
                    </td>

                    <td className="py-4 px-6 text-gray-900 dark:text-gray-100">
                      {order?.user}
                    </td>
                    <td className="py-4 px-6 flex space-x-2">
                      <button
                        onClick={() => openDetailsModal(order)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <TbListDetails className="inline mr-2" />
                        Details
                      </button>
                      <button
                        onClick={() => openUpdateModal(order)}
                        className="text-green-600 hover:text-blue-900"
                      >
                        <MdEdit className="inline mr-2" />
                        Edit
                      </button>
                      <button
                        onClick={() => {
                          openDeleteModal(order);
                          setOrdersDeleted(order._id);
                        }}
                        className="text-red-600 hover:text-red-900 ml-4"
                      >
                        <MdDelete className="inline mr-2" />
                        Delete
                      </button>
                      <button
                        onClick={() => {
                          openFactureModal(order);
                        }}
                        className="text-gray-600 hover:text-gray-900 ml-4"
                      >
                        <FiPrinter className="inline mr-2" />
                        Facture
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />

        {showFacture && (
          <div className="fixed inset-0 z-50 flex
           items-center justify-center overflow-x-hidden overflow-y-auto bg-gray-800 bg-opacity-50">
            {console.log(selectedOrder)}

            <div className="relative w-[550px] left-16 max-w-5xl max-h-[80vh] bg-white rounded-lg shadow-lg  md:p-5 overflow-y-auto">
              <OrderDetailsToPrint
                ref={printRef}
                selectedOrder={selectedOrder}
              />

              <div className="mt-4 flex gap-4">
                <ReactToPrint
                  trigger={() => (
                    <button className="px-4 py-2 bg-green-500 text-white rounded-lg">
                      Print as PDF
                    </button>
                  )}
                  content={() => printRef.current}
                  pageStyle="@media print { .order-details { width: 100%; } }"
                />
                <button
                  onClick={closeFactureModal}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
        {showDetailsModal && (
          <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
                Order Details
              </h2>
              {selectedOrder && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <p className="text-gray-700 font-medium">Order ID:</p>
                    <p className="text-gray-900">{selectedOrder?.id}</p>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-gray-700 font-medium">Date:</p>
                    <p className="text-gray-900">{selectedOrder?.createdAt}</p>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-gray-700 font-medium">Total Price:</p>
                    <p className="text-gray-900">{selectedOrder?.totalPrice}</p>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-gray-700 font-medium">User:</p>
                    <p className="text-gray-900">{selectedOrder?.user}</p>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-gray-700 font-medium">Email:</p>
                    <p className="text-gray-900">{selectedOrder?.userEmail}</p>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-gray-700 font-medium">Phone:</p>
                    <p className="text-gray-900">{selectedOrder?.userPhone}</p>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-gray-700 font-medium">Address:</p>
                    <p className="text-gray-900">
                      {selectedOrder?.userAddress}
                    </p>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-gray-700 font-medium">Status:</p>
                    <p className="text-gray-900">{selectedOrder?.status}</p>
                  </div>

                  <div className="mt-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                      Products:
                    </h3>
                    <ul className="space-y-2">
                      {selectedOrder?.products?.map((product, index) => (
                        <li
                          key={index}
                          className="bg-gray-50 p-3 rounded-lg shadow-sm"
                        >
                          <p className="text-gray-700">
                            <strong>Product Name:</strong>{" "}
                            {product?.productName}
                          </p>
                          <p className="text-gray-700">
                            <strong>Quantity:</strong> {product?.quantity}
                          </p>
                          <p className="text-gray-700">
                            <strong>Price:</strong> {product?.productPrice} TND
                          </p>
                          {console.log(product.gifts)}

                          {product?.gifts?.map((Cadeau,giftIndex)=>(
                                <li
                                key={giftIndex}
                                className="bg-gray-50 p-3 rounded-lg shadow-sm"
                              >
     <h3 className="text-lg font-semibold text-gray-800 mb-2">
                      Gifts:
                    </h3>                                <div className=" ">
                                <p className="text-gray-700">
                            <strong>GiftName:</strong> {Cadeau?.gift?.giftName} 
                          </p>
                          <p className="text-gray-700">
                            <strong>giftPoints:</strong> {Cadeau?.pointValue}
                          </p>

                                </div>

                                </li>
                          ))}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              <div className="mt-6 flex justify-end">
                <button
                  onClick={closeDetailsModal}
                  className="py-2 px-4 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition duration-200 ease-in-out"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {showUpdateModal && (
          <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full max-h-screen overflow-y-auto">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
                Update Order Status
              </h2>
              {selectedOrder && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <p className="text-gray-700">
                      <strong>Order ID:</strong>
                    </p>
                    <p className="text-gray-900">{selectedOrder?.id}</p>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-gray-700">
                      <strong>Current Status:</strong>
                    </p>
                    <p className="text-gray-900">{selectedOrder?.status}</p>
                  </div>

                  <div className="mb-6">
                    <label
                      htmlFor="status"
                      className="block text-gray-700 font-medium"
                    >
                      New Status:
                    </label>
                    <select
                      id="status"
                      value={newStatus}
                      onChange={(e) => setNewStatus(e.target.value)}
                      className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:ring focus:ring-blue-300 transition duration-200 ease-in-out"
                    >
                      <option value="ordersAwaiting">Orders Awaiting</option>
                      <option value="Processing">Processing</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </div>

                  <div className="flex justify-between items-center space-x-4">
                    <button
                      onClick={handleSaveChanges}
                      className="w-full py-3 bg-green-500 hover:bg-green-600 text-white font-medium rounded-lg transition duration-200 ease-in-out"
                    >
                      Save Changes
                    </button>
                    <button
                      onClick={closeUpdateModal}
                      className="w-full py-3 bg-gray-500 hover:bg-gray-600 text-white font-medium rounded-lg transition duration-200 ease-in-out"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Delete Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
            <div className="bg-white rounded-lg shadow-lg p-6 max-w-lg w-full">
              <h2 className="text-2xl font-semibold mb-4">Delete Order</h2>
              {selectedOrder && (
                <div>
                  <p>Are you sure you want to delete this order?</p>
                  <p>
                    <strong>Order ID:</strong> {selectedOrder.id}
                  </p>
                  <button
                    onClick={handleDelete}
                    className="mr-2 px-4 py-2 bg-red-500 text-white rounded-lg"
                  >
                    Delete
                  </button>
                  <button
                    onClick={closeDeleteModal}
                    className="px-4 py-2 bg-gray-500 text-white rounded-lg"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
