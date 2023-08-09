import React, { useContext, useState,useEffect } from 'react'
import AllCarsSection from '../components/AllCarsSection';
import CarSortSection from "../components/CarSortSection";
import CarFilterSection from '../components/CarFilterSection';
import SearchCar from '../components/SearchCar';
import { UserProfileDetails } from '../contexts/UserProfileDetails';
import { useUserOrders } from '../contexts/UserOrdersContext';




export default function UserLayout() {
  const { userOrders, userRenteeOrders } = useUserOrders();
  const userDetails = useContext(UserProfileDetails);
  const [notificationsRoomId,setNotificationsRoomId] = useState(null);

  function joinNotificationsRoom(){
    axios
    .post("http://localhost:3001/user/joinnotificationsroom", userId)
    .then((response) => {
      console.log(response);
      setNotificationsRoomId(response.data.room);
      socket.emit("join_notifications_room", response.data.room);
    })
    .catch((error) => {
      console.error("Error creating/retrieving chat room:", error);
    });
  }
  if(localStorage.get('userId')){
    joinNotificationsRoom();
  }
  
  useEffect(() => {
    // Add an event listener to receive notifications
    socket.on("send_notification", (notification) => {
      console.log(notification);
    });

    return () => {
      socket.off("send_notification");
    };
  }, []);
  return (
    <>
        <h1 className="font-lobster text-6xl">Welcome {userDetails.userDetails.first_name} </h1>
          <SearchCar/>

        <h1 className='text-3xl mb-4'>All Available Cars : </h1>
        <div className='flex  items-start justify-around p-4 m-4 w-3/4 '>

          <div className='bg-[#f6f6f6] rounded-md p-4 h-full'>
          <CarFilterSection/>
          </div>
        
          <div className='flex flex-col items-center w-4/5'>
            <CarSortSection/>
            <AllCarsSection/>
          </div>
        </div>
      </>
  )
}


