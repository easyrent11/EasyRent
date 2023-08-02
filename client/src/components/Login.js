import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { login } from "../api/UserApi";
import { UserProfileDetails } from "../contexts/UserProfileDetails";
import { getAllUserDetails } from "../api/UserApi";

export default function Login({ onClose, handleLogin }) {
  const { setUserDetails } = useContext(UserProfileDetails);

  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // function that takes a message and displays it as an alert popout.
  const notify = (error,message) => error === "success" ? toast.success(message) : toast.error(message);

  // handle the login submit.
  const handleFormLogin = (e) => {
    e.preventDefault();
    // check if user is already signed in
    const token = localStorage.getItem("token");
    if (token) {
      // User is already signed in, display a message or handle accordingly
      notify("error", "You are already signed in");
      return;
    }
    // creating the login object.
    const loginInfo = {
      email: email,
      password: password,
    };
    // sending the login object to the backend and displaying the result .
    login(loginInfo)
      .then((res) => {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("userId", res.data.userId);
        notify("success", res.data.message);
        handleLogin(true);
        // get the user details after obtaining the userId.
        fetchUserDetails(res.data.userId);
        navigate("/homepage");
      })
      .catch((err) => {
        notify("error",err.response.data.message);
      })
      .finally(() => {
        setEmail("");
        setPassword("");
      });
    onClose();
  };

  // Function that fetches all the user details based on the userId.
  function fetchUserDetails(userId) {
    if(!userId){
      notify('error', 'couldnt get userId');
      return;
    }
    getAllUserDetails(userId)
      .then((res) => {
        console.log("in login",res.data);
        setUserDetails(res.data[0]);
      })
      .catch((err) => console.log("Couldnt get user details ", err));
  }

  return (
    <>
      <section className="fixed inset-0 flex items-center justify-center z-50 bg-opacity-50 bg-gray-900 border-3">
        <div className="bg-[#E7E7E7] max-w-lg p-6 mx-auto rounded-lg">
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

            <label className="mb-2">Email</label>
            <input
              type="text"
              name="email"
              className="border border-gray-300 px-4 py-2 mt-4 mb-4 rounded-md w-full"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
              onClick={handleFormLogin}
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
