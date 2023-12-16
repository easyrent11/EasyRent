import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getOrderById, getAllUserDetails } from "../api/UserApi";
import { getCar } from "../api/CarApi";
import { formatDate } from "../HelperFunctions/FormatDate";

export default function Report() {
  const [order, setOrder] = useState({});
  const [renter, setRenter] = useState({});
  const [rentee, setRentee] = useState({});
  const [car, setCar] = useState({});
  const [totalPrice, setTotalPrice] = useState(0);

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
      const numberOfDays = Math.ceil(timeDifference / (1000 * 3600 * 24));

      // Calculate the total renting price
      const total = numberOfDays * car.Rental_Price_Per_Day;
      setTotalPrice(total);
    }
  }, [order, car]);

  return (
    <div className="container mx-auto mt-8 p-4">
      <h1 className="text-2xl font-bold mb-4">Order Report</h1>
      <section className="mb-8">
        <h2 className="text-xl font-bold mb-2">Order Details</h2>
        <table className="table-auto w-full">
          <tbody>
            <tr>
              <td className="font-bold">Order ID : </td>
              <td>{order.Order_Id}</td>
            </tr>
            <tr>
              <td className="font-bold">Start Date : </td>
              <td>{formatDate(order.Start_Date)}</td>
            </tr>
            <tr>
              <td className="font-bold">End Date : </td>
              <td>{formatDate(order.End_Date)}</td>
            </tr>
            <tr>
              <td className="font-bold">Start Time :</td>
              <td>{order.Start_Time}</td>
            </tr>
            <tr>
              <td className="font-bold">End Time : </td>
              <td>{order.End_Time}</td>
            </tr>
            <tr>
              <td className="font-bold">Total Rental Time</td>
              <td>
                {order.Start_Date && order.End_Date && (
                  <>
                    {new Date(order.End_Date).getDate() -
                      new Date(order.Start_Date).getDate()}
                    {""} day/s
                  </>
                )}
              </td>
            </tr>

            <tr>
              <td className="font-bold">Order Date : </td>
              <td>{formatDate(order.Order_Date)}</td>
            </tr>
          </tbody>
        </table>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold mb-2">Renter Details</h2>
        <table className="table-auto w-full">
          <tbody>
            <tr>
              <td className="font-bold">Name:</td>
              <td>
                {renter.first_name} {renter.last_name}
              </td>
            </tr>
            <tr>
              <td className="font-bold">Email:</td>
              <td>{renter.email}</td>
            </tr>
            <tr>
              <td className="font-bold">Phone Number:</td>
              <td>{renter.phone_number}</td>
            </tr>
            {/* Add more renter details as needed */}
          </tbody>
        </table>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold mb-2">Rentee Details</h2>
        <table className="table-auto w-full">
          <tbody>
            <tr>
              <td className="font-bold">Name:</td>
              <td>
                {rentee.first_name} {rentee.last_name}
              </td>
            </tr>
            <tr>
              <td className="font-bold">Email:</td>
              <td>{rentee.email}</td>
            </tr>
            <tr>
              <td className="font-bold">Phone Number:</td>
              <td>{rentee.phone_number}</td>
            </tr>
            {/* Add more rentee details as needed */}
          </tbody>
        </table>
      </section>

      <section>
        <h2 className="text-xl font-bold mb-2">Car Details</h2>
        <table className="table-auto w-full">
          <tbody>
            <tr>
              <td className="font-bold">Manufacturer:</td>
              <td>{car.Manufacturer_Code}</td>
            </tr>
            <tr>
              <td className="font-bold">Model:</td>
              <td>{car.model_code}</td>
            </tr>
            <tr>
              <td className="font-bold">Plates Number:</td>
              <td>{car.Plates_Number}</td>
            </tr>
            {/* Add more car details as needed */}
          </tbody>
        </table>
      </section>

      <div className="mt-8">
        <h2 className="text-xl font-bold mb-2">Total Renting Price</h2>
        <p className="text-lg font-bold text-[#CC6200]">₪{totalPrice}</p>
      </div>
    </div>
  );
}
