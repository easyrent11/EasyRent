import React, { useContext, useState, useEffect} from "react";
import Select from "react-select";
import { UserProfileDetails } from "../contexts/UserProfileDetails";
import axios from "axios";
import { resetPassword } from "../api/UserApi";
import { Cities } from "../res/Cities";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faCloudUploadAlt} from "@fortawesome/free-solid-svg-icons";
import Car from "./Car";
import { AllCarsContext } from "../contexts/AllCarsContext";
import { notify } from "../HelperFunctions/Notify";

export default function UserProfile() {
  // user profile details states.
  const { userDetails, setUserDetails } = useContext(UserProfileDetails);
  const [editing, setEditing] = useState(false);
  const [updatedUserDetails, setUpdatedUserDetails] = useState(userDetails);
  const [updatedImage, setUpdatedImage] = useState(null);
  const [userCars, setUserCars] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [city, setCity] = useState("");
  const [city_name, setCityName] = useState("");
  const [selectedCityLabel, setSelectedCityLabel] = useState("Choose a city");
  const carsPerPage = 4;

  // update password use states.
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordChanged, setPasswordChanged] = useState(false);
  const [loading, setLoading] = useState(true);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

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


  // gets all the cars in the website.
  const { allCars } = useContext(AllCarsContext);
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
        notify.success("success",`User details saved successfully: ${response.data}`);
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

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    const userCars = allCars.filter((car) => car.Renter_Id == userId);
    setUserCars(userCars);
    setLoading(false); // Set loading to false when data is available
  }, [allCars]);

  if (loading) {
    return <p>No Cars yet...</p>;
  }

  const allUserCars = Array.from(userCars);
  const totalPages = Math.ceil(allUserCars.length / carsPerPage);

  const indexOfLastCar = currentPage * carsPerPage;
  const indexOfFirstCar = indexOfLastCar - carsPerPage;
  const currentCars = allUserCars.slice(indexOfFirstCar, indexOfLastCar);
  const navigationLocation = "/CarOwnerView";

  return (
    <>
      <div className=" min-h-screen w-4/5 ">
        <div className="w-full flex mx-auto px-4 py-8 ">
          <div className="w-1/2 ">
            {/* Display user profile image */}
            <div className="flex flex-col items-center w-full justify-center  bg-white rounded-lg shadow-lg overflow-hidden  h-full">
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

          <div className="w-full shadow-lg bg-white rounded-md ml-2">
            <div className="w-full max-h-full bg-white rounded-lg ">
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
                <div className="flex flex-col items-center justify-center w-full">
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
        {/* Renter's Cars Section */}
        <div className="flex flex-col items-center min-h-screen w-full p-4 bg-white shadow-lg rounded-md">
          {allUserCars.length > 0 && (
            <h2 className="p-2 m-2 text-2xl">Your cars:</h2>
          )}
           {allUserCars.length > 0 ? (
          <article className="flex border-2 border-blue-900 min-h-screen flex-wrap w-full p-4">
            {allUserCars.map((car, index) => (
              <Car
                key={index}
                car={car}
                btnText={"Edit Car"}
                navigationLocation={navigationLocation}
              />
            ))}
          </article>
        ) : (
          <p className="p-4 text-2xl">You don't have any cars yet.</p>
        )}
          <div className="flex self-center align-self-end mt-4">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                className={`mx-1 p-2 border ${
                  page === currentPage
                    ? "bg-black rounded-md text-white"
                    : "bg-white"
                }`}
                onClick={() => handlePageChange(page)}
              >
                {page}
              </button>
            ))}
          </div>
        </div>
        {/* End of Renter's Cars Section */}
      </div>
    </>
  );
}
