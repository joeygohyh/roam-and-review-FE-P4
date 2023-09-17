// export default Detail;
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
// import { API_KEY } from "./config";
import VisitorCenters from "./VisitorCenters";
import ThingsToDo from "./ThingsToDo";
import Reviews from "./Reviews";
import Campgrounds from "./Campgrounds";

const Detail = () => {
  const { parkCode } = useParams();
  const [parkDetails, setParkDetails] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  useEffect(() => {
    const apiKey = process.env.API_KEY;


    fetch(
      `https://developer.nps.gov/api/v1/parks?parkCode=${parkCode}&api_key=${apiKey}`
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error("API request failed");
        }
        return response.json();
      })
      .then((data) => {
        // console.log("Fetched Park Data:", data);
        if (data.data && data.data.length > 0) {
          setParkDetails(data.data[0]);
        }
      })
      .catch((error) => {
        console.error("Error fetching national park details:", error);
      });
  }, [parkCode]);

  // console.log("Park Details:", parkDetails);
  const nextImage = () => {
    setCurrentImageIndex(
      (prevIndex) => (prevIndex + 1) % parkDetails.images.length
    );
  };

  const prevImage = () => {
    setCurrentImageIndex(
      (prevIndex) =>
        (prevIndex - 1 + parkDetails.images.length) % parkDetails.images.length
    );
  };

  return (
    <>
      {parkDetails ? (
        <>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            {parkDetails.fullName}
          </h2>
          <div className="max-w-5xl mx-auto py-5">
            <p className="mt-2 text-lg leading-8 text-gray-600">
              {parkDetails.description}
            </p>
          </div>

          <div style={{ display: "flex" }}>
            {/* Left column: Park name and description */}
            <div style={{ flex: 1, paddingLeft: "110px", paddingTop: "40px" }}>
              <br />
              <br />

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginTop: "0rem",
                }}
              >
                {/* Left section: Operating Hours */}
                <div style={{ flex: 1, marginRight: "2rem" }}>
                  <div className="text-left">
                    <h2 className="mt-4 text-lg font-medium text-gray-900 underline">
                      Operating Hours:
                    </h2>
                    <p className="mt-2 line-clamp-5 text-md leading-6 text-gray-600">
                      {parkDetails.operatingHours[0]?.description}
                    </p>

                    <br />
                    <ul className="list-disc list-inside">
                      {[
                        "monday",
                        "tuesday",
                        "wednesday",
                        "thursday",
                        "friday",
                        "saturday",
                        "sunday",
                      ].map((day) => (
                        <li
                          className="mx-auto mt-2 line-clamp-5 text-md leading-6 text-gray-600"
                          key={day}
                        >
                          <strong>{capitalizeFirstLetter(day)}:</strong>{" "}
                          {parkDetails.operatingHours[0]?.standardHours[day]}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Right section: Entrance Fees */}
                <div style={{ flex: 1, marginLeft: "2rem" }}>
                  <div className="text-left">
                    <div>
                      <h2 className="mt-4 text-lg font-medium text-gray-900 underline">
                        Getting here:
                      </h2>
                      <p className="mt-2 text-md leading-6 text-gray-600 un">
                        {parkDetails.directionsInfo}
                      </p>
                    </div>
                    <br />
                    {parkDetails.entranceFees &&
                      parkDetails.entranceFees.length > 0 && (
                        <div>
                          <h2 className="mt-4 text-lg font-medium text-gray-900 underline">
                            Entrance Fees:
                          </h2>
                          <ul className="list-disc list-inside">
                            {parkDetails.entranceFees
                              .filter(
                                (fee) =>
                                  fee.title === "Entrance - Private Vehicle" ||
                                  fee.title === "Entrance - Per Person"
                              )
                              .map((fee, index) => (
                                <li
                                  key={index}
                                  className="mx-auto mt-2 line-clamp-5 text-md leading-6 text-gray-600"
                                >
                                  <strong>
                                    {fee.title.replace("Entrance - ", "")}
                                  </strong>
                                  : ${fee.cost}
                                </li>
                              ))}
                          </ul>
                        </div>
                      )}
                  </div>
                </div>
              </div>
            </div>

            {/* Right column: Images */}
            <div style={{ flex: 1, paddingRight: "20px" }}>
              <br />
              <br />
              <br />

              {/* <button onClick={prevImage}>prev</button> */}
              <img
                src={parkDetails.images[currentImageIndex]?.url}
                // alt={parkDetails.images[currentImageIndex]?.altText}
                alt="[sorry, no image available.]"
                className="mx-auto"
                style={{ width: "450px", height: "450px" }}
              />
              <p className="mx-auto mt-2 line-clamp-5 text-md leading-6 text-gray-600">
                {parkDetails.images[currentImageIndex].title}
              </p>
              {/* <button onClick={nextImage}>next</button> */}

              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  marginTop: "10px",
                }}
              >
                {parkDetails.images.map((image, index) => (
                  <img
                    key={index}
                    src={image.url}
                    // alt={image.altText}
                    alt="[sorry, no image available.]"
                    onClick={() => setCurrentImageIndex(index)}
                    style={{
                      width: "30px",
                      height: "30px",
                      margin: "2px",
                      cursor: "pointer",
                      opacity: index === currentImageIndex ? 1 : 0.5,
                      transition: "opacity 0.3s",
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </>
      ) : (
        <p>Loading...</p>
      )}
      <div className="mx-auto" style={{ maxWidth: "75%" }}>
        <div className=" border-t border-gray-200 mt-10"></div>
      </div>
      <ThingsToDo parkCode={parkCode} />
      {/* <div className="border-t border-gray-200 pt-5 sm:mt-5 sm:pt-5"></div> */}
      <div className="mx-auto" style={{ maxWidth: "75%" }}>
        <div className="border-t border-gray-200 mt-10"></div>
      </div>
      <Campgrounds parkCode={parkCode} />
      {/* <div className="border-t border-gray-200 pt-5 sm:mt-5 sm:pt-5"></div> */}
      <div className="mx-auto" style={{ maxWidth: "75%" }}>
        <div className="border-t border-gray-200 mt-10"></div>
      </div>
      <VisitorCenters parkCode={parkCode} />
      {/* <div className="border-t border-gray-200 pt-5 sm:mt-5 sm:pt-5"></div> */}
      <div className="mx-auto" style={{ maxWidth: "75%" }}>
        <div className="border-t border-gray-200 mt-10"></div>
      </div>
      <Reviews parkCode={parkCode} />
    </>
  );
};

export default Detail;
