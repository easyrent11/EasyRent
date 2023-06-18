import React, { useContext, useState } from "react";
import { UserProfileDetails } from "../contexts/UserProfileDetails";
import { toast } from "react-toastify";
import axios from "axios";

export default function UserProfile() {
  const userDetails = useContext(UserProfileDetails);
  const [editing, setEditing] = useState(false);
  const [updatedUserDetails, setUpdatedUserDetails] = useState(userDetails);
  const [updatedImage, setUpdatedImage] = useState(null);

  const handleEdit = () => {
    setEditing(true);
    setUpdatedUserDetails(userDetails);
  };


  const handleCancel = () => {
    setUpdatedUserDetails(userDetails);
    setEditing(false);
  };

  const handleSave = () => {
    if (updatedImage) {
      const formData = new FormData();
      formData.append("profileImage", updatedImage);
  
      axios
        .post("http://localhost:3001/user/uploadProfileImage", formData)
        .then((response) => {
          const { fileUrl } = response.data;
          const pathname = new URL(fileUrl).pathname;
          const filename = pathname.substring(pathname.lastIndexOf("/") + 1);
          // Once the image is uploaded, update the user details and send the updated details
          const updatedDetailsWithPicture = {
            ...updatedUserDetails,
            picture: filename, // Assuming the response contains the updated file name
          };
          console.log(updatedDetailsWithPicture);
  
          // Send the updated user details
          axios
            .put("http://localhost:3001/user/updateuserdetails", updatedDetailsWithPicture)
            .then((response) => {
              toast.success("User details saved successfully:", response.data);
              setEditing(false);
            })
            .catch((error) => {
              toast.error("Failed to save user details:", error);
            });
        })
        .catch((error) => {
          toast.error("Failed to upload profile picture:", error);
        });
    } else {
      axios
        .put("http://localhost:3001/user/updateuserdetails", updatedUserDetails)
        .then((response) => {
          toast.success("User details saved successfully:", response.data);
          setEditing(false);
        })
        .catch((error) => {
          toast.error("Failed to save user details:", error);
        });
    }
  };
  

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "picture" && files.length > 0) {
      // Get the first file from the selected files
      const file = files[0];
      setUpdatedImage(file);
      setUpdatedUserDetails((prevState) => ({
        ...prevState,
        [name]: file,
      }));
    } else {
      setUpdatedUserDetails((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };
  


  const renderInputOrText = (fieldName, label) => {
    return editing ? (
      <input
        type="text"
        name={fieldName}
        value={updatedUserDetails[fieldName]}
        onChange={handleChange}
        className="text-black"
      />
    ) : (
      <p className="text-black">{userDetails[fieldName]}</p>
    );
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
                {renderInputOrText("Id", "ID")}
              </div>
              <div className="w-1/2">
                <p className="text-lg font-bold text-black">First Name:</p>
                {renderInputOrText("first_name", "First Name")}
              </div>
            </div>
            <div className="flex flex-wrap mb-4">
              <div className="w-1/2">
                <p className="text-lg font-bold text-black">Last Name:</p>
                {renderInputOrText("last_name", "Last Name")}
              </div>
              <div className="w-1/2">
                <p className="text-lg font-bold text-black">Email:</p>
                {renderInputOrText("email", "Email")}
              </div>
            </div>
            <div className="flex flex-wrap mb-4">
              <div className="w-1/2">
                <p className="text-lg font-bold text-black">Phone Number:</p>
                {renderInputOrText("phone_number", "Phone Number")}
              </div>
              <div className="w-1/2">
                <p className="text-lg font-bold text-black">Driving License:</p>
                {renderInputOrText("driving_license", "Driving License")}
              </div>
            </div>
            {editing && (
              <div className="flex flex-wrap mb-4">
                <div className="w-full">
                  <p className="text-lg font-bold text-black">Profile Picture:</p>
                  <input
                    type="file"
                    name="picture"
                    onChange={handleChange}
                    className="text-black"
                  />
                </div>
              </div>
            )}
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
