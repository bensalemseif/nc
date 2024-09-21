import React from "react";

const ServerError = () => {
  return (
    <div className="w-full h-screen bg-gradient-to-r from-blue-100 to-blue-200 flex flex-col items-center justify-center">
      <div className="max-w-lg text-center space-y-8">
        {/* Error Code */}
        <p className="text-8xl md:text-9xl font-extrabold text-blue-600 drop-shadow-lg">
          500
        </p>

        {/* Error Title */}
        <p className="text-4xl md:text-5xl font-semibold text-gray-800">
          Oops! Server Error
        </p>

        {/* Error Description */}
        <p className="text-lg md:text-xl text-gray-600">
          It seems something went wrong on our side. Please try again later or
          return to the homepage.
        </p>

        {/* Call to Action */}
        <a href="/" className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-blue-700 transition duration-300 ease-in-out">
          Go Back Home
        </a>
      </div>

      {/* Decorative Image or Icon */}
      <div className="mt-12">
        <img
          src="https://via.placeholder.com/400x300?text=Server+Error+Illustration"
          alt="Server Error"
          className="w-72 md:w-96"
        />
      </div>
    </div>
  );
};

export default ServerError;
