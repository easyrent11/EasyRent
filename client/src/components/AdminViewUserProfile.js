import React, { useState, useEffect } from "react";
import { getAllUserDetails } from "../api/UserApi";
import { useParams} from "react-router-dom";
import { AES} from 'crypto-js';
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
      <div className="container mx-auto mt-5">
        <h1 className="text-2xl font-bold mb-5">User Details</h1>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="font-bold">First Name:</p>
            <p>{userDetails.first_name}</p>
          </div>
          <div>
            <p className="font-bold">Last Name:</p>
            <p>{userDetails.last_name}</p>
          </div>
          <div>
            <p className="font-bold">Email:</p>
            <p>{userDetails.email}</p>
          </div>
          <div>
            <p className="font-bold">Phone Number:</p>
            <p>{userDetails.phone_number}</p>
          </div>
          <div>
            <p className="font-bold">City:</p>
            <p>{userDetails.City_Name}</p>
          </div>
          <div>
            <p className="font-bold">Street Name:</p>
            <p>{userDetails.street_name}</p>
          </div>
          <div>
            <p className="font-bold">Driving License:</p>
            <p>{userDetails.driving_license}</p>
          </div>
          <div>
            <p className="font-bold">Status:</p>
            <p>{userDetails.status}</p>
          </div>
        </div>
      </div>
    );
  }
  