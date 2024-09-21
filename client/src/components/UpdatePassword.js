import React, { useState } from 'react';
import api from '../config/axiosConfig';

export default function UpdatePassword() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const token = localStorage.getItem('token');
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Basic validation
    if (newPassword !== confirmPassword) {
      setError('New passwords do not match.');
      setSuccess('');
      return;
    }
  
    if (!newPassword || !currentPassword) {
      setError('Please fill in all fields.');
      setSuccess('');
      return;
    }
  

  
    try {
      const response = await api.put(
        '/users/password',
        {
          currentPassword,
          newPassword
        }      
        
      );
      // Handle success
      setSuccess('Password changed successfully.');
      setError('');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setError('Failed to change password. Please try again.');
      setSuccess('');
    }
  };
  
  
  

  return (
    <form onSubmit={handleSubmit} className="font-[sans-serif] text-[#333] max-w-4xl mx-auto px-6 my-6">
      <h2 className="text-lg font-semibold mb-4">Change Password</h2>

      {error && <p className="text-red-600 mb-4">{error}</p>}
      {success && <p className="text-green-600 mb-4">{success}</p>}

      <div className="relative flex flex-col mb-6">
        <label className="text-sm mb-1">Current Password</label>
        <input
          type="password"
          placeholder="Enter current password"
          className="px-3 py-2 bg-white text-sm border-b-2 border-gray-300 focus:border-[#333] outline-none"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
        />
      </div>

      <div className="relative flex flex-col mb-6">
        <label className="text-sm mb-1">New Password</label>
        <input
          type="password"
          placeholder="Enter new password"
          className="px-3 py-2 bg-white text-sm border-b-2 border-gray-300 focus:border-[#333] outline-none"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
      </div>

      <div className="relative flex flex-col mb-6">
        <label className="text-sm mb-1">Confirm New Password</label>
        <input
          type="password"
          placeholder="Confirm new password"
          className="px-3 py-2 bg-white text-sm border-b-2 border-gray-300 focus:border-[#333] outline-none"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
      </div>

      <button
        type="submit"
        className="mt-6 py-2.5 px-8 bg-[#333] w-fit rounded-md text-[15px] text-white font-bold leading-6 shadow-md transition-all duration-500 hover:shadow-lg"
      >
        Change Password
      </button>
    </form>
  );
}
