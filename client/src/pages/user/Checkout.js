import React, { useState, useEffect, useContext } from "react";
import { getCart } from "../../services/cartService"; // Adjust path if needed
import { createOrder } from "../../services/orderService"; // Import the service to create an order
import AuthContext from "../../contexts/AuthContext";
import { showToast } from "../../utils/toastNotifications";
import Spinner from "../../components/Spinner";
import { useNavigate } from "react-router-dom";

function Checkout() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);
  const [shippingInfo, setShippingInfo] = useState({
    email: "",
    phone: "",
    address: "",
    city: "",
    region: "",
    postalCode: "",
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate(); // Hook for navigation

  useEffect(() => {
    const fetchCartAndUser = async () => {
      try {
        const cart = await getCart();
        setItems(cart.items);
        setShippingInfo({
          email: user?.email || "",
          phone: user?.phoneNumber || "",
          address: user?.address?.streetAddress || "",
          city: user?.address?.City || "",
          region: user?.address?.Region || "",
          postalCode: user?.address?.postalCode || "",
        });
        setLoading(false);
      } catch (error) {
        setLoading(false);
        showToast("Failed to load cart. Please try again later.", "error");
      }
    };
    fetchCartAndUser();
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShippingInfo((prevState) => ({
      ...prevState,
      [name]: value,
    }));
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "", // Clear error when user starts typing
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!shippingInfo.email) newErrors.email = "Email is required.";
    if (!shippingInfo.phone) newErrors.phone = "Phone number is required.";
    if (!shippingInfo.address) newErrors.address = "Street address is required.";
    if (!shippingInfo.city) newErrors.city = "City is required.";
    if (!shippingInfo.region) newErrors.region = "Region is required.";
    if (!shippingInfo.postalCode) newErrors.postalCode = "Postal code is required.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Return true if no errors
  };

  const handleCheckout = async () => {
    if (!validateForm()) {
      showToast("Please fill all required fields.", "warning");
      return;
    }

    try {
      await createOrder(shippingInfo).then();
      navigate("/");
    } catch (error) {
      showToast("Failed to place order. Please try again later.", "error");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner />
      </div>
    );
  }

  const totalAmount = items.reduce(
    (sum, item) => sum + item.productId.finalPrice * item.quantity,
    0
  );

  return (
    <div className="h-screen max-h-screen">
      <section className="relative z-10 bg-gray-50 py-10">
        <div className="container mx-auto px-4 md:px-8">
          <div className="bg-white shadow-lg rounded-lg overflow-hidden">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Checkout</h2>

                <form className="lg:mt-16" onSubmit={(e) => e.preventDefault()}>
                  <div>
                    <h2 className="text-xl font-bold text-gray-800">Shipping info</h2>
                    <div className="grid sm:grid-cols-2 gap-8 mt-8">
                      <div>
                        <input
                          type="email"
                          placeholder="Email address"
                          name="email"
                          value={shippingInfo.email}
                          onChange={handleInputChange}
                          className={`px-2 pb-2 bg-white text-gray-800 w-full text-sm border-b focus:border-blue-600 outline-none rounded-lg ${
                            errors.email ? "border-red-600" : ""
                          }`}
                          required
                        />
                        {errors.email && <p className="text-red-600">{errors.email}</p>}
                      </div>
                      <div>
                        <input
                          type="tel"
                          placeholder="Phone number"
                          name="phone"
                          value={shippingInfo.phone}
                          onChange={handleInputChange}
                          className={`px-2 pb-2 bg-white text-gray-800 w-full text-sm border-b focus:border-blue-600 outline-none rounded-lg ${
                            errors.phone ? "border-red-600" : ""
                          }`}
                          required
                        />
                        {errors.phone && <p className="text-red-600">{errors.phone}</p>}
                      </div>
                      <div>
                        <input
                          type="text"
                          placeholder="Street address"
                          name="address"
                          value={shippingInfo.address}
                          onChange={handleInputChange}
                          className={`px-2 pb-2 bg-white text-gray-800 w-full text-sm border-b focus:border-blue-600 outline-none rounded-lg ${
                            errors.address ? "border-red-600" : ""
                          }`}
                          required
                        />
                        {errors.address && <p className="text-red-600">{errors.address}</p>}
                      </div>
                      <div>
                        <input
                          type="text"
                          placeholder="City"
                          name="city"
                          value={shippingInfo.city}
                          onChange={handleInputChange}
                          className={`px-2 pb-2 bg-white text-gray-800 w-full text-sm border-b focus:border-blue-600 outline-none rounded-lg ${
                            errors.city ? "border-red-600" : ""
                          }`}
                          required
                        />
                        {errors.city && <p className="text-red-600">{errors.city}</p>}
                      </div>
                      <div>
                        <input
                          type="text"
                          placeholder="Region"
                          name="region"
                          value={shippingInfo.region}
                          onChange={handleInputChange}
                          className={`px-2 pb-2 bg-white text-gray-800 w-full text-sm border-b focus:border-blue-600 outline-none rounded-lg ${
                            errors.region ? "border-red-600" : ""
                          }`}
                          required
                        />
                        {errors.region && <p className="text-red-600">{errors.region}</p>}
                      </div>
                      <div>
                        <input
                          type="number"
                          placeholder="Postal code"
                          name="postalCode"
                          value={shippingInfo.postalCode}
                          onChange={handleInputChange}
                          className={`px-2 pb-2 bg-white text-gray-800 w-full text-sm border-b focus:border-blue-600 outline-none rounded-lg ${
                            errors.postalCode ? "border-red-600" : ""
                          }`}
                          required
                        />
                        {errors.postalCode && <p className="text-red-600">{errors.postalCode}</p>}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-4 mt-8">
                    <button
                      type="button"
                      className="min-w-[150px] px-6 py-3.5 text-sm bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
                      onClick={() => navigate(-1)}
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      className="min-w-[150px] px-6 py-3.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                      onClick={handleCheckout}
                    >
                      Confirm payment {totalAmount.toFixed(2)} TND
                    </button>
                  </div>
                </form>
              </div>

              <div className="bg-gray-100 p-6 rounded-r-lg shadow-lg">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Order Summary</h3>
                <div className="space-y-4">
                  {items.map((item) => (
                    <div
                      key={item._id}
                      className="flex items-center gap-4 border rounded-lg p-4 shadow-sm bg-white"
                    >
                      <div className="w-24 h-24 bg-gray-200 rounded-lg overflow-hidden">
                        <img
                          src={`${item.productId.imagePath[0]}`}
                          className="w-full h-full object-cover"
                          alt={item.productId.productName}
                        />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-gray-800 font-medium">{item.productId.productName}</h4>
                        <p className="text-gray-500">Quantity: {item.quantity}</p>
                        <p className="text-blue-600 font-semibold">
                          {(item.productId.finalPrice * item.quantity).toFixed(2)} TND
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 text-lg font-semibold text-gray-800">
                  Total: {totalAmount.toFixed(2)} TND
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Checkout;
