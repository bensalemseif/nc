// Spinner.jsx
import React from 'react';

const Spinner = () => {
  return (
    <div className="relative flex items-center justify-center w-16 h-16">
      <div className="absolute w-2.5 h-2.5 bg-blue-500 rounded-full animate-dot1"></div>
      <div className="absolute w-2.5 h-2.5 bg-blue-500 rounded-full animate-dot2"></div>
      <div className="absolute w-2.5 h-2.5 bg-blue-500 rounded-full animate-dot3"></div>
      <div className="absolute w-2.5 h-2.5 bg-blue-500 rounded-full animate-dot4"></div>
    </div>
  );
};

export default Spinner;
