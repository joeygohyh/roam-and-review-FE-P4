import { Link } from "react-router-dom";
import axios from "axios";
import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../components/auth/AuthProvider";
// 
// export default function Login() {
//   const navigate = useNavigate();
//   const { loginSuccess } = useContext(AuthContext);

//   // create state to store form data
//   const [formData, setFormData] = useState({});
//   const [errorMessage, setErrorMessage] = useState("");

//   // handle form change
//   const handleFormChange = (e, fieldName) => {
//     console.log(e.target.value);
//     setFormData({ ...formData, [fieldName]: e.target.value });
//   };

//   // handle form submit
//   const handleSubmit = (e) => {
//     e.preventDefault();
//     setErrorMessage("");

//     axios
//       .post(`http://localhost:3005/api/user/login`, formData)
//       .then((response) => {
//         loginSuccess(response.data.token);
//         navigate("/user/profile");
//       })
//       .catch((err) => {
//         if (err.response && err.response.data && err.response.data.message) {
//           setErrorMessage(err.response.data.message);
//         } else {
//           setErrorMessage("Incorrect login credentials. Please try again.");
//         }
//       });
//   };

export default function Login() {
  const navigate = useNavigate();
  const { loginSuccess } = useContext(AuthContext);

  const [formData, setFormData] = useState({});
  const [errorMessage, setErrorMessage] = useState("");

  const handleFormChange = (e, fieldName) => {
    setFormData({ ...formData, [fieldName]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMessage("");

    axios
      .post(`${process.env.REACT_APP_SERVER_URL}/user/login`, formData)
      .then((response) => {
        // Assuming response.data contains the token
        loginSuccess(response.data.token);

        // Fetch user profile after successful login
        axios
          .get(`${process.env.REACT_APP_SERVER_URL}/user/profile`, {
            headers: {
              Authorization: `Bearer ${response.data.token}`,
            },
          })
          .then((profileResponse) => {
            // You can do something with the profile data here
            console.log(profileResponse.data);
          })
          .catch((profileError) => {
            console.error("Error fetching profile:", profileError);
          });

        navigate("/user/profile");
      })
      .catch((err) => {
        if (err.response && err.response.data && err.response.data.message) {
          setErrorMessage(err.response.data.message);
        } else {
          setErrorMessage("Incorrect login credentials. Please try again.");
        }
      });
  };

  return (
    <>
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-1 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Please sign in your account
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form
            className="space-y-6"
            action="#"
            method="POST"
            onSubmit={handleSubmit}
          >
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Email address
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-teal-600 sm:text-sm sm:leading-6"
                  onChange={(e) => {
                    handleFormChange(e, "email");
                  }}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Password
                </label>
                <div className="text-sm">
                </div>
              </div>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-teal-600 sm:text-sm sm:leading-6"
                  onChange={(e) => {
                    handleFormChange(e, "password");
                  }}
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="mb-5 flex w-full justify-center rounded-md bg-teal-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-teal-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600"
              >
                Sign in
              </button>
            </div>
          </form>

          {errorMessage && (
            <div className="mt-2 text-red-600 text-sm text-center">
              {errorMessage}
            </div>
          )}
          <p className="mt-5 text-center text-sm text-gray-500">
            Not a member?{" "}
            <Link
              to="/user/register"
              className="font-semibold leading-6 text-teal-600 hover:text-teal-500"
            >
              Sign up now
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}
