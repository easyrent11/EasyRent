import React from 'react';
import { useState } from 'react';
import { useScrollToTop } from './ScrollToTheTop';

export default function ContactUs({ isLoggedIn }) {
  useScrollToTop();
  const [message, setMessage] = useState("");

  const handleFormSubmit = (e) => {
    e.preventDefault();
    // You can implement the logic to handle the form submission here, such as sending the message to the admin
    // Reset the form input
    setMessage("");
  };

  if (isLoggedIn) {
    // Render the component with only the message field for logged-in users
    return (
      <div className="min-h-screen container mx-auto py-8">
        <div className="mt-8 flex justify-center">
          <div className="bg-white shadow-lg rounded-lg p-6 max-w-md w-full">
            <h3 className="text-2xl text-black text-center font-bold mb-4">
              Contact Us
            </h3>
            <form>
              <div className="col-span-2">
                <label
                  htmlFor="message"
                  className="text-lg text-black font-semibold mb-2"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="border-gray-300 border-2 rounded-lg p-2 mb-4 resize-none w-full"
                  rows="5"
                  required
                ></textarea>
              </div>
              <div className="col-span-2 flex justify-center">
                <button
                  type="submit"
                  onClick={handleFormSubmit}
                  className="bg-[#cc6200] w-1/2 hover:bg-[#ee9f51] text-black font-semibold py-2 px-4 rounded"
                >
                  Send
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // Render the component with all details for non-logged-in users
  return (
    <div className="min-h-screen container mx-auto py-8">
      <div className="mt-8 flex justify-center">
        <div className="bg-white shadow-lg rounded-lg p-6 max-w-md w-full">
          <h3 className="text-2xl text-black text-center font-bold mb-4">
            Contact Us
          </h3>
          <form className="grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="firstName"
                className="text-lg text-black font-semibold mb-2"
              >
                First Name
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                className="border border-gray-300 rounded-lg p-2 mb-4 w-full"
                required
              />
            </div>
            <div>
              <label
                htmlFor="lastName"
                className="text-lg text-black font-semibold mb-2"
              >
                Last Name
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                className="border border-gray-300 rounded-lg p-2 mb-4 w-full"
                required
              />
            </div>
            <div>
              <label
                htmlFor="email"
                className="text-lg text-black font-semibold mb-2"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className="border border-gray-300 rounded-lg p-2 mb-4 w-full"
                required
              />
            </div>
            <div>
              <label
                htmlFor="phone"
                className="text-lg text-black font-semibold mb-2"
              >
                Phone Number
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                className="border border-gray-300 rounded-lg p-2 mb-4 w-full"
                required
              />
            </div>
            <div className="col-span-2 ">
              <label
                htmlFor="message"
                className="text-lg text-black font-semibold mb-2"
              >
                Message
              </label>
              <textarea
                id="message"
                name="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="border-gray-300 border-2 rounded-lg p-2 mb-4 resize-none w-full"
                rows="5"
                required
              ></textarea>
            </div>
            <div className="col-span-2 flex justify-center">
              <button 
                type="submit"
                onClick={handleFormSubmit}
                className="bg-[#cc6200] w-1/2 hover:bg-[#ee9f51] text-black font-semibold py-2 px-4 rounded"
              >
                Send
                
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
