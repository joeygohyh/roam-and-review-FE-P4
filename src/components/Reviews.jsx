

import React, { useState, useEffect, useContext } from "react";
import axios from "axios"; // Import axios library for making HTTP requests
import cloudinary from "cloudinary-core"; 
// import { useReviewContext } from "../contexts/ReviewContext";
import { AuthContext } from "../components/auth/AuthProvider";
import Notification from "./Notification";
import { MapPinIcon } from '@heroicons/react/24/solid'
import { UserIcon } from '@heroicons/react/24/solid'

import { Fragment } from 'react'
import { Listbox, Transition } from '@headlessui/react'
import { CheckIcon, ChevronUpDownIcon, HandThumbUpIcon, ClockIcon } from '@heroicons/react/20/solid'
import LikeNotification from "./LikeNotification";


const resultsPerPage = 5;

const filter = [
  {
    name: 'Most Recent',
    id: 1,
    value: "recent",
    avatar: ClockIcon,
  },
  {
    name: 'Most Liked',
    id: 2,
    value: "liked",
    avatar: HandThumbUpIcon,
  },
 
]

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

function formatDateAndTime(dateTimeString) {
  const dateTime = new Date(dateTimeString);
  const formattedDate = dateTime.toISOString().slice(0, 10);
  const formattedTime = dateTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  return `${formattedDate} ${formattedTime}`;
}


