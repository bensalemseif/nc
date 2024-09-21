import React, { useState, useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getCategories, getSubCategory } from "../services/categoryService";
import AuthContext from "../contexts/AuthContext";
import api from "../config/axiosConfig";
import { FaShoppingCart, FaHeart, FaBars, FaTimes } from "react-icons/fa";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const [categories, setCategories] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [megaMenuOpen, setMegaMenuOpen] = useState(false);
  const [mobileMegaMenuOpen, setMobileMegaMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoriesData = await getCategories();
        const categoriesWithSub = await Promise.all(
          categoriesData.map(async (category) => {
            const subcategories = await getSubCategory(category._id);
            return { ...category, subcategories };
          })
        );
        setCategories(categoriesWithSub);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };
    fetchCategories();
  }, []);

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");
      logout();
      navigate("/");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <nav className="bg-white shadow sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="text-2xl font-bold text-primaly">
              NECTAR
            </Link>
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex space-x-6">
            <Link to="/" className="text-gray-700 hover:text-second transition">
              Home
            </Link>
            <button
              onClick={() => setMegaMenuOpen(!megaMenuOpen)}
              className="text-gray-700 hover:text-second transition"
            >
              Categories
            </button>
            <Link to="/user/product-list" className="text-gray-700 hover:text-second transition">
              Products
            </Link>
            <Link to="/user/promotion-list" className="text-gray-700 hover:text-second transition">
              Promotion
            </Link>
            <Link to="/user/about-us" className="text-gray-700 hover:text-second transition">
              About
            </Link>
          </div>

          {/* Icons and User Profile */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <>
                <Link to="/user/profile">
                  <img
                    src={user.profile.imagePath}
                    alt="Profile"
                    className="w-8 h-8 rounded-full border border-gray-300"
                  />
                </Link>
                <Link to="/user/favorites">
                  <FaHeart className="text-gray-700 hover:text-second transition" />
                </Link>
                <Link to="/user/cart">
                  <FaShoppingCart className="text-gray-700 hover:text-second transition" />
                </Link>
                <button onClick={handleLogout} className="text-gray-700 hover:text-second transition">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-700 hover:text-second transition">
                  Login
                </Link>
                <Link to="/register" className="text-gray-700 hover:text-second transition">
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button onClick={() => setMenuOpen(!menuOpen)} aria-label="Open Menu">
              <FaBars className="text-gray-700 text-xl" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white shadow-lg z-40 fixed inset-0">
          <div className="flex flex-col p-4 space-y-4">
            <button onClick={() => setMenuOpen(false)} aria-label="Close Menu">
              <FaTimes className="text-gray-700 text-xl" />
            </button>
            <Link to="/" className="text-gray-700 hover:text-second transition" onClick={() => setMenuOpen(false)}>
              Home
            </Link>
            <button
              onClick={() => setMobileMegaMenuOpen(!mobileMegaMenuOpen)}
              className="text-gray-700 hover:text-second transition"
            >
              Categories
            </button>
            <Link to="/user/product-list" className="text-gray-700 hover:text-second transition" onClick={() => setMenuOpen(false)}>
              Products
            </Link>
            <Link to="/user/promotion-list" className="text-gray-700 hover:text-second transition" onClick={() => setMenuOpen(false)}>
              Promotion
            </Link>
            <Link to="/user/about-us" className="text-gray-700 hover:text-second transition" onClick={() => setMenuOpen(false)}>
              About
            </Link>
            {user ? (
              <>
                <Link to="/user/profile" className="text-gray-700 hover:text-second transition" onClick={() => setMenuOpen(false)}>
                  Profile
                </Link>
                <Link to="/user/favorites" className="text-gray-700 hover:text-second transition" onClick={() => setMenuOpen(false)}>
                  Favorites
                </Link>
                <Link to="/user/cart" className="text-gray-700 hover:text-second transition" onClick={() => setMenuOpen(false)}>
                  Cart
                </Link>
                <button onClick={handleLogout} className="text-gray-700 hover:text-second transition">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-700 hover:text-second transition" onClick={() => setMenuOpen(false)}>
                  Login
                </Link>
                <Link to="/register" className="text-gray-700 hover:text-second transition" onClick={() => setMenuOpen(false)}>
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      )}

      {/* Mega Menu for Desktop */}
      {megaMenuOpen && (
        <div className="hidden md:block bg-white shadow-lg absolute inset-x-0 z-40">
          <div className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map((category) => (
              <div key={category._id}>
                <h3 className="font-semibold text-lg text-gray-900">{category.name}</h3>
                <ul className="mt-2 space-y-2">
                  {category.subcategories.map((sub) => (
                    <li key={sub._id}>
                      <Link
                        to={`/category/${category._id}/subcategory/${sub._id}`}
                        className="text-gray-600 hover:text-second transition"
                      >
                        {sub.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Slide-in Mega Menu for Mobile */}
      {mobileMegaMenuOpen && (
        <div className="fixed inset-0 bg-opacity-50 bg-black z-50 flex justify-end">
          <div className="bg-white w-72 p-6 shadow-xl">
            <button
              onClick={() => setMobileMegaMenuOpen(false)}
              className="text-gray-700 mb-4 hover:text-second transition"
              aria-label="Close Categories"
            >
              <FaTimes />
            </button>
            {categories.map((category) => (
              <div key={category._id}>
                <h3 className="text-lg font-semibold">{category.name}</h3>
                <ul className="mt-2 space-y-2">
                  {category.subcategories.map((sub) => (
                    <li key={sub._id}>
                      <Link
                        to={`/category/${category._id}/subcategory/${sub._id}`}
                        className="text-gray-600 hover:text-second transition"
                        onClick={() => setMobileMegaMenuOpen(false)}
                      >
                        {sub.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
