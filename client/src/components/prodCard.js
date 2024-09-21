import React from "react";
import { Link } from "react-router-dom";

const ProductCard = ({ product, viewType }) => {
  const isGridView = viewType === "grid"; // Check if the view is grid

  return (
    <div
      className={`relative bg-white shadow-lg rounded-lg overflow-hidden transition-transform transform hover:scale-105 ${
        isGridView ? "m-4 w-full sm:w-60 max-w-xs" : "flex w-full p-4"
      }`}
    >
      {/* Product Image */}
      <Link to={`/user/product-details/${product.id}`} className="block">
        <div
          className={`${
            isGridView ? "w-full h-48" : "w-32 h-32 mr-4 flex-shrink-0"
          } bg-center bg-no-repeat bg-cover`}
          style={{
            backgroundImage: `url(${product.imagePath[0]})`,
          }}
        />
      </Link>

      {/* Product Details */}
      <div className={`${isGridView ? "p-4" : "flex-1 flex flex-col justify-between"}`}>
        <Link to={`/user/product-details/${product.id}`}>
          <h5 className="text-base font-semibold text-gray-900 truncate">
            {product.productName}
          </h5>
        </Link>

        {/* Description */}
        {product.description && (
          <p className={`mt-2 text-sm text-gray-700 ${isGridView ? "truncate" : "line-clamp-2"}`}>
            {product.description}
          </p>
        )}

        {/* Rating Section */}
        <div className="mt-2.5 mb-3 flex items-center">
          <span className="mr-2 rounded bg-yellow-200 px-2 py-0.5 text-xs font-semibold text-gray-800">
            {product.AVGrating}
          </span>
          {[...Array(5)].map((_, index) => (
            <svg
              key={index}
              aria-hidden="true"
              className={`h-4 w-4 ${
                index < product.AVGrating ? "text-yellow-400" : "text-gray-300"
              }`}
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ))}
        </div>

        {/* Price Section */}
        <div className="flex items-center justify-between mt-2">
          <p className="text-lg font-bold text-gray-900">
            {product.finalPrice.toFixed(2)} TND
          </p>
          {product.price !== product.finalPrice && (
            <span className="text-sm text-gray-500 line-through ml-2">
              {product.price.toFixed(2)} TND
            </span>
          )}
        </div>

        {/* Promotion Badge */}
        {product.promotion && (
          <span className="absolute top-2 left-2 bg-black text-white text-xs px-2 py-1 rounded">
            {product.promotion.discountRate}% Off
          </span>
        )}

        {/* Stock Badge */}
        <div
          className={`absolute top-2 right-2 px-2 py-1 text-xs font-semibold text-white rounded ${
            product.stock ? "bg-green-500" : "bg-red-500"
          }`}
        >
          {product.stock ? "In Stock" : "Out of Stock"}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
