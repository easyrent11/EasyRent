import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getOrderById, getAllUserDetails } from "../api/UserApi";
import { getCar } from "../api/CarApi";
import { formatDate } from "../HelperFunctions/FormatDate";
import { diff } from "../HelperFunctions/TimeDifference";

export default function Report() {
  const [order, setOrder] = useState({});
  const [renter, setRenter] = useState({});
  const [rentee, setRentee] = useState({});
  const [car, setCar] = useState({});
  const [totalPrice, setTotalPrice] = useState(30);

  const { orderId } = useParams();

  useEffect(() => {
    // Fetch the order by ID
    getOrderById(orderId)
      .then((res) => {
        setOrder(res.data);
        // Fetch the renter by ID
        getAllUserDetails(res.data.Renter_Id)
          .then((res) => {
            setRenter(res.data[0]);
          })
          .catch((err) => {
            console.log(err);
          });
        // Fetch the rentee by ID
        getAllUserDetails(res.data.Rentee_id)
          .then((res) => {
            setRentee(res.data[0]);
          })
          .catch((err) => {
            console.log(err);
          });
        // Fetch the car by Plates_Number
        getCar(res.data.Car_Plates_Number)
          .then((res) => {
            setCar(res.data[0]);
          })
          .catch((err) => {
            console.log(err);
          });
      })
      .catch((err) => {
        console.log(err);
      });
  }, [orderId]);

  useEffect(() => {
    if (order.Start_Date && order.End_Date && car.Rental_Price_Per_Day) {
      // Parse the date strings into Date objects
      const startDate = new Date(order.Start_Date);
      const endDate = new Date(order.End_Date);

      // Calculate the number of days between start and end dates
      const timeDifference = endDate.getTime() - startDate.getTime();
      let numberOfDays = Math.ceil(timeDifference / (1000 * 3600 * 24));
      if (numberOfDays === 0) {
        numberOfDays = 1;
      }

      // Calculate the total renting price
      const total = numberOfDays * car.Rental_Price_Per_Day;
      setTotalPrice(total);
    }
  }, [order, car]);

  return (
    <div className="bg-white w-full lg:w-4/5 rounded-md shadow-2xl mx-auto mt-8 p-4">
    <h1 className="text-2xl p-2 mt-2 text-center font-bold mb-4">Order Report</h1>
  
  <div className="flex flex-col lg:grid lg:grid-cols-2 gap-4">
    {/* Order Details */}
    <section className="bg-[#f6f6f6] rounded-lg pb-8">
      <h2 className="text-xl p-2 font-bold">Order Details</h2>
      <table className="table-auto w-full">
        <tbody>
          <tr className="flex p-2 items-center w-full">
            <td className="p-2 text-xl font-bold">Order ID:</td>
            <td className="text-lg">{order.Order_Id}</td>
          </tr>
          <tr className="flex p-2 items-center w-full">
            <td className="p-2 text-xl font-bold">Start Date:</td>
            <td className="text-lg">{formatDate(order.Start_Date)}</td>
          </tr>
          <tr className="flex p-2 items-center w-full">
            <td className="p-2 text-xl font-bold">End Date:</td>
            <td className="text-lg">{formatDate(order.End_Date)}</td>
          </tr>
          <tr className="flex p-2 items-center w-full">
            <td className="p-2 text-xl font-bold">Total Rental Time:</td>
            <td className="text-lg">
              {order.Start_Date && order.End_Date && (
                <>
                  {new Date(order.End_Date).getDate() -
                    new Date(order.Start_Date).getDate() !== 0
                    ? new Date(order.End_Date).getDate() -
                      new Date(order.Start_Date).getDate()
                    : diff(order.Start_Time, order.End_Time)}
                  {new Date(order.End_Date).getDate() -
                    new Date(order.Start_Date).getDate() !== 0
                    ? " day/s"
                    : " hours"}
                </>
              )}
            </td>
          </tr>
          <tr className="flex p-2  items-center w-full">
            <td className="p-2 text-xl font-bold">Order Date:</td>
            <td className="text-lg">{formatDate(order.Order_Date)}</td>
          </tr>
        </tbody>
      </table>
    </section>

    {/* Car Details */}
    <section className="bg-[#f6f6f6]  rounded-lg  pb-8">
      <h2 className="text-xl p-2 font-bold">Car Details</h2>
      <table className="table-auto w-full">
        <tbody>
          <tr className="flex p-2 items-center w-full">
            <td className="p-2 text-xl font-bold">Manufacturer:</td>
            <td className="text-lg">{car.Manufacturer_Code}</td>
          </tr>
          <tr className="flex p-2 items-center w-full">
            <td className="p-2 text-xl font-bold">Model:</td>
            <td className="text-lg">{car.model_code}</td>
          </tr>
          <tr className="flex p-2 items-center w-full">
            <td className="p-2 text-xl font-bold">Plates Number:</td>
            <td className="text-lg">{car.Plates_Number}</td>
          </tr>
        </tbody>
      </table>
    </section>

    {/* Rentee Details */}
    <section className="bg-[#f6f6f6]  rounded-lg pb-8">
      <h2 className="text-xl p-2 font-bold">Rentee Details</h2>
      <table className="table-auto w-full">
        <tbody>
          <tr className="flex p-2 items-center w-full">
            <td className="p-2 text-xl font-bold">Name:</td>
            <td className="text-lg">
              {rentee.first_name} {rentee.last_name}
            </td>
          </tr>
          <tr className="flex p-2 items-center w-full">
            <td className="p-2 text-xl font-bold">Email:</td>
            <td className="text-lg">{rentee.email}</td>
          </tr>
          <tr className="flex p-2 items-center w-full">
            <td className="p-2 text-xl font-bold">Phone Number:</td>
            <td className="text-lg">0{rentee.phone_number}</td>
          </tr>
        </tbody>
      </table>
    </section>

    {/* Renter Details */}
    <section className="bg-[#f6f6f6]  rounded-lg pb-8">
      <h2 className="text-xl p-2 font-bold">Renter Details</h2>
      <table className="table-auto w-full">
        <tbody>
          <tr className="flex p-2 items-center w-full">
            <td className="p-2 text-xl font-bold">Name:</td>
            <td className="text-lg">
              {renter.first_name} {renter.last_name}
            </td>
          </tr>
          <tr className="flex p-2 items-center w-full">
            <td className="p-2 text-xl font-bold">Email:</td>
            <td className="text-lg">{renter.email}</td>
          </tr>
          <tr className="flex p-2 items-center w-full">
            <td className="p-2 text-xl font-bold">Phone Number:</td>
            <td className="text-lg">0{renter.phone_number}</td>
          </tr>
        </tbody>
      </table>
    </section>
  </div>

  {/* Total Renting Price */}
  <div className="mt-8  p-4 text-center">
    <h2 className="text-2xl font-bold mb-2">Total Renting Price</h2>
    <p className="text-2xl font-bold text-[#CC6200]">₪{totalPrice}</p>
  </div>
</div>

  );
}
