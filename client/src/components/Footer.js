import React from "react";
import { FaFacebookF, FaTwitter, FaInstagram, FaPinterestP, FaMapMarkerAlt, FaPhoneAlt, FaEnvelope } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 py-8">
      <div className="container mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* About Us Section */}
          <div>
            <h4 className="text-xl font-bold mb-4 text-white">Nectar Cosmetics</h4>
            <p className="text-gray-400">
              Discover our premium range of cosmetics designed to enhance your natural beauty. Our products are crafted with care and the finest ingredients to ensure the best quality.
            </p>
          </div>

          {/* Quick Links Section */}
          <div>
            <h5 className="text-lg font-semibold mb-4 text-white">Quick Links</h5>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-second">Home</a></li>
              <li><a href="#" className="hover:text-second">Products</a></li>
              <li><a href="#" className="hover:text-second">About Us</a></li>
              <li><a href="#" className="hover:text-second">Contact</a></li>
            </ul>
          </div>

          {/* Contact Us Section */}
          <div>
            <h5 className="text-lg font-semibold mb-4 text-white">Contact Us</h5>
            <div className="space-y-4">
              <div className="flex items-center text-gray-400">
                <FaMapMarkerAlt className="text-second text-xl mr-3" />
                <span>456 Beauty Lane, Glamour City, Country</span>
              </div>
              <div className="flex items-center text-gray-400">
                <FaPhoneAlt className="text-second text-xl mr-3" />
                <span>+123 456 7890</span>
              </div>
              <div className="flex items-center text-gray-400">
                <FaEnvelope className="text-second text-xl mr-3" />
                <span>support@nectarcosmetics.com</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 pt-6 flex flex-col items-center lg:flex-row lg:justify-between">
          {/* Social Media Links */}
          <div className="flex space-x-4 mb-4 lg:mb-0">
            <a href="#" className="text-gray-400 hover:text-second">
              <FaFacebookF className="text-xl" />
            </a>
            <a href="#" className="text-gray-400 hover:text-second">
              <FaTwitter className="text-xl" />
            </a>
            <a href="#" className="text-gray-400 hover:text-second">
              <FaInstagram className="text-xl" />
            </a>
            <a href="#" className="text-gray-400 hover:text-second">
              <FaPinterestP className="text-xl" />
            </a>
          </div>

          {/* Copyright */}
          <p className="text-gray-500">© {new Date().getFullYear()} Nectar Cosmetics. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
