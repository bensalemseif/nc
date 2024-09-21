// src/components/ProductDetailModal.js
import React from 'react';

const ProductDetailModal = ({ product, onClose }) => {
  if (!product) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none focus:outline-none bg-gray-800 bg-opacity-50">
      <div className="relative w-full max-w-lg mx-auto">
        <div className="relative flex flex-col bg-white p-6 rounded-lg shadow-lg">
          <button
            onClick={onClose}
            className="absolute top-0 right-0 p-2 bg-gray-200 rounded-full hover:bg-gray-300 focus:bg-gray-300 focus:outline-none"
          >
            {/* Close icon */}
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm0-2a6 6 0 100-12 6 6 0 000 12zM8.293 8.293a1 1 0 011.414 0L10 10.586l1.293-1.293a1 1 0 111.414 1.414L11.414 12l1.293 1.293a1 1 0 01-1.414 1.414L10 13.414l-1.293 1.293a1 1 0 01-1.414-1.414L8.586 12 7.293 10.707a1 1 0 010-1.414zM10 4a1 1 0 011 1v5a1 1 0 11-2 0V5a1 1 0 011-1z"
                clipRule="evenodd"
              />
            </svg>
          </button>
          <h2 className="text-xl font-semibold mb-4">{product.name}</h2>
          <p className="mb-2"><strong>Price:</strong> {product.price}</p>
          <p className="mb-2"><strong>Description:</strong> {product.description}</p>
          <p className="mb-2"><strong>Status:</strong> {product.status}</p>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailModal;
