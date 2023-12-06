import React, { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Carousel } from "@material-tailwind/react";
import PersonIcon from "@mui/icons-material/Person";
import { TbManualGearbox } from "react-icons/tb";
import { FaCogs } from "react-icons/fa";
import { getAllUserDetails } from "../api/UserApi";
import { sendOrderRequest } from "../api/UserApi";
import { useUserOrders } from "../contexts/UserOrdersContext";
import { FaTimes } from "react-icons/fa";
import { Link } from "react-router-dom";
import { xorDecrypt } from "../HelperFunctions/Encrypt";
import { notify } from "../HelperFunctions/Notify";
import { getCar } from "../api/CarApi";
import io from 'socket.io-client';

export default function CarView() {

  let flag = false;

  const navigate = useNavigate();
  const [startTime, setStartTime] = useState("10:00");
  const [endTime, setEndTime] = useState("10:00");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // State variables for car owner and for error message.
  const [carOwnerName, setCarOwnerName] = useState("");
  const [carOwnerPicture, setCarOwnerPicture] = useState("");
  const [ownerId, setOwnerId] = useState("");
  const [car, setCar] = useState([]);
  const [socket, setSocket] = useState(null);

  const { setUserRenteeOrders } = useUserOrders();
  const secretKey = process.env.REACT_APP_ENCRYPTION_KEY;

  //getting encrypted the plates number out of the paramaters that are passed in the car component.
  let { encryptedPlatesNumber } = useParams();
  // decryping the encrypted plates number from the parameters.
  let platesNumber = xorDecrypt(encryptedPlatesNumber, secretKey);

  // use effect to connect to the socket.
  useEffect(() => {
    const socket = io.connect("http://localhost:3001");
    setSocket(socket);
  
    // Clean up when the component unmounts
    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, []);
 
  // usememo that will fetch a car and its images based on plates number
  useMemo(() => {
    getCar(platesNumber)
      .then((res) => {
        setCar(res.data[0]);
      })
      .catch((error) => {
        notify("error", error);
      });
  }, []);

  const carImageUrls = useMemo(() => {
    if (car && car.car_urls) {
      return car.car_urls.split(",");
    }
    return [];
  }, [car]);

  // use effect that will fetch all user details based on renter id.
  useEffect(() => {
    getAllUserDetails(car.Renter_Id)
      .then((result) => {
        setCarOwnerName(result.data[0].first_name);
        setCarOwnerPicture(result.data[0].picture);
        setOwnerId(result.data[0].Id);
      })
      .catch((err) => {
        notify("error", err);
      });
  }, [car]);

  // method that will reset the form fields.
  const resetFields = () => {
    setStartTime("10:00");
    setEndTime("10:00");
    setStartDate("");
    setEndDate("");
  };

  // function that generates the current date of an order in 'yy:mm:dd hh:mm:ss' format 
  function getCurrentDate(){
    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleString('en-US', { 
    year: 'numeric', 
    month: '2-digit', 
    day: '2-digit', 
    hour: '2-digit', 
    minute: '2-digit', 
    second: '2-digit' 
    });
    return formattedDate;
  }


  // get the rentee id.
  let renteeId = localStorage.getItem("userId");
  renteeId = renteeId ? parseInt(renteeId) : null;

  // function that will send the order request to the renter
  const sendCarOrderRequest = () => {

    // checking if the user provided the order details.
    if (!startDate || !endDate || !startTime || !endTime) {
      notify("error", "Error: Please fill in all required fields.");
      return;
    }
    // Check if the startDate is smaller than the endDate
    if (new Date(startDate) >= new Date(endDate)) {
      notify("error", "Error: Start date must be smaller than the end date.");
      return;
    }
    // Check if the startDate is smaller than the endDate
    if (new Date(startDate) < new Date() || new Date(endDate) < new Date()) {
      notify(
        "error",
        "Error: Please pick a valid start date,end date that is not in the past"
      );
      return;
    }
    // Converting start and end times to Date objects
    const startTimeDate = new Date(`1970-01-01T${startTime}:00Z`);
    const endTimeDate = new Date(`1970-01-01T${endTime}:00Z`);

    // Calculating the time difference in milliseconds
    const timeDifferenceMs = endTimeDate - startTimeDate;

    // Checking if the startDate and endDate are the same
    const isSameDate = startDate === endDate;

    // Checking  if the time difference is less than one hour (3600000 milliseconds) when the start date and end date are the same
    if (isSameDate && timeDifferenceMs < 3600000) {
      console.log("Error: Car rents should be only from 1 hour and above.");
      return;
    }
    // creating an order details object.
    const orderRequest = {
      Start_Date: startDate,
      End_Date: endDate,
      Car_Plates_Number: car.Plates_Number,
      Rentee_Id: renteeId,
      Start_Time: startTime,
      End_Time: endTime,
      status: "pending",
      Renter_Id: ownerId,
      Order_Date: getCurrentDate()
    };
    console.log("order request = ",orderRequest);
    // sending the order to the renter.
    sendOrderRequest(orderRequest) 
      .then((res) => {
        notify("success", "Order request sent successfully!");
        setUserRenteeOrders((prevRenteeOrders) => [
          ...prevRenteeOrders,
          res.data.order,
        ]);
        socket.emit('notification',{userId:ownerId, message: 'You have a new order on one of your cars', type:"order-request-notification", orderId:res.data.order.Order_Id
      });
        resetFields();
      })
      .catch((err) => {
        console.log(err);
        notify("error", "Failed to send order request!");
      });
  };
  // handling the User View window close click.
  const handleCloseCarView = () => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/homepage");
    } else {
      navigate("/DisplaySearchResults");
    }
  };

  return (
    <div className="shadow-lg min-h-full mb-4 border-2  bg-[#f6f6f6] rounded-lg flex flex-col items-center">
      <div className="text-right m-2  w-full ">
        <button
          className="p-2 m-2 rounded-md text-2xl text-gray-500 transform hover:scale-110"
          onClick={handleCloseCarView}
        >
          <FaTimes />
        </button>
      </div>
      <section className="w-full max-w-3xl mt-10">
        {/* A Photo slider that has all the car images where we can select and view them */}
        <Carousel className="rounded-md">
          {carImageUrls.length > 0 ? (
            carImageUrls.map((imageUrl, index) => (
              <figure key={index} className="rounded-xl">
                <img
                  src={`http://localhost:3001/images/${imageUrl}`}
                  alt={`Car Pic ${index + 1}`}
                  className="object-cover w-full h-80"
                />
              </figure>
            ))
          ) : (
            <figure>
              <img src="/images/noImages.png" alt="No Images" />
            </figure>
          )}
        </Carousel>
      </section>
      {/* Displaying additional car information. */}

      <div className="flex p-2 m-2">
        <section className="w-full max-w-3xl mt-10 p-6 mr-4  bg-white shadow-md rounded-lg">
          <h2 className="text-2xl">Car Owner : </h2>
          <figure className="flex flex-col items-center justify-center ">
            <img
              src={`http://localhost:3001/images/${carOwnerPicture}`}
              className="border-2 flex w-32 h-32 rounded-full"
            />
            <figcaption className="text-2xl">{carOwnerName}</figcaption>
          </figure>

          <div className="flex flex-col justify-around items-start mb-4 ">
            <h2 className="text-2xl font-bold">
              {car.Manufacturer_Code} {car.model_code}
            </h2>
            <p className="text-gray-500 text-lg">Year: {car.Year}</p>
          </div>

          <div className="flex items-center justify-between ">
            <div className="w-full">
              <p className="text-gray-700 text-xl mb-2">
                Features and Specifications:
              </p>
              <ul className="  flex flex-col justify-center items-start w-full">
                <li>
                  <PersonIcon className="inline-block text-3xl m-2" />
                  {car.Seats_Amount}
                </li>
                <li>
                  <TbManualGearbox className="inline-block text-3xl m-2" />
                  {car.Transmission_type}
                </li>
                <li>
                  <FaCogs className="inline-block text-3xl m-2" />

                  {car.Engine_Type}
                </li>
              </ul>
            </div>
          </div>
        </section>

        <section className="w-full max-w-3xl mt-10 p-6 bg-white shadow-md rounded-lg">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Book this car</h2>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              From Date:
            </label>
            <input
              className="border-2 border-gray-300 rounded-md p-2 w-full"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Start Time:
            </label>
            <input
              className="border-2 border-gray-300 rounded-md p-2 w-full"
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              To Date:
            </label>
            <input
              className="border-2 border-gray-300 rounded-md p-2 w-full"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              End Time:
            </label>
            <input
              className="border-2 border-gray-300 rounded-md p-2 w-full"
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
            />
          </div>

          <p className="text-gray-500 mb-4">
            You'll pickup and return the key by meeting with the owner face to
            face.
          </p>

          <section className="flex flex-col ">
            <div>
              <p className="text-lg font-bold mb-2">Total Price :</p>
              <p className="text-xl font-bold  text-[#CC6200]">
                ₪{car.Rental_Price_Per_Day}/day
              </p>
            </div>

            <div>
              <button
                onClick={sendCarOrderRequest}
                className="bg-[#CC6200] text-white py-2 px-4 rounded-lg m-1"
              >
                Send Request
              </button>
              <button className="bg-[#CC6200] text-white py-2 px-4 rounded-lg m-1">
                <Link to="/ChatApp">Start Chat with Seller</Link>
              </button>
            </div>
          </section>
        </section>
      </div>
    </div>
  );
}
