import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Login() {
  // use state for the username and password.
  const [username,setUsername] = useState("");
  const [password,setPassword] = useState("");
  const [isOpen, setIsOpen] = useState(true);
  const navigate = useNavigate();

  const handleClose = () => {
    setIsOpen(false);
    navigate('/');
  };

  if (!isOpen) {
    return null;
  }

  return (
    <>
      <section className="fixed inset-0 flex items-center justify-center z-50 bg-opacity-50 bg-gray-900">
        <form className="bg-[#E7E7E7] max-w-lg p-6 mx-auto rounded-lg h-2/4">
          <div className="flex justify-end">
            <button
              type="button"
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg"
              onClick={handleClose}
            >
              X
            </button>
          </div>
          <h2 className="text-2xl font-bold text-center mb-4">Login</h2>

          <label className="mb-2">Username</label>
          <input type="text" name='username' className="border border-gray-300 px-4 py-2 mt-4 mb-4 rounded-md w-full" onChange={(e) => {setUsername(e.target.value)}} />

          <label className="mt-4 mb-2">Password</label>
          <input type="password" name='password' className="border border-gray-300 px-4 py-2 mb-4 mt-1 rounded-md w-full"  onChange={(e) => {setPassword(e.target.value)}}/>

          <button
            type="submit"
            className="bg-[#CC6200] text-white px-4 py-2 rounded-md w-full mt-7"
          >
            Login
          </button>
        
          <p className="text-center mt-10">
          Forgot your password?
          <Link to="/login" className="p-2 text-[#CC6200]">
            Reset
          </Link>
          </p>
        </form>
      </section>
    </>
  );
}