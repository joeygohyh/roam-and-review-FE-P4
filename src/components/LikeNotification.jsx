import React from "react";

const LikeNotification = ({ onClose }) => {
  return (
    <div className="fixed top-0 right-0 mt-10 mr-5">
      <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-md shadow-lg">
        <div className="flex">
          <div className="py-1">
            <svg
              className="w-6 h-6"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
           
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium">You've already liked this photo.</p>
          </div>
        </div>
        <div className="mt-2 text-sm">
          <button
            onClick={onClose}
            className="font-medium underline hover:text-green-900 focus:outline-none"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default LikeNotification;
