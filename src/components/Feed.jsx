
import React, { useState, useEffect, useRef, useContext } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
// import { LocationMarkerIcon } from '@heroicons/react/solid';
import { MapPinIcon } from '@heroicons/react/24/solid'
import { UserIcon } from '@heroicons/react/24/solid'
import { NewspaperIcon } from '@heroicons/react/24/solid'
import { AuthContext } from "../components/auth/AuthProvider";
import Notification from "./Notification";
import LikeNotification from "./LikeNotification";


function formatDateAndTime(dateTimeString) {
    const dateTime = new Date(dateTimeString);
    const formattedDate = dateTime.toISOString().slice(0,10);
    const formattedTime = dateTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    return `${formattedDate} ${formattedTime}`;
  }


const Feed = () => {
  const [allReviews, setAllReviews] = useState([]);
  const { getUserToken } = useContext(AuthContext);

  const [expandedStates, setExpandedStates] = useState([]);
  const [numPostsToLoad, setNumPostsToLoad] = useState(5);
  const [numPostsToAdd, setNumPostsToAdd] = useState(5);
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [submittedReviews, setSubmittedReviews] = useState([]);
  // const [sortOption, setSortOption] = useState(filter[1]);
  const [likedReviews, setLikedReviews] = useState([]);
  const [newestReviews, setNewestReviews] = useState([]);
  const [showLikeNotification, setShowLikeNotification] = useState(false);

  const bottomObserver = useRef(null);

  // const toggleExpand = (index) => {
  //   setExpandedStates((prevState) => {
  //     const updatedStates = [...prevState];
  //     const reversedIndex = allReviews.length - index - 1;
  //     updatedStates[reversedIndex] = !updatedStates[reversedIndex];
  //     return updatedStates;
  //   });
  // };
  const toggleExpand = (index) => {
    setExpandedStates((prevState) => {
      const updatedStates = [...prevState];
      updatedStates[index] = !updatedStates[index];
      return updatedStates;
    });
  };

  useEffect(() => {
    const fetchAllReviews = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_SERVER_URL}/reviews`);
        const fetchedReviews = response.data;
        setAllReviews(fetchedReviews);
        setExpandedStates(new Array(fetchedReviews.length).fill(false));
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    };

    fetchAllReviews();
  }, []);

  useEffect(() => {
    const options = {
      root: null,
      rootMargin: "2px",
      threshold: 1.0,
    };

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        setNumPostsToLoad((prevNumPostsToLoad) => prevNumPostsToLoad + 5); // Load 10 more posts
      }
    }, options);

    if (bottomObserver.current) {
      observer.observe(bottomObserver.current);
    }

    return () => {
      if (bottomObserver.current) {
        observer.unobserve(bottomObserver.current);
      }
    };
  }, []);

  const handleLike = async (reviewId) => {
    const userToken = getUserToken();
    if (!userToken) {
      setShowLoginPopup(true);
      return;
    }
  
    try {
      const response = await axios.post(`${process.env.REACT_APP_SERVER_URL}/reviews/${reviewId}/like`,
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
  

  const latestReviews = allReviews
  .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) // Sort in descending order
  .slice(0, numPostsToLoad);


  // console.log(latestReviews)
  

return (
  <div className="flex flex-col justify-center items-center min-h-screen">
    <div className="max-w-xl lg:max-w-lg mt-5 lg:mt-2 text-center">
    <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
  News Feed  {' '}
  <NewspaperIcon className="h-10 w-10 mr-1 text-gray-900 inline" aria-hidden="true" />
</h2>
<p className="mt-2 text-lg leading-8 text-gray-600">See what's up!</p>


    </div>
    <div className="text-center mt-5">
      <div className="border-t border-gray-200 pt-5 sm:mt-5 sm:pt-5 lg:mx-0 lg:max-w-none lg:grid-cols-3">
        <ol>
        {/* {allReviews.slice(0, numPostsToLoad).reverse().map((review, index) => ( */}
        {latestReviews.map((review, index) => (
            <article key={review._id} className="flex max-w-xl flex-col items-start justify-between">
              <div className="mx-auto flex flex-col items-center gap-y-1 text-xs">
                <h3 className="mt-1 text-lg font-semibold leading-6 text-gray-900 group-hover:text-gray-600">
                  <img
                    src={review.imageUrl}
                    // alt={review.imageUrl}
                    alt="[sorry, no image available.]"
                    style={{ width: "450px", height: "300px" }}
                  />
                  <br />
                  <p className="relative z-5 rounded-full bg-gray-50 px-2 py-0.5 font-medium text-gray-600 hover:bg-gray-100 ml-auto inline-block" style={{ width: 'fit-content' }}>
  <MapPinIcon className="h-4 w-4 mr-1 text-gray-500 inline" aria-hidden="true" />
  {review.location}
</p>

              
 <p
            className={`mt-2 text-sm leading-6 text-gray-600 ${
              expandedStates[index] ? "" : "line-clamp-5"
            } max-w-md text-center `}
          >
            {review.text}
          </p>
          {review.text.length > 250 && (
            <button
              className="text-gray-600 text-xs mt-2 underline"
              // className="flex items-center gap-x-2 mt-2 text-xs text-gray-600"
              onClick={() => toggleExpand(index)}
            >
              {expandedStates[index] ? "Show Less" : "Read More"}
            </button>
          )}

                </h3>
<br/>
                {review.user && (
    <div className="text-sm leading-6">
      <p className="font-semibold text-gray-900">
      <UserIcon className="h-4 w-4 mr-1 text-gray-500 inline" aria-hidden="true" />
        
        {review.user.username}
      </p>
    </div>
  )}

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
              </div>
             
              <div className="border-t border-gray-200 pt-3 sm:mt-5 sm:pt-5 lg:mx-0 lg:max-w-none lg:grid-cols-3"></div>
            </article>
          ))}
        </ol>
      </div>
    </div>
    <div ref={bottomObserver} style={{ height: "10px" }} />
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

export default Feed;





      
