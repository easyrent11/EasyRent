import React, { useState, useEffect,useContext } from "react";
import { useParams } from "react-router-dom";
import { getAllUserDetails } from "../api/UserApi";
import { xorDecrypt } from "../HelperFunctions/Encrypt";

export default function ViewUserProfile(){

  //#########################################################
  //#                      USE STATES                       #
  //#########################################################
  // all of the user details.
  const [userDetails, setUserDetails] = useState(null);

  // getting the encryption key from the .env file.
  const secretKey = process.env.REACT_APP_ENCRYPTION_KEY;
  // getting the encrypted userId from the parameters.
  const { encryptedId } = useParams();
  console.log("in view",encryptedId);
  // decrypting the userId
  let userId = Number(xorDecrypt(encryptedId, secretKey));
  


  //#########################################################
  //#                      USE EFFECTS                      #
  //#########################################################

  useEffect(() => {
    // Fetch user details based on the user ID
    getAllUserDetails(userId)
      .then((response) => {
        // Remove sensitive information from the response
        const {
          id,
          phoneNumber,
          email,
          streetName,
          drivingLicenseNumber,
          ...safeDetails
        } = response.data;
        setUserDetails(safeDetails[0]);
      })
      .catch((error) => {
        console.error("Error fetching user details:", error);
      });
  }, [userId]);

  if (!userDetails) {
    return <div>Loading...</div>; // You can display a loading indicator while fetching data
  }

  
  console.log(userDetails);

  return (
    <>
    <div className="w-4/5 flex flex-col  border-2 border-red-500 items-center ">
      <h1 className="text-3xl m-20 font-bold">{userDetails.first_name}'s profile details</h1>
      <div className="flex m-20 items-center justify-center h-1/2 border-2 border-red-500 w-4/5 bg-white shadow-lg rounded-md">
        <article className="border-2 w-full h-full border-blue-500">
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
        </article>

        <article className="border-2 w-full h-full border-yellow-500">
          <div className="w-1/2">
            <p className="text-lg font-bold text-black"> First Name : </p>
              {userDetails.first_name}
          </div>

          <div className="w-1/2">
            <p className="text-lg font-bold text-black"> Last Name : </p>
              {userDetails.last_name}
          </div>

          <div className="w-1/2">
            <p className="text-lg font-bold text-black"> First Name : </p>
              {userDetails.first_name}
          </div>
        </article>
        </div>
      </div>
    </>
  );
};

