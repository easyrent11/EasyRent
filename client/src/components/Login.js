import React, { useState } from 'react';
import { Link} from 'react-router-dom';

export default function Login({ onClose }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');


  // handle the login submit.
  const handleLogin = () => {
    console.log("Logged in");
    setUsername('');
    setPassword('');
  }

  return (
    <>
      <section className="fixed inset-0 flex items-center justify-center z-50 bg-opacity-50 bg-gray-900 border-3">
        <div className="bg-[#E7E7E7] max-w-lg p-6 mx-auto rounded-lg h-2/">
          <form>
            <div className="flex justify-end">
              <button
                type="button"
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg"
                onClick={onClose}
              >
                X
              </button>
            </div>
            <h2 className="text-2xl font-bold text-center mb-4">Login</h2>

            <label className="mb-2">Username</label>
            <input
              type="text"
              name="username"
              className="border border-gray-300 px-4 py-2 mt-4 mb-4 rounded-md w-full"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />

            <label className="mt-4 mb-2">Password</label>
            <input
              type="password"
              name="password"
              className="border border-gray-300 px-4 py-2 mb-4 mt-1 rounded-md w-full"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <button
              type="submit"
              className="bg-[#CC6200] text-white px-4 py-2 rounded-md w-full mt-7"
              onClick={handleLogin}
            >
              Login
            </button>
          </form>
          <p className="text-center mt-10">
            Forgot your password?
            <Link to="/login" className="p-2 text-[#CC6200]">
              Reset
            </Link>
          </p>
        </div>
      </section>
    </>
  );
}