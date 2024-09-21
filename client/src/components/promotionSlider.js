import React, { useState } from "react";

const PromotionSlider = ({ promotions }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [hoveredSlide, setHoveredSlide] = useState(null);

  const goToPrevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? promotions.length - 1 : prev - 1));
  };

  const goToNextSlide = () => {
    setCurrentSlide((prev) => (prev === promotions.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="relative w-full max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
      <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-800 mb-8">
        Discover Our Promotions
      </h2>

      <div id="indicators-carousel" className="relative w-full mt-8">
        <div className="relative h-56 sm:h-64 md:h-80 lg:h-96 overflow-hidden rounded-lg shadow-lg">
          {promotions.map((promotion, index) => (
            <div
              key={index}
              className={`absolute w-full h-full transition-opacity duration-700 ease-in-out ${
                index === currentSlide ? "opacity-100" : "opacity-0"
              }`}
              data-carousel-item={index === currentSlide ? "active" : ""}
              onMouseEnter={() => setHoveredSlide(index)}
              onMouseLeave={() => setHoveredSlide(null)}
              style={{ zIndex: index === currentSlide ? 1 : 0 }} // Ensure the active slide stays on top
            >
              {/* Image */}
              <img
                src={`${promotion.imagePath}`}
                alt={promotion.name}
                className="absolute block w-full h-full object-cover rounded-lg"
              />

              {/* Hover Overlay */}
              {(hoveredSlide === index || currentSlide === index) && (
                <div className="absolute inset-0 bg-black opacity-0 hover:opacity-100 bg-opacity-70 backdrop-blur-sm flex justify-between items-center text-white transition-opacity duration-300 p-4 sm:p-8 md:p-12 lg:p-20 rounded-lg">
                  <div className="text-left flex-col">
                    <h3 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-2 uppercase">
                      {promotion.name}
                    </h3>
                    <p className="text-sm sm:text-lg">
                      Start Date:{" "}
                      <span className="font-light">
                        {new Date(promotion.startDate).toLocaleDateString()}
                      </span>
                    </p>
                    <p className="text-sm sm:text-lg">
                      End Date:{" "}
                      <span className="font-light">
                        {new Date(promotion.endDate).toLocaleDateString()}
                      </span>
                    </p>
                  </div>
                  {/* Discount Rate */}
                  {promotion.discountRate && (
                    <div className="text-center flex-col">
                      <h3 className="text-center text-5xl sm:text-6xl md:text-8xl lg:text-9xl font-extrabold text-white">
                        {promotion.discountRate}
                      </h3>
                      <p className="text-center text-3xl sm:text-4xl md:text-5xl font-bold text-white">
                        % OFF
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Slider Indicators */}
        <div className="absolute z-30 flex space-x-2 bottom-4 left-1/2 transform -translate-x-1/2">
          {promotions.map((_, index) => (
            <button
              key={index}
              type="button"
              className={`block h-2 sm:h-3 rounded-2xl transition-all ${
                index === currentSlide ? "w-8 bg-white" : "w-4 bg-white/50"
              }`}
              aria-current={index === currentSlide ? "true" : "false"}
              aria-label={`Slide ${index + 1}`}
              onClick={() => setCurrentSlide(index)}
            ></button>
          ))}
        </div>

        {/* Slider Controls */}
        <button
          type="button"
          className="absolute top-1/2 left-0 transform -translate-y-1/2 z-30 ml-2 sm:ml-5 flex items-center justify-center h-8 w-8 sm:h-10 sm:w-10 bg-black/30 hover:bg-black/50 text-white rounded-full"
          onClick={goToPrevSlide}
        >
          <svg
            className="w-4 h-4 sm:w-6 sm:h-6"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path d="M15 19l-7-7 7-7"></path>
          </svg>
          <span className="sr-only">Previous</span>
        </button>
        <button
          type="button"
          className="absolute top-1/2 right-0 transform -translate-y-1/2 z-30 mr-2 sm:mr-5 flex items-center justify-center h-8 w-8 sm:h-10 sm:w-10 bg-black/30 hover:bg-black/50 text-white rounded-full"
          onClick={goToNextSlide}
        >
          <svg
            className="w-4 h-4 sm:w-6 sm:h-6"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path d="M9 5l7 7-7 7"></path>
          </svg>
          <span className="sr-only">Next</span>
        </button>
      </div>
    </div>
  );
};

export default PromotionSlider;
