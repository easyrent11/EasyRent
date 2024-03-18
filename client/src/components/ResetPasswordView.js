import React, { useState } from 'react';
import { forgotPassword } from "../api/UserApi";

export default function ForgotPasswordView({ onClose }) {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [warning, setWarning] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSendResetEmail = () => {
    setMessage("");
    setError("");

    if (!email) {
      setError("Please provide your email address!");
      return;
    }

    if (!validateEmail(email)) {
      setError("Invalid email address format");
      return;
    }

    setLoading(true); // Set loading to true when starting the request

    forgotPassword(email)
      .then((res) => {
        setMessage(res.data.message);
        setWarning("If you can't find the email, look in your junk/spam folder");
      })
      .catch((error) => {
        setError(error.response.data.error);
      })
      .finally(() => {
        setLoading(false); // Set loading to false when the request is complete
      });
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-opacity-50 bg-gray-900">
      <div className="flex flex-col justify-between bg-[#E7E7E7] w-full 2xl:w-1/3 h-full 2xl:h-4/5 p-6 mx-auto rounded-lg relative">
        <div className='flex items-center justify-end w-full'>
          <button onClick={onClose} className="bg-gray-300 text-black px-4 py-2 rounded-lg">
            X
          </button>
        </div>
        <div className='flex  flex-col p-4 items-start justify-center '>
          <h2 className="text-2xl font-bold self-center   mb-4">Forgot Password</h2>
          <p className="text-lg text-center">
            Please enter your email address below. We will send you a new temporary password.
            Please note that if you did not register with a real email or you do not have access to the email
          </p>
          <p className='text-lg text-center'> you will not recieve
            the password and should probably contact us at <span className='font-bold text-lg'>easyrent11@outlook.com</span></p>
          <p className='text-lg text-center w-full text-red-300 font-bold'>It's advised to change the temporary password after you log back in.</p>
        </div>
        <div className='flex flex-col justify-center p-4 '>
          <label className="font-bold" htmlFor="email">
            Email:
          </label>
          <input
            type="email"
            id="email"
            placeholder='Enter your email address'
            className="border border-gray-300 px-4 py-2 mt-4 mb-4 rounded-md w-full"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button
            onClick={handleSendResetEmail}
            className={`bg-[#CC6200] text-white px-4 py-2 rounded-md w-full mt-7 ${loading ? 'cursor-not-allowed opacity-50' : ''}`}
            disabled={loading}
          >
            {loading ? 'Sending...' : 'Send Reset Email'}
          </button>
        </div>

        {message && <div className="flex flex-col items-center justify-center text-green-500 text-center font-bold mt-4">{message} {warning}</div>}
        {error && <div className=" text-red-500 text-center font-bold mt-4">{error}</div>}
      </div>
    </div>
  );
}
