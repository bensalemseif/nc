import React from 'react';

const GlobalError = () => {
  return (
    <div className="w-full h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-red-600">Oops!</h1>
        <p className="text-lg text-gray-600 mt-4">
          Something went wrong. Please try again later.
        </p>
        <button
          className="mt-6 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-500"
          onClick={() => window.location.reload()} // Option to reload the page
        >
          Reload Page
        </button>
      </div>
    </div>
  );
};

export default GlobalError;
