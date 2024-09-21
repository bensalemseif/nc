import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import logo from "../../ass/logo.png";
import bg from "../../ass/logbg.jpeg";
import { registerUser } from "../../services/authService"; // A service for registering users
import { showPopup } from "../../utils/popupUtils";

function Signup() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [error, setError] = useState(""); // Error for password mismatch

  // Form data state
  const [formData, setFormData] = useState({
    userName: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
    profile: { firstName: "", lastName: "" },
    address: { streetAddress: "", Region: "", City: "", postalCode: "" },
  });

  const [fieldErrors, setFieldErrors] = useState({
    userName: false,
    email: false,
    phoneNumber: false,
    password: false,
    confirmPassword: false,
    firstName: false,
    lastName: false,
    streetAddress: false,
    Region: false,
    City: false,
    postalCode: false,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Update nested state
    if (name.startsWith("profile.") || name.startsWith("address.")) {
      const [section, field] = name.split(".");
      setFormData((prevData) => ({
        ...prevData,
        [section]: {
          ...prevData[section],
          [field]: value,
        },
      }));
    } else {
      setFormData({ ...formData, [name]: value });
    }

    // Clear error when the field is filled
    if (value) {
      setFieldErrors({ ...fieldErrors, [name]: false });
    }
  };

  const validateStep = () => {
    let valid = true;
    const errors = {};

    // Validate current step
    if (step === 1) {
      if (!formData.userName) {
        valid = false;
        errors.userName = true;
      }
      if (!formData.email) {
        valid = false;
        errors.email = true;
      }
      if (!formData.phoneNumber) {
        valid = false;
        errors.phoneNumber = true;
      }
      if (!formData.password) {
        valid = false;
        errors.password = true;
      }
      if (!formData.confirmPassword) {
        valid = false;
        errors.confirmPassword = true;
      }
      if (formData.password !== formData.confirmPassword) {
        valid = false;
        setError("Passwords do not match");
      } else {
        setError("");
      }
    } else if (step === 2) {
      if (!formData.profile.firstName) {
        valid = false;
        errors.firstName = true;
      }
      if (!formData.profile.lastName) {
        valid = false;
        errors.lastName = true;
      }
      if (!formData.address.streetAddress) {
        valid = false;
        errors.streetAddress = true;
      }
      if (!formData.address.Region) {
        valid = false;
        errors.Region = true;
      }
      if (!formData.address.City) {
        valid = false;
        errors.City = true;
      }
      if (!formData.address.postalCode) {
        valid = false;
        errors.postalCode = true;
      }
    }

    setFieldErrors(errors);
    return valid;
  };

  const handleSubmit = async () => {
    if (!validateStep()) return;

    try {
      const response = await registerUser(formData);
      if (
        response.message ===
        "User registered successfully. Please verify your email."
      ) {
        //title, message, onConfirm, onCancel, confirmText, cancelText, isOpen, type
        showPopup({
          title: "Registration Successful",
          message: `A verification email has been sent to your email address. Please check your inbox and follow the instructions to verify your account. If you don’t see the email, 
          please check your spam folder or try requesting a new verification email.`,

          onConfirm: () => navigate("/login"),
          oncancel: ()=> (''),
          confirmText: "Go to login",
          cancelText: "Resent Email",
          isOpen: false,
        });
      }
    } catch (err) {
    }
  };

  const nextStep = () => {
    if (validateStep()) {
      setStep(step + 1);
    }
  };

  const prevStep = () => setStep(step - 1);

  return (
    <div className="flex flex-col md:flex-row h-full font-montserrat bg-gray-50">
      <div className="md:w-1/2 flex flex-col items-center justify-center bg-white p-8 shadow-lg relative">
        <img src={logo} className="w-48 mb-4" alt="Nectar Logo" />
        <h1 className="text-4xl font-bold mb-2 text-gray-800">
          Create your <span className="text-second">Account</span>
        </h1>
        <p className="text-xs text-gray-500 mb-6">
          Fill in the details to create your account.
        </p>

        <form
          className="w-full max-w-md space-y-4"
          onSubmit={(e) => e.preventDefault()}
        >
          {step === 1 && (
            <>
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-semibold mb-2"
                  htmlFor="userName"
                >
                  Username
                  {fieldErrors.userName && (
                    <span className="text-red-500 text-xs ml-2">Required</span>
                  )}
                </label>
                <input
                  className={`shadow-sm border rounded w-full py-2 px-3 border-gray-300 ${
                    fieldErrors.userName ? "border-red-500" : ""
                  }`}
                  id="userName"
                  type="text"
                  name="userName"
                  value={formData.userName}
                  onChange={handleChange}
                  placeholder="Username"
                />
              </div>

              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-semibold mb-2"
                  htmlFor="email"
                >
                  Email
                  {fieldErrors.email && (
                    <span className="text-red-500 text-xs ml-2">Required</span>
                  )}
                </label>
                <input
                  className={`shadow-sm border rounded w-full py-2 px-3 border-gray-300 ${
                    fieldErrors.email ? "border-red-500" : ""
                  }`}
                  id="email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email"
                />
              </div>

              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-semibold mb-2"
                  htmlFor="phoneNumber"
                >
                  Phone Number
                  {fieldErrors.phoneNumber && (
                    <span className="text-red-500 text-xs ml-2">Required</span>
                  )}
                </label>
                <input
                  className={`shadow-sm border rounded w-full py-2 px-3 border-gray-300 ${
                    fieldErrors.phoneNumber ? "border-red-500" : ""
                  }`}
                  id="phoneNumber"
                  type="text"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  placeholder="Phone Number"
                />
              </div>

              <div className="mb-6">
                <label
                  className="block text-gray-700 text-sm font-semibold mb-2"
                  htmlFor="password"
                >
                  Password
                  {fieldErrors.password && (
                    <span className="text-red-500 text-xs ml-2">Required</span>
                  )}
                </label>
                <input
                  className={`shadow-sm border rounded w-full py-2 px-3 border-gray-300 ${
                    fieldErrors.password ? "border-red-500" : ""
                  }`}
                  id="password"
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Password"
                />
              </div>
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-semibold mb-2"
                  htmlFor="confirmPassword"
                >
                  Confirm Password
                  {fieldErrors.confirmPassword && (
                    <span className="text-red-500 text-xs ml-2">Required</span>
                  )}
                </label>
                <input
                  className={`shadow-sm border rounded w-full py-2 px-3 border-gray-300 ${
                    fieldErrors.confirmPassword ? "border-red-500" : ""
                  }`}
                  id="confirmPassword"
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm Password"
                />
                {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
              </div>

              <div className="flex justify-between">
                <button
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 text-sm py-2 px-6 rounded-lg"
                  onClick={nextStep}
                >
                  Next
                </button>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-semibold mb-2"
                  htmlFor="firstName"
                >
                  First Name
                  {fieldErrors.firstName && (
                    <span className="text-red-500 text-xs ml-2">Required</span>
                  )}
                </label>
                <input
                  className={`shadow-sm border rounded w-full py-2 px-3 border-gray-300 ${
                    fieldErrors.firstName ? "border-red-500" : ""
                  }`}
                  id="firstName"
                  type="text"
                  name="profile.firstName"
                  value={formData.profile.firstName}
                  onChange={handleChange}
                  placeholder="First Name"
                />
              </div>

              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-semibold mb-2"
                  htmlFor="lastName"
                >
                  Last Name
                  {fieldErrors.lastName && (
                    <span className="text-red-500 text-xs ml-2">Required</span>
                  )}
                </label>
                <input
                  className={`shadow-sm border rounded w-full py-2 px-3 border-gray-300 ${
                    fieldErrors.lastName ? "border-red-500" : ""
                  }`}
                  id="lastName"
                  type="text"
                  name="profile.lastName"
                  value={formData.profile.lastName}
                  onChange={handleChange}
                  placeholder="Last Name"
                />
              </div>

              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-semibold mb-2"
                  htmlFor="streetAddress"
                >
                  Street Address
                  {fieldErrors.streetAddress && (
                    <span className="text-red-500 text-xs ml-2">Required</span>
                  )}
                </label>
                <input
                  className={`shadow-sm border rounded w-full py-2 px-3 border-gray-300 ${
                    fieldErrors.streetAddress ? "border-red-500" : ""
                  }`}
                  id="streetAddress"
                  type="text"
                  name="address.streetAddress"
                  value={formData.address.streetAddress}
                  onChange={handleChange}
                  placeholder="Street Address"
                />
              </div>

              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-semibold mb-2"
                  htmlFor="Region"
                >
                  Region
                  {fieldErrors.Region && (
                    <span className="text-red-500 text-xs ml-2">Required</span>
                  )}
                </label>
                <input
                  className={`shadow-sm border rounded w-full py-2 px-3 border-gray-300 ${
                    fieldErrors.Region ? "border-red-500" : ""
                  }`}
                  id="Region"
                  type="text"
                  name="address.Region"
                  value={formData.address.Region}
                  onChange={handleChange}
                  placeholder="Region"
                />
              </div>

              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-semibold mb-2"
                  htmlFor="City"
                >
                  City
                  {fieldErrors.City && (
                    <span className="text-red-500 text-xs ml-2">Required</span>
                  )}
                </label>
                <input
                  className={`shadow-sm border rounded w-full py-2 px-3 border-gray-300 ${
                    fieldErrors.City ? "border-red-500" : ""
                  }`}
                  id="City"
                  type="text"
                  name="address.City"
                  value={formData.address.City}
                  onChange={handleChange}
                  placeholder="City"
                />
              </div>

              <div className="mb-6">
                <label
                  className="block text-gray-700 text-sm font-semibold mb-2"
                  htmlFor="postalCode"
                >
                  Postal Code
                  {fieldErrors.postalCode && (
                    <span className="text-red-500 text-xs ml-2">Required</span>
                  )}
                </label>
                <input
                  className={`shadow-sm border rounded w-full py-2 px-3 border-gray-300 ${
                    fieldErrors.postalCode ? "border-red-500" : ""
                  }`}
                  id="postalCode"
                  type="text"
                  name="address.postalCode"
                  value={formData.address.postalCode}
                  onChange={handleChange}
                  placeholder="Postal Code"
                />
              </div>

              <div className="flex justify-between">
                <button
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 text-sm py-2 px-6 rounded-lg"
                  onClick={prevStep}
                >
                  Previous
                </button>
                <button
                  className="bg-second hover:bg-second text-white text-sm py-2 px-6 rounded-lg"
                  onClick={handleSubmit}
                >
                  Register
                </button>
              </div>
            </>
          )}
        </form>
        {error && <p className="text-red-500 mt-4">{error}</p>}
      </div>
      <div
        className="md:w-1/2 bg-cover bg-center"
        style={{ backgroundImage: `url(${bg})` }}
      >
        <div className="flex items-center justify-center h-full bg-black bg-opacity-50">
          <div className="text-center text-white p-8">
            <h2 className="text-4xl font-bold mb-4">Welcome Back!</h2>
            <p className="text-lg mb-4">Already have an account?</p>
            <Link to="/login">
              <button className="bg-second hover:bg-second text-white text-sm py-2 px-6 rounded-lg">
                Login
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;
