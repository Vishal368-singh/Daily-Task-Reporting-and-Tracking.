// src/components/PasswordChangeModal.jsx

import { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import { RiLockPasswordLine } from "react-icons/ri";
import { changePassword } from "../api/authApi";

export default function PasswordChangeModal({ visible, onClose, employeeId }) {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Reset fields when the modal is closed
  useEffect(() => {
    if (!visible) {
      setNewPassword("");
      setConfirmPassword("");
    }
  }, [visible]);
  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (!newPassword || !confirmPassword) {
      toast.error("Password fields cannot be empty.");
      return;
    }
    if (newPassword !== confirmPassword) {
      console.log(newPassword, confirmPassword);
      toast.error("Passwords do not match.");
      return;
    }

    try {
      await changePassword(employeeId, { newPassword });
      toast.success("Password changed successfully!");
      onClose();
    } catch {
      toast.error("Failed to change password.");
    }
  };

  if (!visible) return null;

  // Handle closing the modal when clicking on the background overlay
  const handleOverlayClick = (e) => {
    if (e.target.id === "modal-overlay") {
      onClose();
    }
  };

  return (
    
      <div
        id="modal-overlay"
        onClick={handleOverlayClick}
        className="fixed inset-0 bg-black/5 backdrop-blur-sm flex justify-center items-center z-[100] animate-fade-in-fast"
      >
        <div className="bg-[#1f1f1f] text-gray-200 rounded-xl shadow-2xl shadow-black/50 w-full max-w-md m-4 border border-gray-700 animate-scale-in">
          {/* Modal Header */}
          <div className="flex justify-between items-center p-4 border-b border-gray-700">
            <h2 className="text-xl font-semibold text-white flex items-center gap-x-2">
              <RiLockPasswordLine />
              Change Password
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors text-2xl"
            >
              &times;
            </button>
          </div>

          {/* Modal Body */}
          <form onSubmit={handlePasswordChange}>
            <div className="p-6 space-y-4">
              <div>
                <label
                  htmlFor="newPassword"
                  className="block mb-2 text-sm font-medium text-gray-300"
                >
                  New Password
                </label>
                <input
                  type="password"
                  id="newPassword"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                  className="w-full bg-gray-700/50 border border-gray-600 rounded-lg p-2.5 text-white placeholder-gray-400 focus:ring-red-500 focus:border-red-500 transition"
                />
              </div>
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block mb-2 text-sm font-medium text-gray-300"
                >
                  Confirm New Password
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Enter new password again"
                  className="w-full bg-gray-700/50 border border-gray-600 rounded-lg p-2.5 text-white placeholder-gray-400 focus:ring-red-500 focus:border-red-500 transition"
                />
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end items-center p-4 space-x-3 bg-[#18181B] border-t border-gray-700 rounded-b-xl">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-lg bg-gray-600 hover:bg-gray-500 text-white font-semibold transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold transition"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
      
  );
}
