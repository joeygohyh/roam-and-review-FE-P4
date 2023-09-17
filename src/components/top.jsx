
import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
// import { API_KEY } from "./config";
import { Link } from "react-router-dom";
import { UserIcon } from '@heroicons/react/24/solid'
import { AuthContext } from "../components/auth/AuthProvider";
import { MapPinIcon } from '@heroicons/react/24/solid'
import Notification from "./Notification";
import LikeNotification from "./LikeNotification";



export default function TopParks() {
    const [topParks, setTopParks] = useState([]);
    const [topReviews, setTopReviews] = useState([]);
    const { getUserToken } = useContext(AuthContext);
    const [showLoginPopup, setShowLoginPopup] = useState(false);
    const [submittedReviews, setSubmittedReviews] = useState([]);
    const [likedReviews, setLikedReviews] = useState([]);
    const [showLikeNotification, setShowLikeNotification] = useState(false);
  const [expandedStates, setExpandedStates] = useState([]);

  const toggleExpand = (index) => {
    setExpandedStates((prevState) => {
      const updatedStates = [...prevState];
      updatedStates[index] = !updatedStates[index];
      return updatedStates;
    });
  };
  

    function formatDateAndTime(dateTimeString) {
      const dateTime = new Date(dateTimeString);
      const formattedDate = dateTime.toISOString().slice(0,10);
      const formattedTime = dateTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      return `${formattedDate} ${formattedTime}`;
    }

    
    useEffect(() => {
      const fetchTopParks = async () => {
        try {
          const response = await axios.get(`${process.env.REACT_APP_SERVER_URL}/top/parks`);
          const parkCodes = response.data.topParks;
  
          // Fetch detailed park information for each park code
          const parkDetailsPromises = parkCodes.map(async (parkCode) => {
    const apiKey = process.env.API_KEY;

            const parkResponse = await axios.get(
              `https://developer.nps.gov/api/v1/parks?parkCode=${parkCode}&api_key=${apiKey}`
            );
            return {
              parkName: parkResponse.data.data[0].fullName,
              parkCode: parkCode,
              description: parkResponse.data.data[0].description,
              images: parkResponse.data.data[0].images,

            };
          });
  
          const parkDetails = await Promise.all(parkDetailsPromises);
          setTopParks(parkDetails);
        } catch (error) {
          console.error("Error fetching top parks:", error);
        }
      };
  
      const fetchTopReviews = async () => {
        try {
          const response = await axios.get(`${process.env.REACT_APP_SERVER_URL}/top/reviews`);
          setTopReviews(response.data.topReviews);
        } catch (error) {
          console.error("Error fetching top reviews:", error);
        }
      };
  
      fetchTopParks();
      fetchTopReviews();
    }, []);


    const handleLike = async (reviewId) => {
      const userToken = getUserToken();
      if (!userToken) {
        setShowLoginPopup(true);
        return;
      }
    
      try {
        const response = await axios.post(
          `${process.env.REACT_APP_SERVER_URL}/reviews/${reviewId}/like`,
          {},
          {
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          }
        );
    
        const updatedReview = response.data;
        setLikedReviews((prevLikedReviews) => [...prevLikedReviews, updatedReview._id]);
        setSubmittedReviews((prevReviews) =>
          prevReviews.map((review) =>
            review._id === updatedReview._id ? updatedReview : review
          )
        );
      } catch (error) {
      setShowLikeNotification(true);

        console.error("Error liking review:", error);
      }
    };
  
    return (
      <div className="bg-white py-10 sm:py-22">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Get inspired.</h2>
            <p className="mt-2 text-lg leading-8 text-gray-600">Follow the path of others</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-10">
            <div className="sm:col-span-1" style={{ height: "500px" }}>
            {/* <div className="lg:w-1/2 flex flex-col" style={{ height: "200px" }}> */}
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-2xl">Top Parks with Most Reviews</h2>
            <br/>
              {topParks.map((park, index) => (
                <>

      <div className="border-t border-gray-200 pt-5 lg:grid-cols-3"></div>



                <div key={park.parkCode} className="p-4 rounded-md" style={{ height: '700px' }}>
                  <h2 className="relative z-5 rounded-full bg-gray-50 px-2 py-0.5 font-medium text-gray-600 hover:bg-gray-100 ml-auto inline-block" style={{ width: 'fit-content' }}>
  <MapPinIcon className="h-4 w-4 mr-1 text-gray-500 inline" aria-hidden="true" />
                    {park.parkName}</h2>
                  <br/>
                  <br/>
                  
                  <img
                    src={park.images[0]?.url}
                    // alt={park.images[0]?.altText}
                    alt="[sorry, no image available.]"
                    style={{ width: "550px", height: "450px" }}
                  />
                  <br/>
                  {/* <p className="mx-auto mt-2 text-sm leading-6 text-gray-600 max-w-[550px]">{park.description}</p> */}
                

                  <p
              className={`mx-auto mt-2 text-sm leading-6 text-gray-600 max-w-[550px] ${
                expandedStates[index] ? "" : "line-clamp-4"
              }`}
            >
              {park.description}
            </p>

            {park.description.length > 300 && (
              <button
                className="text-gray-600 text-xs mt-2 underline"
                onClick={() => toggleExpand(index)}
              >
                {expandedStates[index] ? "Show Less" : "Read More"}
              </button>
            )}


      {/* <div className="border-t border-gray-200 pt-5 lg:grid-cols-3"></div> */}
                  
                </div>
            </>

              ))}
            </div>
            <div className="sm:col-span-1" style={{ height: "500px" }}>
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-2xl">Top Reviews with Most Likes</h2>
            {/* <div className="lg:w-1/2 flex flex-col" style={{ height: "200px" }}> */}
            <br/>
              {topReviews.map((review, index) => (
                <>
      <div className="border-t border-gray-200 pt-5 lg:grid-cols-3"></div>
                <div key={review._id} className=" p-4 rounded-md" style={{ height: '700px' }}>
                  <h2 className="relative z-5 rounded-full bg-gray-50 px-2 py-0.5 font-medium text-gray-600 hover:bg-gray-100 ml-auto inline-block" style={{ width: 'fit-content' }}>
  <MapPinIcon className="h-4 w-4 mr-1 text-gray-500 inline" aria-hidden="true" />
                    
                    {review.location} 
                  </h2>
                  <br/>
                  <br/>

                  <img
                    src={review.imageUrl}
                    // alt={`Review Photo for ${review.text}`}
                    alt="[sorry, no image available.]"
                    style={{ width: "550px", height: "450px" }}
                  />
                  <br/>
                  <p className="mx-auto mt-2 text-sm leading-6 text-gray-600 max-w-[550px]">{review.text}</p>

                  {review.user && (
    <div className="text-sm leading-6">
      <p className="font-semibold text-gray-900">
      <UserIcon className="h-4 w-4 mr-1 text-gray-500 inline" aria-hidden="true" />
        
        {review.user.username}
      </p>
    </div>
  )}
<br/>
                <div className="flex items-center gap-x-2 mt-2 text-xs text-gray-600">
               <button
    onClick={() => handleLike(review._id)}
    className={`inline-flex items-center rounded-md ${
      likedReviews.includes(review._id)
        ? "bg-green-50 text-green-700"
        : "bg-gray-50 text-gray-700 hover:bg-gray-100"
    } px-2 py-1`}
    disabled={likedReviews.includes(review._id)}
  >
    {likedReviews.includes(review._id) ? "Liked ❤️" : "Like ❤️"}
  </button>
  <span className="inline-flex items-center rounded-md bg-gray-50 px-2 py-1">
        Likes: {likedReviews.includes(review._id) ? review.likes + 1 : review.likes}
      </span>

                
                <time dateTime={review.createdAt} className="ml-auto">
                  Posted: {formatDateAndTime(review.createdAt)}
                </time>



              </div>
              <br/>
              
      {/* <div className="border-t border-gray-200 pt-5 sm:mt-5 sm:pt-5 lg:mx-0 lg:max-w-none lg:grid-cols-3"></div> */}

                </div>
                </>
                
              ))}
              
            </div>
          </div>
        </div>
        {/* Pop-up notification */}
{showLoginPopup && (
        <Notification onClose={() => setShowLoginPopup(false)} />
      )}

       {/* Display the like notification when needed */}
       {showLikeNotification && (
        <LikeNotification onClose={() => setShowLikeNotification(false)} />
      )}
      </div>
    );
    
    
    
}