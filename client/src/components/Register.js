import React, { useState } from "react";
import Login from "./Login";
import { register } from "../api/CarApi";
import { Cities } from "../res/Cities";
import Select from "react-select";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

export default function Register({ onClose, openLogin, setUserImage }) {
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

  const handleCityChange = (selectedOption) => {
    setCity(selectedOption.value);
    setCityName(selectedOption.label);
    setSelectedCityLabel(selectedOption.label);
  };

  const handleImageUpload = (event) => {
    setProfilePicture(event.target.files[0]);
  };

  const notify = (message) => toast(message);

  const handleRegister = (e) => {
    e.preventDefault();

    // Validate the password match
    if (password !== verifyPassword) {
      console.log("The passwords you entered dont match try again.");
      return;
    }

    // Create a new FormData instance
    const formData = new FormData();
    formData.append("profileImage", profilePicture);

    // Send the form data with the image to the server for registration
    axios
      .post("http://localhost:3001/user/uploadProfileImage", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        const { fileUrl } = response.data;
        const pathname = new URL(fileUrl).pathname;
        const filename = pathname.substring(pathname.lastIndexOf("/") + 1);
        setUserImage(filename);
        const registerInfo = {
          id: governmentId,
          phone_number: phoneNumber,
          driving_license: drivingLicense,
          picture: filename,
          email: email,
          password: password,
          city_code: city,
          city_name: city_name, // Add the city name to the registerInfo object
          street_name: streetName,
          first_name: firstName,
          last_name: lastName,
        };
    
        // After successful image upload, proceed with registration
        register(registerInfo)
          .then((res) => {
            notify(res.data.message);
            onClose();
          })
          .catch((err) => notify(err.data.message));
      })
      .catch((error) => {
        console.error(error);
      });
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
              pattern="^[a-zA-Z]{2,}$"
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block mb-2">Last Name</label>
            <input
              type="text"
              className="border border-gray-300 px-4 py-2 rounded-md w-full"
              value={lastName}
              pattern="^[a-zA-Z]{2,}$"
              onChange={(e) => setLastName(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block mb-2">Email Address</label>
            <input
              type="email"
              className="border border-gray-300 px-4 py-2 rounded-md w-full"
              value={email}
              pattern="^[^\s@]+@[^\s@]+\.[^\s@]+$"
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block mb-2">Phone Number</label>
            <input
              type="tel"
              className="border border-gray-300 px-4 py-2 rounded-md w-full"
              value={phoneNumber}
              pattern="^05\d{1}-?\d{7}$"
              onChange={(e) => setPhoneNumber(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block mb-2">Password</label>
            <input
              type="password"
              pattern="(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}"
              className="border border-gray-300 px-4 py-2 rounded-md w-full"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block mb-2">Verify Password</label>
            <input
              type="password"
              className="border border-gray-300 px-4 py-2 rounded-md w-full"
              value={verifyPassword}
              onChange={(e) => setVerifyPassword(e.target.value)}
              required
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
              required
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
            <label className="block mb-2">Profile Picture</label>
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
              pattern="^\d{9}$"
              required
              onChange={(e) => setGovernmentId(e.target.value)}
            />
          </div>
          <div>
            <label className="block mb-2">Driving License</label>
            <input
              type="text"
              className="border border-gray-300 px-4 py-2 rounded-md w-full"
              value={drivingLicense}
              required
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
      </form>
      {showLogin && <Login onClose={toggleLogin} />}
    </div>
  );
}
