// components/Modal.js
import React from 'react';
import ReactDOM from 'react-dom';

const Modal = ({ onClose, onConfirm, title, content }) => {
  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full">
        <h2 className="text-lg font-bold mb-4">{title}</h2>
        <div className="mb-4">{content}</div>
        <div className="flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-500 text-white rounded-lg"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default Modal;
