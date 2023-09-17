
import React from "react";
import { Link } from "react-router-dom";

export default function Home() {
  

  return (
    <>
      <div className="bg-white">
        <div className="mx-auto max-w-6xl py-24 sm:px-6 sm:py-16 lg:px-8">
          <div className="relative isolate overflow-hidden bg-white-900 px-6 pt-16  sm:rounded-3xl sm:px-16 md:pt-24 lg:flex lg:gap-x-20 lg:px-24 lg:pt-0">
            
            <div className="mx-auto max-w-md text-center lg:mx-0 lg:flex-auto lg:py-20 lg:text-left">
              <h2 className="text-5xl font-bold tracking-tight text-black sm:text-1xl">
                Welcome to Roam & Review
              </h2>
              <br/>
              <h3 className="text-3xl font-bold tracking-tight text-black sm:text-1xl"> 
              Discover.   Explore.    Review.
              </h3>
              <br/>
                <p className="text-1xl tracking-tight text-black sm:text-1xl">
                  When it comes to National Parks, the reviews are 'rock'-solid. 
                  </p>
             
              <div className="mt-9 mb-10 flex items-center justify-center gap-x-6 lg:justify-start">
                <Link to="/user/login"
                    className="flex-none rounded-md bg-teal-500 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-teal-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-500"

                >
                  login
                </Link>
                <Link id="buttonstart" to="/search"   className="flex-none rounded-md bg-teal-500 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-teal-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-500"
>
                search
                </Link>
              </div>
            </div>
            <div className="relative ml-auto h-auto lg:mt-24">
        
            </div>
          </div>
        </div>
      </div>
    </>
  );

  }
