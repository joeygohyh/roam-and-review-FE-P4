

import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../components/auth/AuthProvider";

export default function Profile() {
  const { logoutSuccess, getUserToken } = useContext(AuthContext);
  const [userDetail, setUserDetails] = useState({});

  useEffect(() => {
    // Get the user token from the AuthContext
    const userToken = getUserToken();

    if (userToken) {
      // Set the authorization header with the token
      axios.defaults.headers.common["Authorization"] = `Bearer ${userToken}`;

      // Make the API call
      axios
      .get(`${process.env.REACT_APP_SERVER_URL}/user/profile`)
        .then((response) => {
          setUserDetails(response.data);
        })
        .catch((err) => {
          console.log("Failed to get user details");
        });
    }
  }, [getUserToken]);

  return (
    <>
      <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
             User Profile
             </h2>
             <p className="mt-2 text-lg leading-8 text-gray-600">
               Your personal information
             </p>
          <div className="mx-auto" style={{ maxWidth: '20%' }}>
       <div className="border-t border-gray-200 pt-5 sm:mt-5 sm:pt-5"></div>
    </div>
         

          
 </div>
      <div className="container mx-auto px-4 my-4 sm:w-1/2">
     

       
        <form>
          <div className="space-y-12">


      

            <div className="border-b border-gray-900/10 pb-12">
              <h2 className="text-base font-semibold leading-7 text-gray-900">
                Name
              </h2>
              <p className="mt-1 text-sm leading-6 text-gray-600">
                {userDetail.name}
                {/* {userDetail.profilePicture} */}
              </p>

            </div>

            <div className="border-b border-gray-900/10 pb-12">
              <h2 className="text-base font-semibold leading-7 text-gray-900">
                Email
              </h2>
              <p className="mt-1 text-sm leading-6 text-gray-600">
                {userDetail.email}
              </p>
            </div>
{/* 
            <div className="border-b border-gray-900/10 pb-12">
              <h2 className="text-base font-semibold leading-7 text-gray-900">
                Password
              </h2>
              <p className="mt-1 text-sm leading-6 text-gray-600">********</p>
            </div> */}

            <div className="border-b border-gray-900/10 pb-12">
              <h2 className="text-base font-semibold leading-7 text-gray-900">
                Username
              </h2>
              <p className="mt-1 text-sm leading-6 text-gray-600">{userDetail.username}</p>
            </div>

            <div className="border-b border-gray-900/10 pb-12">
              <h2 className="text-base font-semibold leading-7 text-gray-900">
                Country
              </h2>
              <p className="mt-1 text-sm leading-6 text-gray-600">{userDetail.country}</p>
            </div>

            <div className="border-b border-gray-900/10 pb-12">
              <h2 className="text-base font-semibold leading-7 text-gray-900">
                Gender
              </h2>
              <p className="mt-1 text-sm leading-6 text-gray-600">{userDetail.gender}</p>
            </div>


          </div>
          
          <div className="mt-6 flex items-center justify-end gap-x-6">
            {/* <Link to="/user/update">
              {" "}
              <button
                type="button"
                className="rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
              >
                Edit profile
              </button>
            </Link> */}
            <button
              type="button"
              className="rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
              onClick={logoutSuccess}
            >
              Logout
            </button>
          </div>
        </form>
      </div>
    </>
  );
}




// import axios from "axios";
// import { useContext, useEffect, useState } from "react";
// import { Link } from "react-router-dom";
// import { AuthContext } from "../components/auth/AuthProvider";

// export default function Profile() {
//   const { logoutSuccess, getUserToken } = useContext(AuthContext);
//   const [userDetail, setUserDetails] = useState({});

//   useEffect(() => {
//     // Get the user token from the AuthContext
//     const userToken = getUserToken();

//     if (userToken) {
//       // Set the authorization header with the token
//       axios.defaults.headers.common["Authorization"] = `Bearer ${userToken}`;

//       // Make the API call
//       axios
//       .get(`http://localhost:3005/api/user/profile`)
//         .then((response) => {
//           setUserDetails(response.data);
//         })
//         .catch((err) => {
//           console.log("Failed to get user details");
//         });
//     }
//   }, [getUserToken]);

//   return (
//     <>

// <div className="text-left" >
  
//      <div className="text-center">
//             <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
//               User Profile
//             </h2>
//             <p className="mt-2 text-lg leading-8 text-gray-600">
//               Your personal information
//             </p>
//           <div className="mx-auto" style={{ maxWidth: '20%' }}>
//       <div className="border-t border-gray-200 pt-5 sm:mt-5 sm:pt-5"></div>
//     </div>
//           </div>

          
//   </div>
//   <div class="mt-6 border-t border-gray-100">
//     <dl class="divide-y divide-gray-100">
//       <div class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
//         <dt class="text-sm font-medium leading-6 text-gray-900"
//          style={{margin: '5px' }} >Name</dt>
//         <dd class="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">  {userDetail.name}</dd>
//       </div>
//       <div class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
//         <dt class="text-sm font-medium leading-6 text-gray-900 ">Username</dt>
//         <dd class="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">{userDetail.username}</dd>
//       </div>
//       <div class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
//         <dt class="text-sm font-medium leading-6 text-gray-900">Email</dt>
//         <dd class="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0"> {userDetail.email}</dd>
//       </div>
      
//       <div class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
//         <dt class="text-sm font-medium leading-6 text-gray-900">Country</dt>
//         <dd class="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">{userDetail.country}</dd>
//       </div>
//       <div class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
//         <dt class="text-sm font-medium leading-6 text-gray-900">Gender</dt>
//         <dd class="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">{userDetail.gender}</dd>
//       </div>
     
      
//     </dl>
//   </div>

//   <button
//               type="button"
//               className="rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
//               onClick={logoutSuccess}
//             >
//               Logout
//             </button>

// </>
//   )
// }
