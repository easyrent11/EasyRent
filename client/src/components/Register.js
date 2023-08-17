import React, { useState } from "react";
import Login from "./Login";
import { register, checkUserDetailsExist } from "../api/UserApi";
import { Cities } from "../res/Cities";
import Select from "react-select";
import axios from "axios";
import { notify } from "../HelperFunctions/Notify";


export default function Register({ onClose, openLogin,setAllUsers }) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [profilePicture, setProfilePicture] = useState(null);
  const [verifyPassword, setVerifyPassword] = useState("");
  const [city, setCity] = useState("");
  const [city_name, setCityName] = useState("");
  const [selectedCityLabel, setSelectedCityLabel] = useState("Choose a city");
  const [streetName, setStreetName] = useState("");
  const [governmentId, setGovernmentId] = useState("");
  const [drivingLicense, setDrivingLicense] = useState("");
  const [showLogin, setShowLogin] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [profileUrl, setProfileUrl] = useState(null);

  const handleCityChange = (selectedOption) => {
    setCity(selectedOption.value);
    setCityName(selectedOption.label);
    setSelectedCityLabel(selectedOption.label);
    console.log(city);
  };

  const handleImageUpload = (event) => {
    setProfilePicture(event.target.files[0]);
  };

  function userDetailsEmpty() {
    if (
      firstName === "" ||
      lastName === "" ||
      email === "" ||
      phoneNumber === "" ||
      password === "" ||
      verifyPassword === "" ||
      city === "" ||
      streetName === "" ||
      governmentId === "" ||
      drivingLicense === ""
    ) {
      return true;
    }
    return false;
  }


  const handleRegister = (e) => {
    e.preventDefault();

    // Check if user details arent null
    if (userDetailsEmpty()) {
      setErrorMessage("Please fill out all fields (picture is optional)")
      return;
    }
    // Validation functions for register fields.
    const validateName = (name) => /^[a-zA-Z]{2,}$/.test(name);
    const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const validatePhoneNumber = (phoneNumber) => /^05\d{1}-?\d{7}$/.test(phoneNumber);
    const validatePassword = (password) => /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}/.test(password);
    const validateGovernmentId = (governmentId) => /^\d{9}$/.test(governmentId);
    const validateDrivingLicense = (drivingLicense) => /^\d{9}$/.test(drivingLicense);
    // const validateStreetName = (streetName) => /^[a-zA-Z][a-zA-Z\d\s-]*$/.test(streetName);
    
    const validateForm = () => {
      let errors = {};

      if (!validateName(firstName)) {
        errors.firstName = "Invalid first name,it must be only letters";
      }

      if (!validateName(lastName)) {
        errors.lastName = "Invalid last name, it must be only letters";
      }

      if (!validateEmail(email)) {
        errors.email = "Invalid email address";
      }

      if (!validatePhoneNumber(phoneNumber)) {
        errors.phoneNumber = "Invalid phone number,it must be an israeli phone number format";
      }

      if (!validatePassword(password)) {
        errors.password = "Invalid password, it must have both uppercase/lowercase letters, numbers and symbols";
      }

      if (password !== verifyPassword) {
        errors.passwordNotMatch = "You entered 2 different passwords";
      }
      if (!validateGovernmentId(governmentId)) {
        errors.governmentId = "Invalid government ID, it must be 9 digits";
      }

      if (!validateDrivingLicense(drivingLicense)) {
        errors.drivingLicense = "Invalid driving license, it must be 9 digits";
      }
      // if(!validateStreetName(streetName)){
      //   errors.streetName = "Invalid Street Name, must be only letters and spaces and digits"
      // }
      return errors;
    };

    const errors = validateForm();
    if(Object.keys(errors).length > 0){
      const errMsg = errors[Object.keys(errors)[0]];
      setErrorMessage(errMsg);
      return;
    }
 
    // building the important user details to be checked if they exist or not.
    const userDetails = {
      email: email,
      Id: governmentId,
      phoneNumber: phoneNumber,
      drivingLicense: drivingLicense,
    };
    checkUserDetailsExist(userDetails)
      .then((res) => {
        const existingFields = res.data.results;
        if (Object.keys(existingFields).length > 0) {
          if (Object.keys(existingFields)[0] === "Id") {
            setErrorMessage("The user already exists try logging in or resetting your password");
          }
          else {
            setErrorMessage(`${Object.keys(existingFields)[0]} Already Exists`);
          }
          return;
        }

        const formData = new FormData();
        formData.append("profileImage", profilePicture);

        axios
          .post("http://localhost:3001/user/uploadProfileImage", formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          })
          .then((response) => {
            if (response.data.fileUrl == null) {
              setProfileUrl("default.jpg");
            } else {
              const { fileUrl } = response.data;
              const pathname = new URL(fileUrl).pathname;
              const filename = pathname.substring(pathname.lastIndexOf("/") + 1);
              setProfileUrl(filename);
            }

            const registerInfo = {
              id: governmentId,
              phone_number: phoneNumber,
              driving_license: drivingLicense,
              picture: profileUrl,
              email: email,
              password: password,
              city_code: city,
              city_name: city_name,
              street_name: streetName,
              first_name: firstName,
              last_name: lastName,
            };
            // After successful image upload, proceed with registration
            register(registerInfo)
              .then((res) => {
                setAllUsers((prevUsers) => [...prevUsers, res.data.user]);
                notify("success", res.data.message);
                onClose();
              })
              .catch((err) => notify("error",err.data.message));
          })
          .catch((error) => {
            console.error(error);
          });
      })
      .catch((error) => {
        console.log(error);
      })
  };

  const toggleLogin = () => {
    setShowLogin(!showLogin);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-opacity-50 bg-gray-900">
      <form className="bg-[#E7E7E7] max-w-lg p-6 mx-auto rounded-lg">
        <div className="flex justify-end">
          <button
            type="button"
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg"
            onClick={onClose}
          >
            X
          </button>
        </div>
        <h2 className="text-2xl font-bold text-center mb-4">Register</h2>
        <p className="text-center mb-4">
          Already have an account?
          <button className="p-2 text-[#CC6200]" onClick={openLogin}>
            Log in
          </button>
        </p>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block mb-2">First Name</label>
            <input
              type="text"
              className="border border-gray-300 px-4 py-2 rounded-md w-full"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </div>
          <div>
            <label className="block mb-2">Last Name</label>
            <input
              type="text"
              className="border border-gray-300 px-4 py-2 rounded-md w-full"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>
          <div>
            <label className="block mb-2">Email Address</label>
            <input
              type="email"
              className="border border-gray-300 px-4 py-2 rounded-md w-full"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="block mb-2">Phone Number</label>
            <input
              type="tel"
              className="border border-gray-300 px-4 py-2 rounded-md w-full"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
          </div>
          <div>
            <label className="block mb-2">Password</label>
            <input
              type="password"
              className="border border-gray-300 px-4 py-2 rounded-md w-full"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div>
            <label className="block mb-2">Verify Password</label>
            <input
              type="password"
              className="border border-gray-300 px-4 py-2 rounded-md w-full"
              value={verifyPassword}
              onChange={(e) => setVerifyPassword(e.target.value)}
            />
          </div>
          <div>
            <label className="block mb-2">Choose a City</label>
            <Select
              className="border border-gray-300 px-4 py-2 rounded-md w-full"
              id="city"
              value={{ value: city, label: selectedCityLabel }}
              onChange={handleCityChange}
              noOptionsMessage={() => "Not Found"}
              options={Cities}
            />
          </div>
          <div>
            <label className="block mb-2">Street Name </label>
            <input
              type="text"
              className="border border-gray-300 px-4 py-2 rounded-md w-full"
              value={streetName}
              onChange={(e) => setStreetName(e.target.value)}
            />
          </div>
          <div>
            <label className="block mb-2">Profile Picture *(optional)*</label>
            <input
              type="file"
              className="border border-gray-300 px-4 py-2 rounded-md w-full"
              name="profilepicture"
              onChange={handleImageUpload}
            />
          </div>
          <div>
            <label className="block mb-2">Government ID</label>
            <input
              type="text"
              className="border border-gray-300 px-4 py-2 rounded-md w-full"
              value={governmentId}
              onChange={(e) => setGovernmentId(e.target.value)}
            />
          </div>
          <div>
            <label className="block mb-2">Driving License</label>
            <input
              type="text"
              className="border border-gray-300 px-4 py-2 rounded-md w-full"
              value={drivingLicense}
              onChange={(e) => setDrivingLicense(e.target.value)}
            />
          </div>
        </div>
        <button
          type="submit"
          onClick={handleRegister}
          className="bg-[#CC6200] text-white px-4 py-2 rounded-md w-full"
        >
          Register
        </button>
        <p className="text-center text-red-700 font-bold">{errorMessage}</p>
      </form>
      {showLogin && <Login onClose={toggleLogin} />}
    </div>
  );
}
