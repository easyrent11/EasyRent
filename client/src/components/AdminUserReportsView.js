import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getUserReports } from "../api/UserApi";
import { Link } from "react-router-dom";
import AdminUserChatHistory from "../components/AdminUserChatHistory";
import {
  getMessagesForRoom,
  getRoomForUser,
  getAllUserDetails,
} from "../api/UserApi";
import AdminUserChatPopOut from "../components/AdminUserChatPopOut";
import { notify } from "../HelperFunctions/Notify";
import { AES } from 'crypto-js';
import CryptoJS from 'crypto-js';


export default function AdminUserReportsView() {
  const [showChatHistory, setShowChatHistory] = useState(false);
  const [userReports, setUserReports] = useState([]);
  const [showMessagePopOut, setShowMessagePopOut] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState("");
  const [messages, setMessages] = useState("");
  const [showPopout, setShowPopout] = useState(false); // State to manage pop-out visibility
  const [chatRooms, setChatRooms] = useState("");
  const [message, setMessage] = useState("");


  const secretKey = process.env.REACT_APP_ENCRYPTION_KEY;
  const pathSegments = window.location.pathname.split('/');
  const encryptedId = pathSegments[pathSegments.length - 1];
  console.log(encryptedId);
  let userId = Number(AES.decrypt(decodeURIComponent(encryptedId), secretKey).toString(CryptoJS.enc.Utf8));
  useEffect(() => {
    fetchUserReports();
  }, []);

  const fetchUserReports = async () => {
    try {
      const response = await getUserReports(userId);
      setUserReports(response.data);
    } catch (error) {
      console.error("Error fetching user reports:", error);
    }
  };

  const handleOpenMessagePopOut = (messageContext) => {
    setShowMessagePopOut(true);
    setMessage(messageContext);
  };

  const togglePopOut = () => {
    setShowPopout(!showPopout);
  };

  const clearRoom = () => setSelectedRoom("");

  useEffect(() => {
     // get the room of the user and the target.
     getRoomForUser(userId)
     .then((res) => {
      setChatRooms(res.data);
     })
     .catch((err) => {
      console.log(err);
     })
      
  },[]);

  useEffect(() => {
    getMessagesForRoom(selectedRoom)
    .then((res) => {
      console.log(res);
      const messagesWithDetails = res.data.map(async (message) => {
        const senderId = message.user_id;
        const chatRoom = chatRooms.find((room) => room.id === selectedRoom);
        const recipientId =
          senderId === chatRoom.user1_id
            ? chatRoom.user2_id
            : chatRoom.user1_id;
        const senderPromise = getAllUserDetails(senderId);
        const recipientPromise = getAllUserDetails(recipientId);

        const [senderDetails, recipientDetails] = await Promise.all([
          senderPromise,
          recipientPromise,
        ]);
        return {
          ...message,
          senderName: senderDetails.data[0].first_name,
          recipientName: recipientDetails.data[0].first_name,
        };
      });

      Promise.all(messagesWithDetails)
        .then((messagesWithNames) => {
          setMessages(messagesWithNames);
          setShowPopout(true);
        })
        .catch((error) => {
          notify("error", error);
        });
    })
    .catch((error) => {
      notify("error", error);
    })
  },[selectedRoom])

  const handleViewChatHistory = (targetUserId) => {
    const alreadySelected = selectedRoom === targetUserId;
    
    if (alreadySelected) {
      setSelectedRoom(null);
    } else {
      chatRooms.forEach((result) => {
        if (
          (result.user1_id === userId && result.user2_id === targetUserId) ||
          (result.user1_id === targetUserId && result.user2_id === userId)
        ) {
          setSelectedRoom(result.id);
        }
      });
    }
  };


  return (
    <div className="flex flex-col bg-[#f3f3f3] shadow-lg rounded-md w-4/5 justify-center items-center">
      {showChatHistory ? (
        <AdminUserChatHistory
          setShowChatHistory={setShowChatHistory}
          userId={userId}
        />
      ) : (
        <>
          <Link to={`/ViewUserProfile/${encryptedId}`}>
            <h2 className="m-4 font-bold text-2xl">
              User Reports for User ID : 
               <span className="hover:text-[#cc6200]"> {userId} </span>
            </h2>
          </Link> 

          <div className="max-h-60 overflow-y-auto">
            <table className="w-full text-center rounded-md shadow-lg">
              <thead className="rounded-md bg-black text-white">
                <tr>
                  <th className="p-2 font-bold">Reporter Id</th>
                  <th className="p-2 font-bold">Reporter Full Name</th>
                  <th className="p-2 font-bold">Report Cause</th>
                  <th className="p-2 font-bold">Report Message</th>
                  <th className="p-2 font-bold">View Chat Room</th>
                </tr>
              </thead>
              <tbody>
                {userReports.map((report) => (
                  <tr key={report.Id}>
                    <td className="border p-2">{report.Reporting_User_Id}</td>
                    <td className="border p-2">
                      {report.reporting_first_name} {report.reporting_last_name}
                    </td>
                    <td className="border p-2">{report.Report_Cause}</td>
                    <td className="border p-2">
                      <button
                        onClick={() => handleOpenMessagePopOut(report.Message)}
                      >
                        View Message
                      </button>
                    </td>
                    <td className="border p-2">
                      <button
                        onClick={() =>
                          handleViewChatHistory(report.Reporting_User_Id)
                        }
                      >
                        View Chat History
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
      {showMessagePopOut && (
        <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-gray-800 bg-opacity-50">
          <div className="flex flex-col flex-wrap  items-center bg-white p-4 rounded-md w-1/2">
            <button
              className="self-end text-xl mb-8"
              onClick={() => setShowMessagePopOut(false)}
            >
              X
            </button>
            <p className="font-bold text-2xl mb-8">Report Message : </p>
            <p className="text-xl border-2 border-black p-2 max-h-60 max-1/2 text-center overflow-y-auto">
              {message}
            </p>
          </div>
        </div>
      )}

      {showPopout && (
        <div className="fixed top-0 left-0 w-screen h-screen z-20 flex justify-center items-center">
          <div
            className="bg-black bg-opacity-50 absolute top-0 left-0 w-full h-full"
            onClick={togglePopOut}
          />
          {messages ? (
            <AdminUserChatPopOut messages={messages} onClose={togglePopOut} clearRoom={clearRoom}/>
          ) : (
            <p>Loading messages...</p>
          )}
        </div>
      )}
    </div>
  );
}
