import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import validator from "validator";

export default function Register() {
  const navigate = useNavigate();

  // create state to store form data and error messages
  // const [formData, setFormData] = useState({});
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    country: "",
    gender: "",
    profilePicture: "", // Initialize with null
  });
  const [errors, setErrors] = useState({});

  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [country, setCountry] = useState(""); // New state for country
  const [gender, setGender] = useState(""); 
  const [profilePicture, setProfilePicture] = useState(null);
  const defaultProfilePictureUrl = "../default.jpeg";


  // handle form change
  const handleFormChange = (e, fieldName) => {
    setFormData({ ...formData, [fieldName]: e.target.value });
  };

  // const handleProfilePictureChange = (event) => {
  //   const selectedFile = event.target.files[0];
  //   setProfilePicture(selectedFile);
  // };

  const handleProfilePictureChange = (event) => {
    const selectedFile = event.target.files[0];
    setFormData({ ...formData, profilePicture: selectedFile }); // Update profilePicture in form data
  };

  

 

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Create FormData object and append form fields
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("username", formData.username);
      formDataToSend.append("email", formData.email);
      formDataToSend.append("password", formData.password);
      formDataToSend.append("country", formData.country);
      formDataToSend.append("gender", formData.gender);
      formDataToSend.append("profilePicture", formData.profilePicture);

      // Make POST request
      const response = await axios.post(
        `${process.env.REACT_APP_SERVER_URL}/user/register`,
        formDataToSend
      );

      navigate("/user/login");
    } catch (error) {
      if (error.response && error.response.data && error.response.data.errors) {
        setErrors(error.response.data.errors);
      } else {
        console.error(error);
      }
    }
  };



  return (
    <>
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-1 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Sign up for an account
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

            <input
  type="file"
  id="profile-picture"
  name="profilePicture"
  accept="image/*"
  onChange={handleProfilePictureChange}
/>
{profilePicture ? (
  <img
    src={URL.createObjectURL(profilePicture)}
    // alt="Profile Preview"
    alt="[sorry, no image available.]"
    style={{ maxWidth: "100px" }}
  />
) : (
  <img
    src={defaultProfilePictureUrl}
    // alt="Default Profile"
    // alt="[sorry, no image available.]"
    style={{ maxWidth: "100px" }}
  />
)}



            <div className="flex items-center justify-between">
              <label
                htmlFor="name"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Name
              </label>
              </div>
              <div className="mt-2">
                <input
                  id="name"
                  name="name"
                  type="name"
                  autoComplete="name"
                  required
                  className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-teal-600 sm:text-sm sm:leading-6"
                  onChange={(e) => {
                    handleFormChange(e, "name");
                  }}
                />
              </div>
              {nameError && (
                <p className="text-red-500 text-xs mt-1">{nameError}</p>
              )}
            </div>

            <div>
            <div className="flex items-center justify-between">
              <label
                htmlFor="name"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Username
              </label>
              </div>
              <div className="mt-2">
                <input
                  id="username"
                  name="username"
                  type="username"
                  autoComplete="username"
                  required
                  className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-teal-600 sm:text-sm sm:leading-6"
                  onChange={(e) => {
                    handleFormChange(e, "username");
                  }}
                />
              </div>
              {nameError && (
                <p className="text-red-500 text-xs mt-1">{nameError}</p>
              )}
            </div>

            <div>
            <div className="flex items-center justify-between">
              <label
                htmlFor="email"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Email address
              </label>
              </div>
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
              {emailError && (
                <p className="text-red-500 text-xs mt-1">{emailError}</p>
              )}
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Password
                </label>
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
              {passwordError && (
                <p className="text-red-500 text-xs mt-1">{passwordError}</p>
              )}
            </div>


            <div>
            <div className="flex items-center justify-between">

        <label
          htmlFor="country"
          className="block text-sm font-medium leading-6 text-gray-900"
        >
          Where are you from?
        </label>
        </div>
        <div className="mt-2">
          <input
            id="country"
            name="country"
            type="text"
            autoComplete="country"
            required
            className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-teal-600 sm:text-sm sm:leading-6"
            onChange={(e) => {
              handleFormChange(e, "country");
            }}
          />
        </div>
      </div>
      
      <div>
      <div className="flex items-center justify-between">
  <label
    htmlFor="gender"
    className="block text-sm font-medium leading-6 text-gray-900"
  >
    Gender
  </label>
</div>
<div className="mt-2">
  <select
    id="gender"
    name="gender"
    className="h-full rounded-md border-0 bg-transparent py-0 pl-2 pr-7 text-gray-500 focus:ring-2 focus:ring-inset focus:ring-teal-600 sm:text-sm"
    onChange={(e) => {
      handleFormChange(e, "gender");
    }}
  >
    <option value="">Select Gender</option>
    <option value="female">Female</option>
    <option value="male">Male</option>
    <option value="other">Prefer Not to Say</option>
  </select>
</div>
       
      </div>

            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-teal-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-teal-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600"
              >
                Sign up
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}


 // // handle form submit
  // const handleSubmit = (e) => {
  //   e.preventDefault();

  //   const { name, email, password } = formData;
    

  //   // Validate the form fields
  //   if (!validator.isLength(name, { min: 3, max: 100 })) {
  //     setNameError("Name must be between 3 and 100 characters.");
  //     return;
  //   } else {
  //     setNameError("");
  //   }

  //   if (!validator.isEmail(email)) {
  //     setEmailError("Invalid email address.");
  //     return;
  //   } else {
  //     setEmailError("");
  //   }

  //   if (
  //     !validator.matches(
  //       password,
  //       /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
  //     )
  //   ) {
  //     setPasswordError(
  //       "Password must contain at least one lowercase letter, one uppercase letter, one digit, and one special character. Password must be at least 8 characters long."
  //     );
  //     return;
  //   } else {
  //     setPasswordError("");
  //   }

  //   // If the form data passes validation, make the POST request
  //   axios
  //     .post(`http://localhost:3005/api/user/register`, formData)
  //     .then((response) => {
  //       navigate("/user/login");
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //     });
  // };