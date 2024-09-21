import React, { useRef } from "react";
import { Link } from "react-router-dom";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const CategoriesSection = ({ categories }) => {
  const scrollRef = useRef(null);

  const scrollLeft = () => {
    scrollRef.current.scrollBy({ left: -300, behavior: "smooth" });
  };

  const scrollRight = () => {
    scrollRef.current.scrollBy({ left: 300, behavior: "smooth" });
  };

  return (
    <div className="relative w-full max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
      <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-800">
        Explore Categories
      </h2>
      <button
        className="hidden sm:block absolute left-2 sm:left-4 top-1/2 transform -translate-y-1/2 p-3 rounded-full bg-gray-100 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-second z-10"
        onClick={scrollLeft}
      >
        <FaChevronLeft className="w-6 h-6 text-gray-700" />
      </button>
      <div
        className="overflow-x-auto no-scrollbar snap-x snap-mandatory flex space-x-4 sm:space-x-6 px-2 sm:px-8"
        ref={scrollRef}
      >
        {categories.map((category) => (
          <div
            key={category.id}
            className="snap-center flex-shrink-0 w-28 sm:w-36 md:w-48 flex flex-col items-center justify-center group"
          >
            <Link
              to={`/user/product-list?category=${category._id}`}
              className="relative w-24 h-24 sm:w-28 sm:h-28 md:w-36 md:h-36 mt-6 sm:mt-8 md:mt-12 rounded-full overflow-hidden shadow-lg transform transition-transform duration-300 group-hover:-translate-y-2 group-hover:ring-4 group-hover:ring-second"
            >
              <img
                src={category.imagePath}
                alt={category.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-25 group-hover:bg-opacity-40 transition-opacity"></div>
            </Link>
            <h3 className="mt-4 text-sm sm:text-md md:text-lg font-semibold text-gray-700 group-hover:text-second transition-colors">
              {category.name}
            </h3>
            <div className="h-1 w-0 bg-second transition-all duration-300 group-hover:w-full mt-1 sm:mt-2"></div>
          </div>
        ))}
      </div>

      {/* Right arrow */}
      <button
        className="hidden sm:block absolute right-2 sm:right-4 top-1/2 transform -translate-y-1/2 p-3 rounded-full bg-gray-100 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-second z-10"
        onClick={scrollRight}
      >
        <FaChevronRight className="w-6 h-6 text-gray-700" />
      </button>
    </div>
  );
};

export default CategoriesSection;
