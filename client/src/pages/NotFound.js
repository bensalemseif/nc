import React from 'react';

const NotFound = () => {
  return (
    <div className="w-full h-screen bg-gradient-to-r from-gray-100 to-gray-200 flex flex-col items-center justify-center">
      <div className="max-w-lg text-center space-y-8">
        {/* Error Code */}
        <p className="text-8xl md:text-9xl font-extrabold text-red-600 drop-shadow-lg">
          404
        </p>

        {/* Error Title */}
        <p className="text-4xl md:text-5xl font-semibold text-gray-800">
          Page Not Found
        </p>

        {/* Error Description */}
        <p className="text-lg md:text-xl text-gray-600">
          Sorry, the page you're looking for doesn't exist or has been moved.
        </p>

        {/* Call to Action */}
        <a
          href="/"
          className="inline-block bg-red-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-red-700 transition duration-300 ease-in-out"
        >
          Return to Homepage
        </a>
      </div>

      {/* Decorative Image or Icon */}
      <div className="mt-12">
        <img
          src="https://via.placeholder.com/400x300?text=404+Not+Found+Illustration"
          alt="Page Not Found"
          className="w-72 md:w-96"
        />
      </div>
    </div>
  );
};

export default NotFound;
