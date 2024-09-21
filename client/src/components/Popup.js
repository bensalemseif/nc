import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../services/authService";
import AuthContext from "../contexts/AuthContext";
import { FaEye, FaEyeSlash } from "react-icons/fa"; // Icons for password visibility

const Popup = ({
  title,
  message,
  onConfirm,
  onCancel,
  confirmText,
  cancelText,
  isOpen,
  type,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-lg relative transition-all transform duration-300 scale-100 animate-fade-in-up">
        <button
          onClick={onCancel}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 transition duration-200"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          {title}
        </h3>

        {type === "login" ? (
          <LoginForm onClose={onCancel} />
        ) : (
          <div>
            <p className="text-gray-600 mb-6 text-center">{message}</p>
            <div className="flex justify-center gap-4">
              {cancelText && (
                <button
                  onClick={onCancel}
                  className="px-6 py-3 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                  {cancelText}
                </button>
              )}
              {confirmText && (
                <button
                  onClick={onConfirm}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
                >
                  {confirmText}
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const LoginForm = ({ onClose }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleLogin = async (event) => {
    event.preventDefault();
    setError("");
    try {
      const { user } = await loginUser(email, password);
      login(user);
      if (user.role === "admin") {
        navigate("/admin");
      } else {
        onClose();
      }
    } catch (err) {
      setError("Invalid email or password");
    }
  };

  const handleRegisterRedirect = () => {
    navigate("/register");
    onClose();
  };

  return (
    <form onSubmit={handleLogin}>
      {error && (
        <p className="text-red-500 mb-4 text-center animate-shake">
          {error}
        </p>
      )}
      <div className="mb-5">
        <label htmlFor="email" className="block text-gray-700 font-medium mb-1">
          Email
        </label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150"
          required
        />
      </div>
      <div className="mb-6 relative">
        <label
          htmlFor="password"
          className="block text-gray-700 font-medium mb-1"
        >
          Password
        </label>
        <input
          type={showPassword ? "text" : "password"}
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150"
          required
        />
        <button
          type="button"
          className="absolute inset-y-0 right-4 flex items-center text-gray-500 hover:text-gray-700"
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? <FaEyeSlash /> : <FaEye />}
        </button>
      </div>
      <button
        type="submit"
        className="w-full py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors duration-200"
      >
        Login
      </button>
      <div className="mt-6 text-center">
        <p className="text-gray-600">Don't have an account?</p>
        <button
          onClick={handleRegisterRedirect}
          className="text-blue-600 hover:underline focus:outline-none"
        >
          Register
        </button>
      </div>
    </form>
  );
};

export default Popup;
