import { Link } from 'react-router-dom'; // Import the Link component

const Notification = ({ onClose }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white p-4 rounded-lg shadow-lg">
        <p className="text-gray-600">You need to be logged in to perform this action.</p>
        <Link to="/user/login" className="mt-4 px-3 py-1 bg-teal-500 text-white rounded-lg hover:bg-teal-600">
          Login
        </Link>
        <button
          onClick={onClose}
          className="mt-4 ml-2 px-3 py-1 bg-gray-300 text-gray-600 rounded-lg hover:bg-gray-400"
        >
          Close
        </button>
      </div>
    </div>
  );
};

  export default Notification;