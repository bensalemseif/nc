import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../ass/logo.png";
import bg from "../ass/logbg.jpeg";
import { Link } from "react-router-dom";
import { loginUser } from "../services/authService";
import AuthContext from "../contexts/AuthContext"; // Import AuthContext
import { FaEye, FaEyeSlash } from "react-icons/fa"; // Icons for password visibility
import { showToast } from "../utils/toastNotifications";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useContext(AuthContext); // Use AuthContext to set the user data
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleLogin = async () => {
    try {
      const { user } = await loginUser(email, password);
      login(user); // Set the user in context

      if (user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } catch (err) {
      showToast('Invalid Email or Password', "error");
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen font-montserrat bg-gray-50">
      <div className="md:w-1/2 flex flex-col items-center justify-center bg-white p-8 shadow-lg">
        <img src={logo} className="w-48 mb-4" alt="Nectar Logo" />
        <h1 className="text-4xl font-bold mb-2 text-gray-800">
          Welcome to <span className="text-second">Nectar</span>
        </h1>
        <p className="text-xs text-gray-500 mb-6">
          Welcome back! Please enter your details to continue.
        </p>

        <form className="w-full max-w-sm" onSubmit={(e) => e.preventDefault()}>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-semibold mb-2"
              htmlFor="email"
            >
              Email address
            </label>
            <input
              className="shadow-sm appearance-none border rounded w-full py-2 px-3 border-gray-300 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="email"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="mb-6">
            <label
              className="block text-gray-700 text-sm font-semibold mb-2"
              htmlFor="password"
            >
              Password
            </label>
            <div className="relative">
              <input
                className="shadow-sm appearance-none border rounded w-full py-2 px-3 border-gray-300 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                className="absolute inset-y-0 right-0 flex items-center justify-center px-3 text-gray-500 hover:text-gray-700"
                type="button"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            <div className="flex justify-between mt-2">
              <Link
                to="/forgot-password"
                className="text-second text-xs hover:underline"
              >
                Forgot Password?
              </Link>
              <Link
                to="/register"
                className="text-second text-xs hover:underline"
              >
                Don't have an account? Sign up
              </Link>
            </div>
          </div>

          <div className="flex items-center justify-center mb-4">
            <button
              className="bg-second hover:bg-second text-white text-sm py-2 px-6 rounded-lg focus:outline-none focus:shadow-outline transition-all"
              type="button"
              onClick={handleLogin}
            >
              Sign In
            </button>
          </div>
        </form>
      </div>

      <div
        className="md:w-1/2 bg-cover bg-center relative"
        style={{ backgroundImage: `url(${bg})` }}
      >
        <div className="absolute inset-0 bg-black opacity-40"></div>
      </div>
    </div>
  );
}

export default Login;
