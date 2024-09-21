import React, { useState } from 'react';
import logo from '../ass/logo.png';
import bg from '../ass/logbg.jpeg';

function ResetPassword() {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordsMatch, setPasswordsMatch] = useState(true);

  const handleConfirmChanges = (e) => {
    e.preventDefault();
    if (newPassword === confirmPassword && newPassword !== '') {
      // Passwords match and are not empty
      alert('Password reset successful!');
      // Here you can implement your logic to send the new password to the server
    } else {
      // Passwords don't match or one of the fields is empty
      setPasswordsMatch(false);
    }
  };

  return (
    <div className="flex h-screen font-montserrat">
      <div className="w-1/2 flex flex-col items-center justify-center bg-white p-8">
        <img src={logo} className="w-48 mb-4 -mt-10" alt="Nectar Logo" />
        <h1 className="text-4xl font-semibold mb-2">
          Welcome to <span className="text-second">Nectar</span>
        </h1>
        <div className="text-xs text-gray-400 mb-6">
          Welcome back! Please enter your details to continue.
        </div>
        <div className="text-2xl font-semibold mb-2">
        Change Password
        </div>
        <div className="text-xs text-gray-400 mb-6 text-center">
        Choose a new password, must be at least 8 characters 
        <div>(Let’s try to remember it this time)</div>        </div>
        <form className="w-full max-w-sm">
          <div className="mb-4">
            <label className="block text-gris text-xs font-semibold mb-2" htmlFor="new-password">
              New Password
            </label>
            <input
              className={`shadow appearance-none border rounded-lg w-full py-2 px-3 border-gray-300 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${!passwordsMatch && 'border-red-500'}`}
              id="new-password"
              type="password"
              placeholder="Enter your password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label className="block text-gris text-xs font-semibold mb-2" htmlFor="confirm-password">
              Confirm Password
            </label>
            <input
              className={`shadow appearance-none border rounded-lg w-full py-2 px-3 border-gray-300 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${!passwordsMatch && 'border-red-500'}`}
              id="confirm-password"
              type="password"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            {!passwordsMatch && (
              <p className="text-red-500 text-xs mt-1">Passwords do not match. Please try again.</p>
            )}
          </div>
          <div className="flex items-center justify-center mb-4">
            <button
              className="bg-primaly hover:bg-blue-950 text-white text-sm py-2 px-3 rounded-lg focus:outline-none focus:shadow-outline mr-2 w-full"
              type="submit"
              onClick={handleConfirmChanges}
            >
              Confirm Changes
            </button>
          </div>
        </form>
      </div>
      <div
        className="w-1/2"
        style={{
          backgroundImage: `url(${bg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      ></div>
    </div>
  );
}

export default ResetPassword;
