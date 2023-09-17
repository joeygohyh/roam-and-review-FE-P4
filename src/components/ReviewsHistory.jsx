import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../components/auth/AuthProvider";

import axios from "axios"; // Import axios library for making HTTP requests
import { MapPinIcon } from '@heroicons/react/24/solid'
import { UserIcon } from '@heroicons/react/24/solid'
import LikeNotification from "./LikeNotification";


function formatDateAndTime(dateTimeString) {
    const dateTime = new Date(dateTimeString);
    const formattedDate = dateTime.toISOString().slice(0, 10);
    const formattedTime = dateTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    return `${formattedDate} ${formattedTime}`;
  }
  

function ReviewsHistory() {
  const [userReviews, setUserReviews] = useState([]);
  const { getUserFromToken } = useContext(AuthContext);
  const { getUserToken } = useContext(AuthContext);
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [submittedReviews, setSubmittedReviews] = useState([]);
  const [likedReviews, setLikedReviews] = useState([]);
  const [showLikeNotification, setShowLikeNotification] = useState(false);


  useEffect(() => {
    // Fetch all reviews from the backend
    fetch(`${process.env.REACT_APP_SERVER_URL}/reviews`)
      .then((response) => response.json())
      .then((data) => {
        // console.log("Fetched reviews:", data);

        // Get logged-in user from context
        const loggedInUser = getUserFromToken();
        // console.log(loggedInUser)

        // Filter reviews by username of logged-in user
        const userSpecificReviews = data.filter(
          (review) => review.user.username === loggedInUser.username
        );

        const reversedUserSpecificReviews = [...userSpecificReviews].reverse();



        // Store user-specific reviews in state
        setUserReviews(reversedUserSpecificReviews);
      })
      .catch((error) => {
        console.error("Error fetching reviews:", error);
      });
  }, [getUserFromToken]);

 

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
    <div>
          <div className="text-center">
            {/* <div className="mx-auto max-w-2xl lg:mx-0"> */}
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Reviews History
            </h2>
            <p className="mt-2 text-lg leading-8 text-gray-600">
              Have a look at everything you have posted.
            </p>
            {/* <div className=" border-t border-gray-200 pt-5 sm:mt-5 sm:pt-5 "></div> */}
            <div className="mx-auto" style={{ maxWidth: '35%' }}>
      <div className="border-t border-gray-200 pt-5 sm:mt-5 sm:pt-5"></div>
    </div>
          </div>
    

{/* <ol>
  {userReviews.map((review) => (
    <li key={review._id} className="flex items-center justify-between space-x-4 p-4  mb-4">
      <div className="flex-1">
        <b className="text-gray-600 font-medium hover:bg-gray-100 p-2.5 rounded-full">
          {review.location}
        </b>
        <p className="mt-2 text-sm text-gray-600 line-clamp-3">{review.text}</p>

     
              <div className="flex items-center gap-x-4 mt-2">
  {review.user && (
    <div className="text-sm leading-6">
      <p className="font-semibold text-gray-900">
        {review.user.username}
      </p>
      <p className="text-gray-600">{review.user.gender}</p>
    </div>
  )}
</div>


        <div className="flex items-center gap-x-2 mt-2 ">
       

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

   

        <div className="flex items-center gap-x-2 mt-2 text-xs text-gray-600">
         
          <time dateTime={review.createdAt}>Posted: 
            {formatDateAndTime(review.createdAt)}
          </time>
           </div>
         
        </div>
     
       
      </div>
      {review.imageUrl && (
        <div className="flex-shrink-0">
          <a href={review.imageUrl} target="_blank" rel="noopener noreferrer">
            <img
              src={review.imageUrl}
              // alt={`Review Photo for ${review.text}`}
              alt="[sorry, no image available.]"
              style={{ width: "250px", height: "200px" }}
            />
          </a>
        </div>
      )}
    </li>
  ))}
</ol> */}


<ol>
  {userReviews.map((review) => (
    <li
      key={review._id}
      className="flex items-start justify-between p-4 border border-gray-200 mb-4"
    >
    {/* Left Column */}
<div className="flex-1 pr-4 px-2 py-12" style={{ flex: '30%' }}>
  <div className="flex items-center flex-col"> {/* Added flex items-center and flex-col */}
    <div className="text-sm leading-6">
      <p className="font-semibold text-gray-900">
      <UserIcon className="h-4 w-4 mr-1 text-gray-500 inline" aria-hidden="true" />
        
        {review.user.username}</p>
      <p className="text-gray-600">{review.user.gender}</p>
    </div>

    {/* Like Button and Likes */}
    <div className="flex items-center gap-x-2 mt-2">
      <div className="flex items-center gap-x-2">
        <div>
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
        </div>
        <span className="inline-flex items-center rounded-md bg-gray-50 px-2 py-1">
        Likes: {likedReviews.includes(review._id) ? review.likes + 1 : review.likes}
      </span>
        
      </div>

    
    </div>
  </div>
  <div className="gap-x-2 text-xs text-gray-600 px-2 py-5">
        <time dateTime={review.createdAt}>
          Posted: {formatDateAndTime(review.createdAt)}
        </time>
      </div>
</div>




      {/* Middle Column */}
<div className="flex-1 px-2 py-8" style={{ flex: '55%' }}>
  <div className="flex items-center justify-center flex-col"> {/* Added items-center and justify-center */}
    <b className="text-gray-600 font-medium hover:bg-gray-100 p-2.5 rounded-full">
      <MapPinIcon className="h-4 w-4 mr-1 text-gray-500 inline" aria-hidden="true" />
      {review.location}
    </b>
    <p className="mt-2 text-sm text-gray-600 px-2 py-3">{review.text}</p>
  </div>
</div>


      {/* Right Column */}
      <div className="flex-1 pl-4" style={{ flex: '30%' }}>
        {review.imageUrl && (
          <a href={review.imageUrl} target="_blank" rel="noopener noreferrer">
            <img
              src={review.imageUrl}
              // alt={`Review Photo for ${review.text}`}
              alt="[sorry, no image available.]"
              style={{ width: "300px", height: "250px" }}
            />
          </a>
        )}
      </div>
    </li>
  ))}
</ol>

{/* Display the like notification when needed */}
{showLikeNotification && (
        <LikeNotification onClose={() => setShowLikeNotification(false)} />
      )}
    </div>
  );
}

export default ReviewsHistory;


