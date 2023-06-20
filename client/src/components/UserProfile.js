import React, { useContext, useState } from "react";
import Select from "react-select";
import { UserProfileDetails } from "../contexts/UserProfileDetails";
import { toast } from "react-toastify";
import axios from "axios";
import { resetPassword } from "../api/CarApi";
import { Cities } from "../res/Cities";

export default function UserProfile() {
  const {userDetails,setUserDetails} = useContext(UserProfileDetails);
  const [editing, setEditing] = useState(false);
  const [updatedUserDetails, setUpdatedUserDetails] = useState(userDetails);
  const [updatedImage, setUpdatedImage] = useState(null);
  // const [city, setCity] = useState("");
  // const [city_name, setCityName] = useState("");
  // const [selectedCityLabel, setSelectedCityLabel] = useState("Choose a city");

  // reset password states.
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordChanged, setPasswordChanged] = useState(false);

  const handleChangePassword = () => {
    const info = {
      userId: userDetails.Id,
      currentPassword: currentPassword,
      newPassword: newPassword,
    };
    resetPassword(info)
      .then((res) => {
        console.log(res.message);
        setPasswordChanged(true);
      })
      .catch((err) => {
        setPasswordError(err);
        toast.error(passwordError);
      });

    setPasswordError("");
    setPasswordChanged(true);
    setNewPassword("");
  };

  const handleEdit = () => {
    setEditing(true);
    setUpdatedUserDetails(userDetails);
    // setSelectedCityLabel(userDetails.City_Name);
  };

  const handleCancel = () => {
    setUpdatedUserDetails(userDetails);
    setEditing(false);
  };

  // const handleCityChange = (selectedOption) => {
  //   setCity(selectedOption.value);
  //   setCityName(selectedOption.label);
  //   setSelectedCityLabel(selectedOption.label);
  //   setUpdatedUserDetails((prevState) => ({
  //     ...prevState,
  //     City_Name: selectedOption.value,
  //   }));
  // };

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
            picture: filename, 
          };
          console.log(updatedDetailsWithPicture);

          // Sending the updated user details
          axios
            .put(
              "http://localhost:3001/user/updateuserdetails",
              updatedDetailsWithPicture
            )
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
          setUserDetails(updatedUserDetails);
          
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
        className="text-black w-10/12 border-2 p-2 mr-4 rounded-md "
      />
    ) : (
      <p className="text-black  w-10/12 border-2 p-2 m-2 rounded-md">
        {userDetails[fieldName]}
      </p>
    );
  };

  return (
    <div className="min-h-screen w-4/5">
      <div className="w-full flex container mx-auto px-4 py-8">
        <div className="w-1/2">
          {/* Display user profile image */}
          <div className="flex flex-col items-center justify-center  bg-white rounded-lg shadow-lg overflow-hidden  h-full">
            <figure className="flex flex-col items-center justify-center">
              <img
                src={`http://localhost:3001/images/${userDetails.picture}`}
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
                <span className=" bg-green-500 text-center text-white m-1 w-1/2 p-2 rounded-md">  {userDetails.status} </span>
              </div>

              {editing && (
                <div className="flex flex-wrap mb-4">
                  <div className="w-full">
                    <p className="text-lg font-bold text-black">
                      Profile Picture:
                    </p>
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
          </div>
        </div>

        <div className="w-full ">
          <div className="w-full max-h-full bg-white rounded-lg shadow-lg ml-4 overflow-hidden">
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

                {/* <div className="w-1/2">
                  <p className="text-lg font-bold text-black">City :</p>
                  {editing ? (
                    <Select
                    className="border border-gray-300 px-4 py-2 rounded-md w-full"
                    id="city"
                    value={{ value: city, label: selectedCityLabel }}
                    onChange={handleCityChange}
                    noOptionsMessage={() => "Not Found"}
                    options={Cities}
                    required
                  />
                  ) : (
                    <p className="text-black border-2 p-2 m-2 rounded-md">
                      {userDetails.City_Name}
                    </p>
                  )}
                </div> */}

                <div className="w-1/2">
                  <p className="text-lg font-bold text-black">Street Name :</p>
                  {renderInputOrText("street_name", "StreetName")}
                </div>
              </div>
             
            </div>

            {/* Buttons */}
            <div className="flex justify-center pb-4">
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
      </div>
    </div>
  );
}

