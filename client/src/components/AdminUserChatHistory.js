import React, { useState, useEffect } from 'react';
import { getMessagesForRoom, getRoomForUser ,getAllUserDetails} from '../api/UserApi'; 
import { notify } from '../HelperFunctions/Notify';
import AdminUserChatPopOut from "../components/AdminUserChatPopOut";


export default function AdminUserChatHistory({ userId }) {
  const [chatRooms, setChatRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [messages, setMessages] = useState([]);
  const [showPopout, setShowPopout] = useState(false); // State to manage pop-out visibility


  useEffect(() => {
    getRoomForUser(userId)
      .then(response => setChatRooms(response.data))
      .catch((error) => notify("error", error));
  }, [userId]);

  
  useEffect(() => {
    if (selectedRoom) {
      getMessagesForRoom(selectedRoom)
        .then((res) => {
          console.log(res);
          const messagesWithDetails = res.data.map( (message) => {
            const senderId = message.user_id;
            const chatRoom = chatRooms.find(room => room.id === selectedRoom);
            const recipientId = senderId === chatRoom.user1_id ? chatRoom.user2_id : chatRoom.user1_id;
            const senderPromise =  getAllUserDetails(senderId);
            const recipientPromise = getAllUserDetails(recipientId);
            
  
            return Promise.all([senderPromise, recipientPromise])
              .then(([senderDetails, recipientDetails]) => {
                console.log(senderDetails,recipientDetails);
                return {
                  ...message,
                  senderName: senderDetails.data[0].first_name,
                  recipientName: recipientDetails.data[0].first_name,
                };
              });
          });
  
          Promise.all(messagesWithDetails)
            .then((messagesWithNames) => {
              setMessages(messagesWithNames);
            })
            .catch((error) => {
              notify("error", error);
            });
        })
        .catch((error) => {
          notify("error", error);
        });
    }
  }, [selectedRoom]);
  
  const openPopout = () => {
    setShowPopout(true);
  };

  const closePopout = () => {
    setShowPopout(false);
  };


  return (
    <div className='p-4 w-4/5 flex flex-col items-center'>
      <h2 className='mt-8 mb-8 text-2xl font-bold'>Chat History for User {userId}</h2>
      <div className='flex items-center p-4 w-1/2 border border-black shadow-lg rounded-md bg-white justify-center flex-col'>
        <h3 className='mb-8 font-bold text-xl text-[#cc6200]'>Select a Chat Room to View Chat History</h3>
        <ul className=' w-full text-center p-4'>
          {chatRooms.map((room) => (
            <li
              key={room.id}
              onClick={() => setSelectedRoom(room.id)}
              className={`text-lg ${selectedRoom === room.id ? 'selected' : ''}`}
            >
              View Chats With User 
              <p onClick={openPopout} className='font-bold hover:text-[#cc6200] cursor-pointer'>
                {room.user1_id === userId ? room.user2_id : room.user1_id}
              </p>
            </li>
          ))}
        </ul>
      </div>
     
   
       {/* Display ChatPopout if showPopout is true */}
       {showPopout && (
        <div className="fixed top-0 left-0 w-screen h-screen z-20 flex justify-center items-center">
          <div className="bg-black bg-opacity-50 absolute top-0 left-0 w-full h-full" onClick={closePopout} />
          <AdminUserChatPopOut messages={messages} onClose={closePopout} />
        </div>
      )}
    </div>
  );
}