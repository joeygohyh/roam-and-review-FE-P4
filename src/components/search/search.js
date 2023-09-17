import React, { useState, useEffect } from "react";
// import { API_KEY } from "./config";
import { Link, Route, Routes, useNavigate } from "react-router-dom";
import Detail from "../detail";

const Search = () => {
  const [searchValue, setSearchValue] = useState("");
  const [parks, setParks] = useState([]);
  const [expandedStates, setExpandedStates] = useState([]);

  const navigate = useNavigate();

  const toggleExpand = (index) => {
    setExpandedStates((prevState) => {
      const updatedStates = [...prevState];
      updatedStates[index] = !updatedStates[index];
      return updatedStates;
    });
  };

  const fetchParks = async () => {
    const apiKey = process.env.API_KEY;
    const url = `https://developer.nps.gov/api/v1/parks?q=${searchValue}&api_key=${apiKey}`;

    try {
      const res = await fetch(url, {
        method: "GET",
        headers: {
          accept: "application/json",
        },
      });

      if (res.ok) {
        const json = await res.json();
        const parkData = json.data;

        // Move the result with the search term "yosemite" to the first position
        const sortedParks = [
          ...parkData.filter((park) =>
            park.fullName.toLowerCase().includes(searchValue)
          ),
          ...parkData.filter(
            (park) => !park.fullName.toLowerCase().includes(searchValue)
          ),
        ];

        setParks(sortedParks);
      } else {
        console.error("Error fetching parks:", res.statusText);
      }
    } catch (error) {
      console.error("Error fetching parks:", error);
    }
  };

  // useEffect(() => {
  //   fetchParks();
  // }, [searchValue]);

  const handleSearch = () => {
    fetchParks(); // Trigger the fetchParks function when the search button is clicked
  };

  return (
    <>
      {" "}
      <div className="flex justify-center items-center mt-5">
        <div className="max-w-xl lg:max-w-lg mt-5 lg:mt-2">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Discover. Explore. Review.
            </h2>
            <p className="mt-2 text-lg leading-8 text-gray-600">
              Are you ready to immerse yourself in the breathtaking beauty of
              nature? Look no further, search for a National Park now!
            </p>
          </div>
          <div className=" border-t border-gray-200 pt-5 sm:mt-5 sm:pt-5 lg:mx-0 lg:max-w-none lg:grid-cols-3"></div>

          <div className="mt-6 flex max-w-md gap-x-4">
            <label htmlFor="email-address" className="sr-only">
              enter national park here
            </label>
            <input
              type="text"
              placeholder="enter national park here"
              className="min-w-0 flex-auto rounded-md border-0 bg-white/5 px-3.5 py-2 text-black shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-teal-500 sm:text-sm sm:leading-6"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
            />

            <button
              onClick={handleSearch}
              className="flex-none rounded-md bg-teal-500 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-teal-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-500"
            >
              Search
            </button>
          </div>
        </div>
        <div
          className="absolute left-1/2 top-0 -z-10 -translate-x-1/2 blur-3xl xl:-top-6"
          aria-hidden="true"
        ></div>
      </div>
      <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-8 mt-10">
        {parks.map((park, index) => (
          <li key={park.id}>
            {/* <h2>{park.fullName}</h2> */}
            <Link
              to={`/park/${park.parkCode}`}
              className="relative z-5 rounded-full bg-gray-50 px-3 py-1.5 font-medium text-gray-900 hover:bg-gray-100 mt-5 "
            >
              {park.fullName}
            </Link>
            <br />
            <p className="mt-1 mb-1 text-sm leading-6 text-gray-600  ">
              State: {park.states} || Park Code: {park.parkCode}
            </p>
            <img
              src={park.images[0]?.url}
              alt="[sorry, no image available.]"
              className="mx-auto"
              style={{ width: "450px", height: "400px" }} // Adjust the size here
            />

            <p
              className={`mx-auto mt-2 text-sm leading-6 text-gray-600 max-w-[450px] ${
                expandedStates[index] ? "" : "line-clamp-5"
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

            <br />

            <div className="mx-auto border-t border-gray-200  max-w-[450px] "></div>
            <br />
          </li>
        ))}
      </ul>
    </>
  );
};

export default Search;
