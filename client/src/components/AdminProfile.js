import React, { useContext, useState} from "react";
import Select from "react-select";
import { UserProfileDetails } from "../contexts/UserProfileDetails";
import axios from "axios";
import { resetPassword } from "../api/UserApi";
import { Cities } from "../res/Cities";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faCloudUploadAlt} from "@fortawesome/free-solid-svg-icons";
import { notify } from "../HelperFunctions/Notify";

export default function UserProfile() {
  // user profile details states.
  const { userDetails, setUserDetails } = useContext(UserProfileDetails);
  const [editing, setEditing] = useState(false);
  const [updatedUserDetails, setUpdatedUserDetails] = useState(userDetails);
  const [updatedImage, setUpdatedImage] = useState(null);
  const [city, setCity] = useState("");
  const [city_name, setCityName] = useState("");
  const [selectedCityLabel, setSelectedCityLabel] = useState("Choose a city");
 

  // update password use states.
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordChanged, setPasswordChanged] = useState(false);
  const [loading, setLoading] = useState(true);


  const handleChangePassword = () => {
    if (!newPassword || !confirmNewPassword) {
      setPasswordError("Please fill in all password fields.");
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setPasswordError("Passwords do not match.");
      return;
    }

    const info = {
      userId: userDetails.Id,
      currentPassword: currentPassword,
      newPassword: newPassword,
    };
    resetPassword(info)
      .then((res) => {
        setPasswordChanged(true);
        notify("success","Password changed successfully.");
      })
      .catch((err) => {
        setPasswordError(err.message || "Failed to reset password.");
        notify("error",passwordError);
      });

    setCurrentPassword("");
    setNewPassword("");
    setConfirmNewPassword("");
  };

  const handleEdit = () => {
    setEditing(true);
    setUpdatedUserDetails(userDetails);
    setSelectedCityLabel(userDetails.City_Name);
  };

  const handleCancel = () => {
    setUpdatedUserDetails(userDetails);
    setEditing(false);
  };


  // filters the all cars to get only the cars of the logged in person.
  const handleSave = () => {
    // Check if any changes were made to user details
    const isUserDataChanged =
      JSON.stringify(updatedUserDetails) !== JSON.stringify(userDetails);

    if (!isUserDataChanged && !updatedImage) {
      notify("info","No changes to save.");
      setEditing(false);
      return;
    }

    if (updatedImage) {
      // Handle image update only when a new image is selected
      const formData = new FormData();
      formData.append("profileImage", updatedImage);

      axios
        .post("http://localhost:3001/user/uploadProfileImage", formData)
        .then((response) => {
          const { fileUrl } = response.data;
          const pathname = new URL(fileUrl).pathname;
          const filename = pathname.substring(pathname.lastIndexOf("/") + 1);

          const updatedDetailsWithPicture = {
            ...updatedUserDetails,
            picture: filename,
            city_code: city || userDetails.city_code,
            City_Name: city_name || userDetails.City_Name,
          };

          // Update user details with new picture and other changes
          updateUserDetails(updatedDetailsWithPicture);
          
        })
        .catch((error) => {
          notify("error",`Failed to upload profile picture : ${error}`);
        });
    } else {
      // Update user details without changing the picture
      const updatedDetailsWithoutPicture = {
        ...updatedUserDetails,
        city_code: city || userDetails.city_code,
        City_Name: city_name || userDetails.City_Name,

      };
      // Update user details
      updateUserDetails(updatedDetailsWithoutPicture);
    }
  };

  const updateUserDetails = (updatedDetails) => {
    axios
      .put("http://localhost:3001/user/updateuserdetails", updatedDetails)
      .then((response) => {
        notify("success",`${response.data}`);
        setEditing(false);

        // Update userDetails with the new updatedDetails
        setUserDetails(updatedDetails);
      })
      .catch((error) => {
        notify("error",`Failed to save user details: ${error}`);
      });
  };

  const handleCityChange = (selectedOption) => {
    setCity(selectedOption.value);
    setCityName(selectedOption.label);
    setSelectedCityLabel(selectedOption.label);
    // Update the city name in updatedUserDetails
    setUpdatedUserDetails((prevState) => ({
      ...prevState,
      City_Name: selectedOption.label,
    }));
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "picture" && files.length > 0) {
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
        className="text-black w-10/12 border-2 p-2 mr-4 rounded-md"
      />
    ) : (
      <p className="text-black w-10/12 border-2 p-2 m-2 rounded-md">
        {userDetails[fieldName]}
      </p>
    );
  };

  
  return (
    <>
      <div className="flex flex-col items-center mt-10  flex-1 w-full ">
      <h1 className="text-3xl mt-8 mb-20 font-bold ">{userDetails.first_name} Profile Details</h1>

        <div className="md:w-4/5  lg:w-4/5 max-w-full  2xl:h-2/3 max-h-3/4 m-2 items-center flex lg:flex-row flex-col">
          <div className="w-full lg:h-full lg:w-4/5">
            {/* Display user profile image */}
            <div className="flex flex-col items-center lg:flex-1  w-full justify-center  bg-white rounded-lg shadow-lg overflow-hidden  h-full">
              <figure className="flex flex-col items-center justify-center">
                <img
                  src={`http://localhost:3001/images/${
                    userDetails.picture != null ? userDetails.picture : null
                  }`}
                  alt="User Image"
                  className="border-2 flex w-32 h-32 rounded-full"
                />
              </figure>
              <figcaption className="text-xl mt-2">
                Location : {userDetails.City_Name}, Israel
              </figcaption>
              <div className="flex flex-col justify-between items-center p-1 rounded-md mt-4 w-3/5 ">
                <div className="flex bg-[#f6f6f6] w-full items-center rounded-md p-2 shadow-lg justify-around ">
                  <p className="text-blackp-2 text-black font-bold">Status :</p>
                  <span className=" bg-green-500 text-center text-white m-1 w-1/2 p-2 rounded-md">
                    {userDetails.status}
                  </span>
                </div>

                {editing && (
                  <div className="flex flex-wrap mb-4">
                    <div className="w-full m-6">
                      <label
                        htmlFor="file-input"
                        className="bg-black hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg cursor-pointer flex items-center"
                      >
                        <FontAwesomeIcon
                          icon={faCloudUploadAlt}
                          className="mr-2"
                        />
                        Upload Picture
                      </label>
                      <input
                        type="file"
                        id="file-input"
                        name="picture"
                        onChange={handleChange}
                        className="hidden"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="xl:w-4/5 lg:h-full w-full  shadow-lg  p-2 bg-white rounded-md">
            <div className="max-w-full max-h-auto  bg-white rounded-lg ">
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
                  <div className="w-1/2 ">
                    <p className="text-lg font-bold text-black">Phone Number:</p>
                    {renderInputOrText("phone_number", "Phone Number")}
                  </div>
                  <div className="w-1/2">
                    <p className="text-lg font-bold text-black">
                      Driving License:
                    </p>
                    {renderInputOrText("driving_license", "Driving License")}
                  </div>

                  <div className="w-1/2">
                    <p className="text-lg font-bold text-black">City :</p>
                    {editing ? (
                      <Select
                        className="border border-gray-300  rounded-md max-w-full mr-4"
                        id="city"
                        value={{ value: city, label: selectedCityLabel }}
                        onChange={handleCityChange}
                        noOptionsMessage={() => "Not Found"}
                        options={Cities}
                      />
                    ) : (
                      <p className="text-black border-2 p-2 m-2 rounded-md">
                        {userDetails.City_Name}
                      </p>
                    )}
                  </div>

                  <div className="w-1/2">
                    <p className="text-lg font-bold text-black">Street Name :</p>
                    {renderInputOrText("street_name", "StreetName")}
                  </div>
                </div>
              </div>

              {/* Reset password section - show only in edit mode */}
              {editing && (
                <div className="flex max-h-full flex-col items-center justify-center max-w-full">
                  <p className="text-lg p-2 ml-4 font-bold text-black w-full">
                    Change Password
                  </p>
                  <article className="flex items-center justify-center flex-col p-2 w-full ">
                    <div className="w-4/5 flex items-center m-2  p-2 justify-between">
                      <label>Current Password : </label>
                      <input
                        className="w-4/5 border-2 border-black rounded-md"
                        name="oldpassword"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                      />
                    </div>
                    <div className="w-4/5 flex items-center m-2 p-2 justify-between">
                      <label>New Password : </label>
                      <input
                        className="w-4/5 border-2 border-black rounded-md"
                        name="newpassword"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                      />
                    </div>
                    <div className="w-4/5 flex items-center m-2  p-2 justify-between">
                      <label>Confirm New Password : </label>
                      <input
                        className="w-4/5 border-2 border-black rounded-md"
                        name="confirmnewpassword"
                        value={confirmNewPassword}
                        onChange={(e) => setConfirmNewPassword(e.target.value)}
                      />
                    </div>
                    <button
                      className="bg-black p-2 mt-4 text-white rounded-md"
                      onClick={handleChangePassword}
                    >
                      Change Password
                    </button>
                  </article>
                </div>
              )}

              {/* Buttons */}
              <div className="flex mt-5 justify-center pb-4">
                {editing ? (
                  <>
                    <button
                      className="bg-green-500  text-white font-bold  py-2 px-4 rounded mr-4"
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
                    className="bg-green-500 text-white font-bold w-1/4 py-2 px-4 rounded"
                    onClick={handleEdit}
                  >
                    Edit
                  </button>
                )}
              </div>
            </div>
          </div>

          <p className="m-2 text-red-700 text-center font-bold">
            {passwordError}
          </p>
        </div>
       
      </div>
    </>
  );
}