const Reviews = ({parkCode}) => {
  const { getUserToken } = useContext(AuthContext);
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [reviewText, setReviewText] = useState("");
  const [submittedReviews, setSubmittedReviews] = useState([]);
  // const { submittedReviews, setSubmittedReviews } = useReviewContext();
  const [selectedFile, setSelectedFile] = useState(null);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [location, setLocation] = useState("");
  // const [sortOption, setSortOption] = useState("recent");
  // const [sortOption, setSortOption] = useState(filter[1]);
  const [sortOption, setSortOption] = useState("recent");
  const [showLikeNotification, setShowLikeNotification] = useState(false);


  const [currentPage, setCurrentPage] = useState(1);
  const [likedReviews, setLikedReviews] = useState([]);
  const [sortedReviews, setSortedReviews] = useState([]); 

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const indexOfLastResult = currentPage * resultsPerPage;
  const indexOfFirstResult = indexOfLastResult - resultsPerPage;
  
  const allSubmittedReviews = sortedReviews; // Use the sortedReviews array for pagination
const paginatedReviews = allSubmittedReviews.slice(
  indexOfFirstResult,
  indexOfLastResult
);

  const totalPages = Math.ceil(sortedReviews.length / resultsPerPage);

  // const [selected, setSelected] = useState(filter[1])

  const handleReviewChange = (event) => {
    setReviewText(event.target.value);
  };

  const handleLocationChange = (event) => {
    setLocation(event.target.value);
  };

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  
  const handleSubmitReview = async () => {
    const userToken = getUserToken();
    if (!userToken) {
      setShowLoginPopup(true);
      return;
    }

    if (!reviewText || !selectedFile) {
      return;
    }

    const formData = new FormData();
    formData.append("text", reviewText);
    formData.append("image", selectedFile);
    formData.append("location", location);
    formData.append("parkCode", parkCode);

    try {
      const cloudinaryResponse = await axios.post(
        `${process.env.REACT_APP_SERVER_URL}/reviews/cloudinary/upload`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${userToken}`, // Attach the user token to the request
          },
        }
      );

      const response = await axios.post(
        `${process.env.REACT_APP_SERVER_URL}/reviews/create`,
        {
          text: reviewText,
          imageUrl: cloudinaryResponse.data.imageUrl,
          location: location,
          parkCode: parkCode,
        },
        {
          headers: {
            Authorization: `Bearer ${userToken}`, // Attach the user token to the request
          },
        }
      );

      const savedReview = response.data;
      setSubmittedReviews((prevReviews) => [savedReview, ...prevReviews]);
      setReviewText("");
      setSelectedFile(null);
      setLocation("");
    } catch (error) {
      console.error("Error submitting review:", error);
    }
  };
  

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
  

  const handleSortChange = (value) => {
    setSortOption(value);
  };


  useEffect(() => {
    // Fetch reviews from the database when the component mounts
    const fetchReviews = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_SERVER_URL}/reviews`);
        const fetchedReviews = response.data;

        // Filter the reviews based on the parkCode
        const reviewsForCurrentPark = fetchedReviews.filter(
          (review) => review.parkCode === parkCode
        );

        let sortedReviews = reviewsForCurrentPark;
        if (sortOption === "liked") {
          sortedReviews = reviewsForCurrentPark.sort(
            (b, a) => a.likes - b.likes
          );
        } else if (sortOption === "recent") {
          sortedReviews = reviewsForCurrentPark.sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
          );
        }


        setSortedReviews(sortedReviews);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    };

    fetchReviews();
  }, [parkCode, sortOption]);






  return (
    <>
    <div>

      <h2 className="mt-10 text-3xl font-bold tracking-tight text-gray-900  ">Write a Review</h2>
<div >
  <div>
    <br/>
  <h2 className="mt-2 text-md leading-8 text-gray-600 ">Where did you visit?</h2>
  </div>
      <input
        type="text"
        name="location"
        placeholder="Tag your location!"
        value={location}
        onChange={handleLocationChange}
        className="block mx-auto w-1/3 rounded-md border-0 py-1.5 pl-7 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-teal-600 sm:text-sm sm:leading-6"

      />
      </div>
      <br/>
   
      <h2 className="mt-2 text-md leading-8 text-gray-600 ">Write your review!</h2>
 <textarea
  type="text"
  rows={4}
  value={reviewText}
  onChange={handleReviewChange}
  cols={30}
  maxLength={450}
  name="review"
  id="review"
  className="block mx-auto w-1/3 rounded-md border-0 py-1.5 pl-7 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-teal-600 sm:text-sm sm:leading-6"
  placeholder="Share your experience with us!"
/>

      <br/>

      <div className="ml- 10 block mx-auto w-1/3 rounded-md text-gray-600">
      <span className="mt-2 text-md leading-8 text-gray-600 ">Add a photo:</span>
      {" "}
      <input className="mt-2 text-md  text-gray-600" type="file" name="image" accept="image/*" onChange={handleFileChange} />
      <br/>
      <br/>
      </div>
      <button className="flex-none rounded-md bg-teal-500 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-teal-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-500" onClick={handleSubmitReview}>Submit Review</button>

      {showSuccessMessage && (
        <p style={{ color: "green" }}>Review submitted successfully!</p>
      )}


<div className="mx-auto" style={{ maxWidth: "75%" }}>
        <div className="border-t border-gray-200 mt-10"></div>
      </div>

<h2 className="mt-10 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Submitted Reviews</h2>




<Listbox value={sortOption} onChange={setSortOption}>
  {({ open }) => (
    <div className="flex items-center space-x-5 mx-auto max-w-7xl px-6 lg:px-8">


      <span className="text-sm font-medium leading-10 text-gray-900">Sort by</span>
      <Listbox.Button className="relative cursor-default rounded-md bg-white py-1.5 px-8 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500 ">
  <span className="flex items-center">
    {sortOption === 'default' ? (
      <p>Select filter</p>
    ) : (
      <>
        <div className="flex ">
          {filter.find((opt) => opt.value === sortOption)?.avatar && (
            React.createElement(filter.find((opt) => opt.value === sortOption)?.avatar, {
              className: 'h-5 w-5 text-gray-600 group-hover:text-teal-600',
            })
          )}
        </div>
        <span className="ml-2 block truncate">
          {filter.find((option) => option.value === sortOption)?.name}
        </span>
      </>
    )}
  </span>
  <span className="pointer-events-none absolute inset-y-0 right-0 ml-1.5 flex items-center pr-1">
    <ChevronUpDownIcon className="h-6 w-6 text-gray-400" aria-hidden="true" />
  </span>
</Listbox.Button>



      <Transition
        show={open}
        as={Fragment}
        leave="transition ease-in duration-100"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >

<Listbox.Options className="absolute z-10 mt-2 w-40 max-h-60 overflow-auto rounded-md bg-white py-2 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm" >
  {filter.map((option) => (
    <Listbox.Option
      key={option.id}
      className={({ active }) =>
        classNames(
          active ? 'bg-teal-600 text-white' : 'text-gray-900',
          'relative cursor-default select-none py-2 pl-3 pr-9'
        )
      }
      value={option.value} 
    >
      {({ active }) => (
        <>
          <div className="flex items-center">
    
            <option.avatar
                          className="h-6 w-6 text-gray-600 group-hover:text-teal-600"
                          aria-hidden="true"
                        />
            <span
              className={classNames(active ? 'font-semibold' : 'font-normal', 'ml-3 block truncate')}
            >
              {option.name}
            </span>
          </div>

          {active ? (
            <span
            className={classNames(
              'text-white',
              'absolute inset-y-0 right-0 flex items-center pr-4'
            )}
          >
              <CheckIcon className="h-5 w-5" aria-hidden="true" />
            </span>
          ) : null}
        </>
      )}
    </Listbox.Option>
  ))}
</Listbox.Options>
</Transition>
          </div>
       
      )}
    </Listbox>
     
  


<ol>
  {paginatedReviews.map((review) => (
    <>
    <li
      key={review._id}
      className="flex items-start justify-between p-4  mb-4"
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
      
      <div className="mx-auto" style={{ maxWidth: "75%" }}>
        <div className="border-t border-gray-200 mt-10"></div>
      </div>

      
    </li>

    <div className="mx-auto" style={{ maxWidth: "75%" }}>
        <div className="border-t border-gray-200 mt-2"></div>
      </div>

    </>
    
  ))}
</ol>

<nav className="mt-10 mb-10" aria-label="Pagination">
            <ul className="flex justify-center">
              {Array.from({ length: totalPages }, (_, index) => (
                <li key={index}>
                  <button
                    className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
                      currentPage === index + 1
                        ? "bg-teal-600 text-white"
                        : "text-gray-900"
                    } ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0`}
                    onClick={() => handlePageChange(index + 1)}
                  >
                    {index + 1}
                  </button>
                </li>
              ))}
            </ul>
          </nav>

</div>
{/* Pop-up notification */}
{showLoginPopup && (
        <Notification onClose={() => setShowLoginPopup(false)} />
      )}

       {/* Display the like notification when needed */}
       {showLikeNotification && (
        <LikeNotification onClose={() => setShowLikeNotification(false)} />
      )}
    </>
  );
};

export default Reviews;




