import React, { useState } from "react";
import Login from "./Login";

export default function Register({ onClose, openLogin }) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [verifyPassword, setVerifyPassword] = useState("");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [profilePicture, setProfilePicture] = useState("");
  const [governmentId, setGovernmentId] = useState("");
  const [drivingLicense, setDrivingLicense] = useState("");

  const [showLogin, setShowLogin] = useState(false);

  const handleRegister = () => {
    console.log("Registered");
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
            <input
              type="text"
              className="border border-gray-300 px-4 py-2 rounded-md w-full"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
          </div>
          <div>
            <label className="block mb-2">Full Address</label>
            <input
              type="text"
              className="border border-gray-300 px-4 py-2 rounded-md w-full"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>
          <div>
            <label className="block mb-2">Profile Picture</label>
            <input
              type="file"
              className="border border-gray-300 px-4 py-2 rounded-md w-full"
              value={profilePicture}
              onChange={(e) => setProfilePicture(e.target.value)}
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
          className="bg-[#CC6200] text-white px-4 py-2 rounded-md w-full"
          onClick={handleRegister}
        >
          Register
        </button>
      </form>
      {showLogin && <Login onClose={toggleLogin}/>}
    </div>
  );
}