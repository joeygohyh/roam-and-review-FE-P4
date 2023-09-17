import React, { useState, useEffect } from "react";
// import { API_KEY } from "./config";
import ActivityPopup from "./ActivityPopup";


const resultsPerPage = 4;

const Campgrounds = ({ parkCode }) => {
  const [campground, setCampground] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [popupVisible, setPopupVisible] = useState(false);

  const [selectedActivity, setSelectedActivity] = useState(null);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const indexOfLastResult = currentPage * resultsPerPage;
  const indexOfFirstResult = indexOfLastResult - resultsPerPage;
  const currentResults = campground.slice(indexOfFirstResult, indexOfLastResult);

  const totalPages = Math.ceil(campground.length / resultsPerPage);

  const fetchCampgrounds = async () => {

    const apiKey = process.env.API_KEY;

    const url = `https://developer.nps.gov/api/v1/campgrounds?parkCode=${parkCode}&api_key=${apiKey}`;


    try {
      const res = await fetch(url, {
        method: "GET",
        headers: {
          accept: "application/json",
        },
      });

      if (res.ok) {
        const json = await res.json();
        const campgroundData = json.data;
        setCampground(campgroundData);
      } else {
        console.error("Error fetching camp grounds:", res.statusText);
      }
    } catch (error) {
      console.error("Error fetching camp grounds:", error);
    }
  };

  useEffect(() => {
    fetchCampgrounds();
  }, [parkCode]);

  if (campground.length === 0) {
    return <div>No camp grounds found.</div>;
  }

  return (

    <>
    <div className="bg-white py-2">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:mx-0">
          <h2 className="mt-5 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl text-left">
            Camp Grounds
          </h2>
          <p className="mt-2 text-lg leading-8 text-gray-600 text-left">
          Find the best places to stay.
          </p>
        </div>
        <div className="mx-auto mt-3 max-w-6xl">
          <div className="grid grid-cols-4 gap-8">
            {currentResults.map((activity) => (
              <article
                key={activity.id}
                className="flex flex-col items-start justify-between"
              >
                <div className="flex items-center gap-x-4 text-xs">
              
                  {/* <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      setSelectedActivity(activity);
                      setPopupVisible(true);
                    }}
                    className="relative z-10 rounded-full bg-gray-50 px-3 py-1.5 font-medium text-gray-600 hover:bg-gray-100"
                  >
                    {activity.name}
                  </a> */}
                </div>
                <div className="group relative">
                  <h3 className="mt-3 mb-3 text-md font-semibold leading-6 text-gray-900 group-hover:text-gray-600">
                    <a  href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      setSelectedActivity(activity);
                      setPopupVisible(true);
                    }}>
                      <span className="absolute inset-0" />
                      {activity.name}
                    </a>
                  </h3>
                  <a
                     href="#"
                     onClick={(e) => {
                       e.preventDefault();
                       setSelectedActivity(activity);
                       setPopupVisible(true);
                     }}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <img
                      src={activity.images[0]?.url} // Display the first image URL, if available
                      // alt={activity.images[0]?.altText}
                      alt="[sorry, no image available.]"
                      style={{ width: "250px", height: "200px" }} // Adjust the size here
                    />
                  </a>
                 
                </div>
                
              </article>
           ))}
           </div>
         </div>
         <nav className="mt-10" aria-label="Pagination">
           <ul className="flex justify-center">
             {Array.from({ length: totalPages }, (_, index) => (
               <li key={index}>
                 <button
                   className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
                     currentPage === index + 1
                       ? 'bg-teal-600 text-white'
                       : 'text-gray-900'
                  //  } ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0`}
                } ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:outline-offset-0`}

                   onClick={() => handlePageChange(index + 1)}
                 >
                   {index + 1}
                 </button>
               </li>
             ))}
           </ul>
         </nav>
       </div>
     </div>

     {popupVisible && selectedActivity && (
  <ActivityPopup
    activity={selectedActivity}
    onClose={() => setPopupVisible(false)}
  />
)}

    </>
  );
};

export default Campgrounds;
