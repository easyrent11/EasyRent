import React, { useState, useEffect } from "react";
import { getAllUserDetails } from "../api/UserApi";
import { useParams } from "react-router-dom";
import { AES } from 'crypto-js';
import CryptoJS from 'crypto-js';

export default function AdminViewUserProfile() {
    const [userDetails, setUserDetails] = useState({});
    const secretKey = process.env.REACT_APP_ENCRYPTION_KEY;

    let { encryptedId } = useParams();
    console.log("Encrypted Id = ", encryptedId);

    let userId = Number(AES.decrypt(decodeURIComponent(encryptedId), secretKey).toString(CryptoJS.enc.Utf8));

    console.log("User id = ",userId);
    useEffect(() => {
      getAllUserDetails(userId)
        .then((res) => {
          setUserDetails(res.data[0]);
        })
        .catch((error) => {
          console.log(error);
        });
    }, [userId]);

    return (
      <div className="w-full flex-col  flex items-center justify-center lg:w-2/3  container mx-auto mt-5">
        <h1 className="text-2xl font-bold mb-5">User Details</h1>
        <div className="w-full  grid grid-cols-2 gap-4 bg-white shadow-md p-4 rounded-md">
          <div className="flex flex-col">
            <p className="font-bold text-lg">First Name:</p>
            <p className="text-xl">{userDetails.first_name}</p>
          </div>
          <div className="flex flex-col">
            <p className="font-bold text-lg">Last Name:</p>
            <p className="text-xl">{userDetails.last_name}</p>
          </div>
          <div className="flex flex-col">
            <p className="font-bold text-lg">Email:</p>
            <p className="text-xl">{userDetails.email}</p>
          </div>
          <div className="flex flex-col">
            <p className="font-bold text-lg">Phone Number:</p>
            <p className="text-xl">{userDetails.phone_number}</p>
          </div>
          <div className="flex flex-col">
            <p className="font-bold text-lg">City:</p>
            <p className="text-xl">{userDetails.City_Name}</p>
          </div>
          <div className="flex flex-col">
            <p className="font-bold text-lg">Street Name:</p>
            <p className="text-xl">{userDetails.street_name}</p>
          </div>
          <div className="flex flex-col">
            <p className="font-bold text-lg">Driving License:</p>
            <p className="text-xl">{userDetails.driving_license}</p>
          </div>
          <div className="flex flex-col">
            <p className="font-bold text-lg">Status:</p>
            <p className="text-xl">{userDetails.status}</p>
          </div>
        </div>
      </div>
    );
  }
