import React from 'react';

const ServerUnreachable = () => (
  <div className="w-full h-screen flex items-center justify-center bg-gray-100">
    <div className="text-center">
      <h1 className="text-4xl font-bold text-red-600">Server Unreachable</h1>
      <p className="text-lg text-gray-600 mt-4">We are unable to connect to the server. Please try again later.</p>
      <button
        className="mt-6 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-500"
        onClick={() => window.location.reload()}
      >
        Retry
      </button>
    </div>
  </div>
);

export default ServerUnreachable;
