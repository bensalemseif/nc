import React, { useState, useEffect, useContext } from "react";
import OrderHistory from "../../components/OrderHistory";
import UpdatePassword from "../../components/UpdatePassword";
import api from "../../config/axiosConfig";
import AuthContext from "../../contexts/AuthContext"; // Import AuthContext
import Cookies from "js-cookie";
import { showToast } from "../../utils/toastNotifications";
import Spinner from "../../components/Spinner";
function Profile() {
  const { user, setUser, loading } = useContext(AuthContext); // Access user and loading state from context
  const [activeSection, setActiveSection] = useState("userInfo");
  const [userData, setUserData] = useState(user || {}); // Initialize with user from context

  useEffect(() => {
    if (user) {
      setUserData(user); // Sync context user with local state if it exists
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.startsWith("profile.")) {
      const profileField = name.replace("profile.", "");
      setUserData((prevState) => ({
        ...prevState,
        profile: {
          ...prevState.profile,
          [profileField]: value,
        },
      }));
    } else if (name.startsWith("address.")) {
      const addressField = name.replace("address.", "");
      setUserData((prevState) => ({
        ...prevState,
        address: {
          ...prevState.address,
          [addressField]: value,
        },
      }));
    } else {
      setUserData((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  const updateUserCookie = (updatedUser) => {
    const userCookie = Cookies.get("user");
    if (!userCookie) return; // Exit early if no user cookie

    const cookieString = document.cookie
      .split("; ")
      .find((row) => row.startsWith("user="));
    const expires = cookieString.includes("expires=")
      ? new Date(cookieString.split("expires=")[1].split(";")[0])
      : null;

    Cookies.set("user", JSON.stringify(updatedUser), { expires });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    api
      .put("/users/profile", userData)
      .then((response) => {
        const updatedUser = response.data;
        setUser(updatedUser); // Update context
        updateUserCookie(updatedUser); // Update cookie without changing expiration
        showToast("Profile updated successfully!", "success"); // Use toast instead of alert
      })
      .catch((error) => {
        showToast("There was an error updating the profile!", "error"); // Show error toast
      });
  };

  // Display loading message while checking the auth state
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner />
      </div>
    );  }

  return (
    <div className="overflow-x-hidden">
      <section className="relative pt-40 pb-24">
        <img
          src="https://pagedone.io/asset/uploads/1705473908.png"
          alt="cover-image"
          className="w-full absolute top-0 left-0 z-0 h-60 object-cover"
        />
        <div className="w-full max-w-7xl mx-auto px-6 md:px-8">
          <div className="flex items-center justify-center sm:justify-start relative z-10 mb-5">
            <img
              src={userData.profile.imagePath}
              alt="user-avatar-image"
              className="border-4 border-solid border-white rounded-full h-32  w-32"
            />
          </div>
          <div className="flex items-center justify-center flex-col sm:flex-row max-sm:gap-5 sm:justify-between mb-5">
            <div className="block">
              <h3 className="font-manrope font-bold text-4xl text-gray-900 mb-1 max-sm:text-center">
                {userData.profile?.firstName}
              </h3>
            </div>
          </div>
          <div className="flex max-sm:flex-wrap max-sm:justify-center items-center gap-4">
            <button
              onClick={() => setActiveSection("userInfo")}
              className={`rounded-full py-3 px-6 ${
                activeSection === "userInfo"
                  ? "bg-indigo-600 text-white"
                  : "bg-stone-100 text-gray-700"
              } font-semibold text-sm leading-6 transition-all duration-500 hover:bg-stone-200 hover:text-gray-900`}
            >
              User Info
            </button>
            <button
              onClick={() => setActiveSection("orderHistory")}
              className={`rounded-full py-3 px-6 ${
                activeSection === "orderHistory"
                  ? "bg-indigo-600 text-white"
                  : "bg-stone-100 text-gray-700"
              } font-semibold text-sm leading-6 transition-all duration-500 hover:bg-stone-200 hover:text-gray-900`}
            >
              Order History
            </button>
            <button
              onClick={() => setActiveSection("changePassword")}
              className={`rounded-full py-3 px-6 ${
                activeSection === "changePassword"
                  ? "bg-indigo-600 text-white"
                  : "bg-stone-100 text-gray-700"
              } font-semibold text-sm leading-6 transition-all duration-500 hover:bg-stone-200 hover:text-gray-900`}
            >
              Change Password{" "}
            </button>
          </div>
          {activeSection === "userInfo" ? (
            <form
              onSubmit={handleSubmit}
              className="font-[sans-serif] text-[#333] max-w-4xl mx-auto px-6 my-6"
            >
              <div className="border-b-2 border-gray-300 pb-6 mb-6">
                <h2 className="text-lg font-semibold mb-4">Personal Info</h2>
                <div className="grid sm:grid-cols-2 gap-10">
                  <div className="relative flex flex-col">
                    <label className="text-sm mb-1">First Name</label>
                    <input
                      type="text"
                      name="profile.firstName"
                      value={userData.profile.firstName}
                      onChange={handleChange}
                      placeholder="Enter first name"
                      className="px-3 py-2 bg-white text-sm border-b-2 border-gray-300 focus:border-[#333] outline-none"
                    />
                  </div>
                  <div className="relative flex flex-col">
                    <label className="text-sm mb-1">Last Name</label>
                    <input
                      type="text"
                      name="profile.lastName"
                      value={userData.profile.lastName}
                      onChange={handleChange}
                      placeholder="Enter last name"
                      className="px-3 py-2 bg-white text-sm border-b-2 border-gray-300 focus:border-[#333] outline-none"
                    />
                  </div>
                </div>
                <div className="relative flex flex-col my-10">
                  <label className="text-sm mb-1">Phone Number</label>
                  <input
                    type="text"
                    name="phoneNumber"
                    value={userData.phoneNumber}
                    onChange={handleChange}
                    placeholder="Enter your phone number"
                    className="px-3 py-2 bg-white text-sm border-b-2 border-gray-300 focus:border-[#333] outline-none"
                  />
                </div>
                <div className="relative flex flex-col my-10">
                  <label className="text-sm mb-1">E-mail</label>
                  <input
                    type="text"
                    name="email"
                    value={userData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    className="px-3 py-2 bg-white text-sm border-b-2 border-gray-300 focus:border-[#333] outline-none"
                  />
                </div>
              </div>

              <div className="border-b-2 border-gray-300 pb-6 mb-6">
                <h2 className="text-lg font-semibold mb-4">Address Info</h2>
                <div className="grid sm:grid-cols-2 gap-10">
                  <div className="relative flex flex-col">
                    <label className="text-sm mb-1">Street Address</label>
                    <input
                      type="text"
                      name="address.streetAddress"
                      value={userData.address.streetAddress}
                      onChange={handleChange}
                      placeholder="Enter street address"
                      className="px-3 py-2 bg-white text-sm border-b-2 border-gray-300 focus:border-[#333] outline-none"
                    />
                  </div>
                  <div className="relative flex flex-col">
                    <label className="text-sm mb-1">Region</label>
                    <input
                      type="text"
                      name="address.Region"
                      value={userData.address.Region}
                      onChange={handleChange}
                      placeholder="Enter region"
                      className="px-3 py-2 bg-white text-sm border-b-2 border-gray-300 focus:border-[#333] outline-none"
                    />
                  </div>
                  <div className="relative flex flex-col">
                    <label className="text-sm mb-1">City</label>
                    <input
                      type="text"
                      name="address.City"
                      value={userData.address.City}
                      onChange={handleChange}
                      placeholder="Enter city"
                      className="px-3 py-2 bg-white text-sm border-b-2 border-gray-300 focus:border-[#333] outline-none"
                    />
                  </div>
                  <div className="relative flex flex-col">
                    <label className="text-sm mb-1">Postal Code</label>
                    <input
                      type="text"
                      name="address.postalCode"
                      value={userData.address.postalCode}
                      onChange={handleChange}
                      placeholder="Enter postal code"
                      className="px-3 py-2 bg-white text-sm border-b-2 border-gray-300 focus:border-[#333] outline-none"
                    />
                  </div>
                </div>
              </div>
              <button
                type="submit"
                className="mt-6 py-2.5 px-8 bg-[#333] w-fit rounded-md text-[15px] text-white font-bold leading-6 shadow-md transition-all duration-500 hover:shadow-lg"
              >
                Save
              </button>
            </form>
          ) : activeSection === "orderHistory" ? (
            <OrderHistory />
          ) : activeSection === "changePassword" ? (
            <UpdatePassword />
          ) : null}
        </div>
      </section>
    </div>
  );
}

export default Profile;
