import React, { useContext, useState } from "react";
import { UserProfileDetails } from "../contexts/UserProfileDetails";
import { toast } from "react-toastify";
import axios from "axios";

export default function UserProfile() {
  const userDetails = useContext(UserProfileDetails);
  const [editing, setEditing] = useState(false);
  const [updatedUserDetails, setUpdatedUserDetails] = useState(userDetails);

  const handleEdit = () => {
    setEditing(true);
  };

  const handleCancel = () => {
    setUpdatedUserDetails(userDetails);
    setEditing(false);
  };

  const handleSave = () => {

    console.log("User details updated:", updatedUserDetails);
  
    axios.put('http://localhost:3001/user/updateuserdetails', updatedUserDetails)
      .then(response => {
        toast.success("User details saved successfully:", response.data);
        setEditing(false);
      })
      .catch(error => {
        toast.error("Failed to save user details:", error);
      });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedUserDetails((prevState) => ({
      ...prevState,
      [name]: value
    }));
  };

  return (
    <div className="min-h-50vh flex border-2 border-blue-500 container mx-auto px-4 py-8">
      <div className="w-1/2">
        {/* Display user profile image */}
        <div className="flex flex-col items-center justify-center border-2 h-full border-black">
          <figure className="flex flex-col items-center justify-center">
            <img
              src={`http://localhost:3001/images/${userDetails.picture}`}
              alt="User Image"
              className="border-2 flex w-32 h-32 rounded-full"
            />
          </figure>
          <figcaption className="text-xl">
            {userDetails.street_name}, {userDetails.city_code}, Israel
          </figcaption>
        </div>
      </div>

      <div className="w-full border-2 border-red-500">
        <div className="w-full max-h-full bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-4">
            <div className="flex flex-wrap mb-4">
              <div className="w-1/2">
                <p className="text-lg font-bold text-black">ID:</p>
                {editing ? (
                  <input
                    type="number"
                    name="Id"
                    value={updatedUserDetails.Id}
                    onChange={handleChange}
                    className="text-black"
                  />
                ) : (
                  <p className="text-black">{userDetails.Id}</p>
                )}
              </div>
              <div className="w-1/2">
                <p className="text-lg font-bold text-black">First Name:</p>
                {editing ? (
                  <input
                    type="text"
                    name="first_name"
                    value={updatedUserDetails.first_name}
                    onChange={handleChange}
                    className="text-black"
                  />
                ) : (
                  <p className="text-black">{userDetails.first_name}</p>
                )}
              </div>
            </div>
            <div className="flex flex-wrap mb-4">
              <div className="w-1/2">
                <p className="text-lg font-bold text-black">Last Name:</p>
                {editing ? (
                  <input
                    type="text"
                    name="last_name"
                    value={updatedUserDetails.last_name}
                    onChange={handleChange}
                    className="text-black"
                  />
                ) : (
                  <p className="text-black">{userDetails.last_name}</p>
                )}
              </div>
              <div className="w-1/2">
                <p className="text-lg font-bold text-black">Email:</p>
                {editing ? (
                  <input
                    type="text"
                    name="email"
                    value={updatedUserDetails.email}
                    onChange={handleChange}
                    className="text-black"
                  />
                ) : (
                  <p className="text-black">{userDetails.email}</p>
                )}
              </div>
            </div>
            <div className="flex flex-wrap mb-4">
              <div className="w-1/2">
                <p className="text-lg font-bold text-black">Phone Number:</p>
                {editing ? (
                  <input
                    type="number"
                    name="phone_number"
                    value={updatedUserDetails.phone_number}
                    onChange={handleChange}
                    className="text-black"
                  />
                ) : (
                  <p className="text-black">{userDetails.phone_number}</p>
                )}
              </div>
              <div className="w-1/2">
                <p className="text-lg font-bold text-black">Driving License:</p>
                {editing ? (
                  <input
                    type="number"
                    name="driving_license"
                    value={updatedUserDetails.driving_license}
                    onChange={handleChange}
                    className="text-black"
                  />
                ) : (
                  <p className="text-black">{userDetails.driving_license}</p>
                )}
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-center pb-4">
            {editing ? (
              <>
                <button
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-4"
                  onClick={handleSave}
                >
                  Save
                </button>
                <button
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                  onClick={handleCancel}
                >
                  Cancel
                </button>
              </>
            ) : (
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                onClick={handleEdit}
              >
                Edit
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
