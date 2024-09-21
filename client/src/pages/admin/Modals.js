// Modals.js
import React from 'react';
import ReactDOM from 'react-dom';

const Modal = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null;

    return ReactDOM.createPortal(
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-4 max-w-sm w-full">
                <button onClick={onClose} className="absolute top-2 right-2 text-gray-500">
                    &times;
                </button>
                {children}
            </div>
        </div>,
        document.body
    );
};

export const DetailsModal = ({ isOpen, onClose, order }) => (
    <Modal isOpen={isOpen} onClose={onClose}>
        <h2 className="text-xl font-semibold mb-4">Order Details</h2>
        <p><strong>Order Number:</strong> {order.id}</p>
        <p><strong>Total Price:</strong> {order.totalPrice}</p>
        <p><strong>User:</strong> {order.user}</p>
        <p><strong>Status:</strong> {order.status}</p>
    </Modal>
);

export const ConfirmUpdateModal = ({ isOpen, onClose, onConfirm }) => (
    <Modal isOpen={isOpen} onClose={onClose}>
        <h2 className="text-xl font-semibold mb-4">Confirm Update</h2>
        <p>Are you sure you want to update the status?</p>
        <div className="mt-4 flex justify-end space-x-2">
            <button onClick={onClose} className="bg-gray-300 text-white rounded px-4 py-2">Cancel</button>
            <button onClick={onConfirm} className="bg-green-500 text-white rounded px-4 py-2">Confirm</button>
        </div>
    </Modal>
);

export const ConfirmDeleteModal = ({ isOpen, onClose, onConfirm }) => (
    <Modal isOpen={isOpen} onClose={onClose}>
        <h2 className="text-xl font-semibold mb-4">Confirm Delete</h2>
        <p>Are you sure you want to delete this order?</p>
        <div className="mt-4 flex justify-end space-x-2">
            <button onClick={onClose} className="bg-gray-300 text-white rounded px-4 py-2">Cancel</button>
            <button onClick={onConfirm} className="bg-red-500 text-white rounded px-4 py-2">Confirm</button>
        </div>
    </Modal>
);
