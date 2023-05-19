import React, { useState } from 'react';
import { Link} from 'react-router-dom';

export default function Register({handleRegisterClose}) {
  // use state for all user credentials.
  // const [] = useState("");
  // const [] = useState("");
  // const [] = useState("");
  // const [] = useState("");
  // const [] = useState("");
  // const [] = useState("");
  // const [] = useState("");
  // const [] = useState("");
  // const [] = useState("");
  // const [] = useState("");
  // const [] = useState("");

  const [isOpen, setIsOpen] = useState(true);

  if (!isOpen) {
    return null;
  }

  function handleCloseAndReset(){
    handleRegisterClose();
    setIsOpen(false);
  }    

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-opacity-50 bg-gray-900">
      <form className="bg-[#E7E7E7] max-w-lg p-6 mx-auto rounded-lg">
      <div className="flex justify-end">
          <button
            type="button"
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg"
            onClick={handleCloseAndReset}
          >
            X
          </button>
        </div>
        <h2 className="text-2xl font-bold text-center mb-4">Register</h2>
        <p className="text-center mb-4">
          Already have an account?
          <Link to="/login" className="p-2 text-[#CC6200]">
            Log in
          </Link>
        </p>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block mb-2">First Name</label>
            <input
              type="text"
              className="border border-gray-300 px-4 py-2 rounded-md w-full"
            />
          </div>
          <div>
            <label className="block mb-2">Last Name</label>
            <input
              type="text"
              className="border border-gray-300 px-4 py-2 rounded-md w-full"
            />
          </div>
          <div>
            <label className="block mb-2">Email Address</label>
            <input
              type="email"
              className="border border-gray-300 px-4 py-2 rounded-md w-full"
            />
          </div>
          <div>
            <label className="block mb-2">Phone Number</label>
            <input
              type="tel"
              className="border border-gray-300 px-4 py-2 rounded-md w-full"
            />
          </div>
          <div>
            <label className="block mb-2">Password</label>
            <input
              type="password"
              className="border border-gray-300 px-4 py-2 rounded-md w-full"
            />
          </div>
          <div>
            <label className="block mb-2">Verify Password</label>
            <input
              type="password"
              className="border border-gray-300 px-4 py-2 rounded-md w-full"
            />
          </div>
          <div>
            <label className="block mb-2">Choose a City</label>
            <input
              type="text"
              className="border border-gray-300 px-4 py-2 rounded-md w-full"
            />
          </div>
          <div>
            <label className="block mb-2">Full Address</label>
            <input
              type="text"
              className="border border-gray-300 px-4 py-2 rounded-md w-full"
            />
          </div>
          <div>
            <label className="block mb-2">Profile Picture</label>
            <input
              type="file"
              className="border border-gray-300 px-4 py-2 rounded-md w-full"
            />
          </div>
          <div>
            <label className="block mb-2">Government ID</label>
            <input
              type="text"
              className="border border-gray-300 px-4 py-2 rounded-md w-full"
            />
          </div>
          <div>
            <label className="block mb-2">Driving License</label>
            <input
              type="text"
              className="border border-gray-300 px-4 py-2 rounded-md w-full"
            />
          </div>
        </div>
        <button
          type="submit"
          className="bg-[#CC6200] text-white px-4 py-2 rounded-md w-full"
        >
          Register
        </button>
      </form>
    </div>
  );
}
