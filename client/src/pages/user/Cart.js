import React, { useState, useEffect } from "react";
import {
  getCart,
  removeFromCart,
  updateCartQuantities,
} from "../../services/cartService"; // Adjust path if needed
import { useNavigate } from "react-router-dom";
import Spinner from "../../components/Spinner";
function Cart() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch cart items on component mount
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const cart = await getCart();
        setItems(cart.items);
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    };
    fetchCart();
  }, []);

  const totalItemsPrice = items.reduce(
    (acc, item) => acc + item.productId.finalPrice * item.quantity,
    0
  ); // Updated to use item.quantity
  const totalPrice = totalItemsPrice;

  const handleQuantityChange = async (id, amount) => {
    try {
      // Update quantity locally
      setItems(
        items.map((item) =>
          item._id === id ? { ...item, quantity: item.quantity + amount } : item
        )
      );
    } catch (error) {
    }
  };

  const handleRemoveItem = async (id) => {
    try {
      await removeFromCart(id);
      setItems(items.filter((item) => item.productId._id !== id)); // Updated to use item._id
    } catch (error) {
    }
  };

  const handleCheckout = async () => {
    try {
      // First, update the product quantities in the cart
      const products = items.map((item) => ({
        productId: item.productId._id,
        quantity: item.quantity,
      }));

      await updateCartQuantities({ products });
      navigate("/user/checkout");
    } catch (error) {
      // Optionally, handle error case
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner />
      </div>
    );
    }
  return (
    <div className="overflow-x-hidden">
      <section className="relative z-10 after:contents-[''] after:absolute after:z-0 after:h-full xl:after:w-1/3 after:top-0 after:right-0 after:bg-gray-50">
        <div className="w-full max-w-7xl px-4 md:px-5 lg-6 mx-auto relative z-10">
          <div className="grid grid-cols-12">
            <div className="col-span-12 xl:col-span-8 lg:pr-8 pt-14 pb-8 lg:py-24 w-full max-xl:max-w-3xl max-xl:mx-auto">
              <div className="flex items-center justify-between pb-8 border-b border-gray-300">
                <h2 className="font-manrope font-bold text-3xl leading-10 text-black">
                  Shopping Cart
                </h2>
                <h2 className="font-manrope font-bold text-xl leading-8 text-gray-600">
                  {items.length} Items
                </h2>
              </div>
              <div className="grid grid-cols-12 mt-8 max-md:hidden pb-6 border-b border-gray-200">
                <div className="col-span-12 md:col-span-7">
                  <p className="font-normal text-lg leading-8 text-gray-400">
                    Product Details
                  </p>
                </div>
                <div className="col-span-12 md:col-span-5">
                  <div className="grid grid-cols-5">
                    <div className="col-span-3">
                      <p className="font-normal text-lg leading-8 text-gray-400 text-center">
                        Quantity
                      </p>
                    </div>
                    <div className="col-span-2">
                      <p className="font-normal text-lg leading-8 text-gray-400 text-center">
                        Total
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              {items.map((item) => (
                <div
                  key={item._id}
                  className="flex flex-col min-[500px]:flex-row min-[500px]:items-center gap-5 py-6 border-b border-gray-200 group"
                >
                  <div className="w-full md:max-w-[126px]">
                    <img
                      src={`${item.productId.imagePath[0]}`}
                      alt={`${item.productId.productName} image`}
                      className="mx-auto"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-4 w-full">
                    <div className="md:col-span-2">
                      <div className="flex flex-col max-[500px]:items-center gap-3">
                        <h6 className="font-semibold text-base leading-7 text-black">
                          {item.productId.productName}
                        </h6>
                        <h6 className="font-normal text-base leading-7 text-gray-500">
                          {item.productId.category.name}
                        </h6>
                        <h6 className="font-medium text-base leading-7 text-gray-600 transition-all duration-300 group-hover:text-second">
                          {item?.productId.finalPrice.toFixed(2)} DT
                        </h6>
                      </div>
                    </div>
                    <div className="flex flex-col items-center max-[500px]:justify-center h-full max-md:mt-3">
                      <div className="flex items-center h-full">
                        <button
                          className="group rounded-l-xl px-5 py-[18px] border border-gray-200 flex items-center justify-center shadow-sm shadow-transparent transition-all duration-500 hover:bg-pink-50 hover:border-gray-300 hover:shadow-gray-300 focus-within:outline-gray-300"
                          onClick={() => handleQuantityChange(item._id, -1)}
                          disabled={item.quantity <= 1}
                        >
                          <svg
                            className="stroke-gray-900 transition-all duration-500 group-hover:stroke-black"
                            xmlns="http://www.w3.org/2000/svg"
                            width="22"
                            height="22"
                            viewBox="0 0 22 22"
                            fill="none"
                          >
                            <path
                              d="M16.5 11H5.5"
                              strokeWidth="1.6"
                              strokeLinecap="round"
                            />
                          </svg>
                        </button>
                        <input
                          type="text"
                          readOnly
                          value={item.quantity}
                          className="border-y border-gray-200 outline-none text-gray-900 font-semibold text-lg w-full h-[59px] max-w-[73px] min-w-[60px] text-center bg-transparent"
                        />
                        <button
                          className="group rounded-r-xl px-5 py-[18px] border border-gray-200 flex items-center justify-center shadow-sm shadow-transparent transition-all duration-500 hover:bg-pink-50 hover:border-gray-300 hover:shadow-gray-300 focus-within:outline-gray-300"
                          onClick={() => handleQuantityChange(item._id, 1)}
                        >
                          <svg
                            className="stroke-gray-900 transition-all duration-500 group-hover:stroke-black"
                            xmlns="http://www.w3.org/2000/svg"
                            width="22"
                            height="22"
                            viewBox="0 0 22 22"
                            fill="none"
                          >
                            <path
                              d="M11 5.5V16.5M16.5 11H5.5"
                              strokeWidth="1.6"
                              strokeLinecap="round"
                            />
                          </svg>
                        </button>
                      </div>
                      <button
                        className="text-red-500 hover:text-red-700 transition duration-200 mt-2"
                        onClick={() => handleRemoveItem(item.productId._id)}
                      >
                        Remove
                      </button>
                    </div>
                    <div className="flex items-center max-[500px]:justify-center md:justify-end max-md:mt-3 h-full">
                      <p className="font-bold text-lg leading-8 text-gray-600 text-center transition-all duration-300 group-hover:text-second">
                        {(item?.productId.finalPrice * item.quantity).toFixed(2)}{" "}
                        DT
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="col-span-12 xl:col-span-4 bg-gray-50 w-full max-xl:px-6 max-w-3xl xl:max-w-lg mx-auto lg:pl-8 py-24">
              <h2 className="font-manrope font-bold text-3xl leading-10 text-black pb-8 border-b border-gray-300">
                Order Summary
              </h2>
              <div className="mt-8">
                <div className="flex justify-between py-3 border-b border-gray-200">
                  <p className="font-medium text-base leading-7 text-gray-600">
                    Price
                  </p>
                  <p className="font-medium text-base leading-7 text-gray-600">
                    {totalItemsPrice.toFixed(2)} DT
                  </p>
                </div>
                <div className="flex justify-between py-3 border-b border-gray-200">
                  <p className="font-bold text-lg leading-8 text-gray-900">
                    Total Price
                  </p>
                  <p className="font-bold text-lg leading-8 text-gray-900">
                    {totalPrice.toFixed(2)} DT
                  </p>
                </div>
              </div>
              <div className="mt-8">
                <button
                  onClick={handleCheckout}
                  className="w-full bg-green-500 text-white px-4 py-2 rounded mt-4 hover:bg-green-600"
                >
                  Checkout
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Cart;
