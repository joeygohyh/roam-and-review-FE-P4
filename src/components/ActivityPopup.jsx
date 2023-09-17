const ActivityPopup = ({ activity, onClose }) => {
  return (
    <div className="fixed inset-0 flex justify-center items-center bg-gray-800 bg-opacity-50">
      <div className="bg-white p-8 max-w-md rounded-lg relative">
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
          onClick={onClose}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {activity.title ? (
          <h3 className="mt-3 mb-3 text-md font-semibold leading-6 text-gray-900 group-hover:text-gray-600">
            {activity.title}
          </h3>
        ) : (
          <h3 className="mt-3 mb-3 text-md font-semibold leading-6 text-gray-900 group-hover:text-gray-600">
            {activity.name}
          </h3>
        )}

        <img
          src={activity.images[0]?.url}
          alt="[sorry, no image available.]"
          style={{ width: "100%", height: "auto", maxHeight: "400px" }}
        />

        {activity.shortDescription ? (
          <p className="mx-auto mt-2 text-xs leading-6 text-gray-600 ">
            {activity.shortDescription}
          </p>
        ) : (
          <p className="mx-auto mt-2 text-xs leading-6 text-gray-600 ">
            {activity.description}
          </p>
        )}

      
      </div>
    </div>
  );
};

export default ActivityPopup;
