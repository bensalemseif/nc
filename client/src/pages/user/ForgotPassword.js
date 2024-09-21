import React, { useState } from "react";
import api from "../../config/axiosConfig";
import logo from "../../ass/logo.png";
import bg from "../../ass/logbg.jpeg";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { showToast } from "../../utils/toastNotifications";
import { showPopup } from "../../utils/popupUtils";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [step, setStep] = useState(1); // Step 1: Enter email, Step 2: Enter OTP and new password
  const navigate = useNavigate();

  const handleEmailChange = (e) => setEmail(e.target.value);
  const handleOtpChange = (e) => setOtp(e.target.value);
  const handlePasswordChange = (e) => setNewPassword(e.target.value);

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/auth/forgot-password/", { email });
      setStep(2); // Proceed to OTP and password step
      showToast("OTP has been sent to your email.");
    } catch (error) {
      showToast("An error occurred. Please try again.", "error");
    }
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post(`/auth/reset-password`, {
        otp,
        newPassword,
        email,
      });
      console.log(res);
      showPopup({
        title: "Success",
        message: "Your password has been reset successfully.",
        onConfirm: () => navigate("/login"),
        confirmText: "Login",
        cancelText: "Cancel",
      });
    } catch (error) {
      showToast(
        error.response?.data?.message || "Invalid or expired OTP",
        "error"
      );
    }
  };

  return (
    <div className="flex h-screen font-montserrat">
      <div className="w-1/2 flex flex-col items-center justify-center bg-white p-8">
        <img src={logo} className="w-48 mb-4 -mt-10" alt="Nectar Logo" />
        <h1 className="text-4xl font-semibold mb-2">
          Welcome to <span className="text-second">Nectar</span>
        </h1>
        <div className="text-xs text-gray-400 mb-6">
          Welcome back! Please follow the steps to reset your password.
        </div>

        {step === 1 && (
          <form className="w-full max-w-sm" onSubmit={handleEmailSubmit}>
            <div className="mb-4">
              <label
                className="block text-gray-700 text-xs font-semibold mb-2"
                htmlFor="email"
              >
                Email address
              </label>
              <input
                className="shadow appearance-none border rounded-lg w-full py-2 px-3 border-gray-300 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="email"
                type="email"
                placeholder="Your email here"
                value={email}
                onChange={handleEmailChange}
                required
              />
            </div>
            <div className="flex items-center mb-4">
              <button
                className="bg-primaly hover:bg-blue-950 text-white text-sm py-2 px-3 rounded-lg focus:outline-none focus:shadow-outline w-full"
                type="submit"
              >
                Send OTP
              </button>
            </div>
          </form>
        )}

        {step === 2 && (
          <form className="w-full max-w-sm" onSubmit={handlePasswordReset}>
            <div className="mb-4">
              <label
                className="block text-gray-700 text-xs font-semibold mb-2"
                htmlFor="otp"
              >
                OTP Code
              </label>
              <input
                className="shadow appearance-none border rounded-lg w-full py-2 px-3 border-gray-300 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="otp"
                type="number"
                placeholder="Enter the OTP"
                value={otp}
                onChange={handleOtpChange}
                required
              />
            </div>
            <div className="mb-4">
              <label
                className="block text-gray-700 text-xs font-semibold mb-2"
                htmlFor="newPassword"
              >
                New Password
              </label>
              <input
                className="shadow appearance-none border rounded-lg w-full py-2 px-3 border-gray-300 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="newPassword"
                type="password"
                placeholder="Enter new password"
                value={newPassword}
                onChange={handlePasswordChange}
                required
              />
            </div>
            <div className="flex items-center mb-4">
              <button
                className="bg-primaly hover:bg-blue-950 text-white text-sm py-2 px-3 rounded-lg focus:outline-none focus:shadow-outline w-full"
                type="submit"
              >
                Reset Password
              </button>
            </div>
          </form>
        )}

        <div className="text-xs text-gray-400">
          <p>
            Want to try again?{" "}
            <Link to="/login" className="text-pink-400 hover:text-pink-600">
              Sign In.
            </Link>
          </p>
        </div>
      </div>
      <div
        className="w-1/2"
        style={{
          backgroundImage: `url(${bg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      ></div>
    </div>
  );
}

export default ForgotPassword;
