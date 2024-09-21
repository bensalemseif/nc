import React, { useState, useEffect } from 'react';
import api from '../config/axiosConfig';

// Define the API endpoint

function OrderHistory() {
  const [isOpen, setIsOpen] = useState(false);
  const [orders, setOrders] = useState([]);
  const [statusFilter, setStatusFilter] = useState('All');
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  // Fetch orders from the API when the component mounts
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        // Replace with the actual user ID
        const response = await api.get(`/orders/user`);
        if (response?.data) {
          setOrders(response.data);
        }
      } catch (error) {
      }
    };

    fetchOrders();
  }, []);

  // Filter orders based on the selected status
  useEffect(() => {
    if (!Array.isArray(orders)) return; // Null check for orders

    let filtered = orders;

    if (statusFilter !== 'All') {
      filtered = filtered.filter(order => order?.status === statusFilter);
    }

    if (fromDate) {
      const from = new Date(fromDate);
      filtered = filtered.filter(order => new Date(order?.createdAt) >= from);
    }

    if (toDate) {
      const to = new Date(toDate);
      filtered = filtered.filter(order => new Date(order?.createdAt) <= to);
    }

    setFilteredOrders(filtered);
  }, [orders, statusFilter, fromDate, toDate]);

  const toggleDetails = (orderId) => {
    setIsOpen((prevOpen) => (prevOpen === orderId ? null : orderId));
  };

  return (
    <div className='overflow-x-hidden'>
      <section className="py-24 relative">
        <div className="w-full max-w-7xl mx-auto text-center">
          <h2 className="font-manrope font-extrabold text-3xl leading-10 text-black mb-9 text-centre">Order History</h2>
          
          <div className="flex flex-col sm:flex-row lg:flex-row items-center gap-2 justify-between overflow-x-auto">
            {/* List of items */}
            <ul className="flex flex-row sm:flex-col lg:flex-row sm:items-center gap-x-14 gap-y-3">
              {['All', 'Delivered', 'Shipping', 'Cancelled','Processing','Not processed'].map(
                status => (
                <li
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`font-medium text-lg leading-8 cursor-pointer transition-all duration-500 hover:text-indigo-600
                     ${statusFilter === status ? 'text-indigo-600' : 'text-black'}`}
                >
                  {status}
                </li>
              ))}
            </ul>

            {/* Date inputs */}
            <div className="flex flex-row items-center gap-2 mt-5 ml-2">
              <div className="flex rounded-full py-3 px-4 border border-gray-300 relative items-center gap-2">
                <svg className="relative" width="18" height="20" viewBox="0 0 18 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1.5 7.75H16.5M11.9213 11.875H11.928M11.9212 14.125H11.9279M9.14676 11.875H9.1535M9.14676 14.125H9.1535M6.37088 11.875H6.37762M6.37088 14.125H6.37762M5.25 4.75V1.75M12.75 4.75V1.75M7.5 18.25H10.5C13.3284 18.25 14.7426 18.25 15.6213 17.3713C16.5 16.4926 16.5 15.0784 16.5 12.25V9.25C16.5 6.42157 16.5 5.00736 15.6213 4.12868C14.7426 3.25 13.3284 3.25 10.5 3.25H7.5C4.67157 3.25 3.25736 3.25 2.37868 4.12868C1.5 5.00736 1.5 6.42157 1.5 9.25V12.25C1.5 15.0784 1.5 16.4926 2.37868 17.3713C3.25736 18.25 4.67157 18.25 7.5 18.25Z" stroke="#111827" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <input
                  type="date"
                  value={fromDate || ''}
                  onChange={(e) => setFromDate(e.target.value)}
                  className="font-semibold  text-sm text-gray-900 outline-0 flex flex-row-reverse cursor-pointer w-32
                   placeholder-gray-900 rounded-full"
                   style={{paddingLeft:'8rem'}}
                />
              </div>
              <p className="font-medium text-lg leading-8 text-black">To</p>
              <div className="flex rounded-full py-3 px-4 border border-gray-300 relative items-center gap-2">
                <svg className="relative" width="18" height="20" viewBox="0 0 18 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1.5 7.75H16.5M11.9213 11.875H11.928M11.9212 14.125H11.9279M9.14676 11.875H9.1535M9.14676 14.125H9.1535M6.37088 11.875H6.37762M6.37088 14.125H6.37762M5.25 4.75V1.75M12.75 4.75V1.75M7.5 18.25H10.5C13.3284 18.25 14.7426 18.25 15.6213 17.3713C16.5 16.4926 16.5 15.0784 16.5 12.25V9.25C16.5 6.42157 16.5 5.00736 15.6213 4.12868C14.7426 3.25 13.3284 3.25 10.5 3.25H7.5C4.67157 3.25 3.25736 3.25 2.37868 4.12868C1.5 5.00736 1.5 6.42157 1.5 9.25V12.25C1.5 15.0784 1.5 16.4926 2.37868 17.3713C3.25736 18.25 4.67157 18.25 7.5 18.25Z" stroke="#111827" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <input
                  type="date"
                  value={toDate || ''}
                  onChange={(e) => setToDate(e.target.value)}
                  style={{paddingLeft:'8rem'}}
                  className="font-semibold px-2 text-sm rounded-full text-gray-900 outline-0 flex flex-row-reverse cursor-pointer w-32 placeholder-gray-900"
                />
              </div>
            </div>
          </div>

          {/* Orders list */}
          {Array.isArray(filteredOrders) && filteredOrders.length > 0 ? (
            filteredOrders.map((order) => (
              <div key={order?._id} className="mt-7 border border-gray-300 rounded-lg shadow-lg p-6 bg-white">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between px-4 md:px-6">
                  <div className="data">
                    <p className="font-bold text-xl text-gray-800 mb-1">Order ID: #{order?._id}</p>
                    <p className="text-gray-600 mb-2">Order Date: {order?.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A'}</p>
                  </div>
                  <div className="flex flex-col items-start md:items-center">
                    <p className="text-gray-500 mb-1">Status</p>
                    <p className={`font-semibold text-lg ${order?.status === 'Delivered' ? 'text-green-600' : 'text-gray-600'}`}>
                      {order?.status || 'Unknown'}
                    </p>
                    <button 
                      onClick={() => toggleDetails(order?._id)} 
                      className="text-indigo-500 mt-3 hover:text-indigo-700 font-medium"
                    >
                      {isOpen === order?._id ? 'Hide Details' : 'View Details'}
                    </button>
                  </div>
                </div>

                {/* Order details */}
                {isOpen === order?._id && (
                  <div className="mt-4">
                    <h3 className="font-semibold text-lg mb-2">Order Details:</h3>
                    {order?.products?.map((product, index) => (
                      <div key={index} className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-4">
                          <img
                            src={product.product?.imagePath[0]}
                            alt={product.product?.productName}
                            className="w-16 h-16 object-cover rounded-md"
                          />
                          <div>
                            <p className="font-medium text-gray-900">{product.product?.productName}</p>
                            <p className="text-gray-600">Quantity: {product.quantity}</p>
                            <p className="text-gray-600">Price: { product.productPrice} TND</p>
                          </div>
                        </div>
                        <div className="text-gray-900 font-medium">
                          Total: {(product.quantity * (product.productPrice)).toFixed(2)} TND
                        </div>
                      </div>
                    ))}
                    <hr className="my-4" />
                    <div className="text-right">
                      <p className="font-semibold text-lg">Order Total: {order?.total?.toFixed(2)} TND</p>
                    </div>
                  </div>
                )}
              </div>
            ))
          ) : (
            <p className="text-gray-600 mt-4">No orders found.</p>
          )}
        </div>
      </section>
    </div>
  );
}

export default OrderHistory;
