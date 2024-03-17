import React, { useState, useEffect } from 'react';
import { getAllOrders } from '../api/UserApi';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { PieChart, Pie, ResponsiveContainer, Cell } from 'recharts';

const COLORS = ['#000000', '#cc6200', '#F5BA02'];

export default function AdminOrdersStatisticsCircle() {
  const [orderData, setOrderData] = useState({
    declined: 0,
    pending: 0,
    accepted: 0,
  });

  useEffect(() => {
    async function fetchOrders() {
      try {
        const response = await getAllOrders();
        const orders = response.data;

        const declinedOrders = orders.filter(order => order.status === 'declined').length;
        const pendingOrders = orders.filter(order => order.status === 'pending').length;
        const acceptedOrders = orders.filter(order => order.status === 'accepted').length;

        setOrderData({
          declined: declinedOrders,
          pending: pendingOrders,
          accepted: acceptedOrders,
        });
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    }

    fetchOrders();
  }, []);
  const totalOrders = orderData.declined + orderData.pending + orderData.accepted;


  const data = [
    { name: 'Declined', value: orderData.declined },
    { name: 'Pending', value: orderData.pending },
    { name: 'Accepted', value: orderData.accepted },
  ];

  return (
    <div className="text-center w-full 2xl:w-1/4 mt-1 p-4 bg-white rounded-md flex-col  flex items-center justify-center">
      <Typography variant="h5" component="h3" gutterBottom>
        Total Orders: {totalOrders}
      </Typography>
      <Paper className='w-full'>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={120}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </Paper>
      <div className="mt-4 w-full">
      <div className="flex items-center   justify-between w-full mb-2">
          <div className='flex items-center'>
            <span className="w-4 h-4 bg-black mr-2 rounded-full inline-block"></span>
            <p>Declined</p>
          </div>
          <p>{orderData.declined} </p>
        </div>

        <div className="flex items-center   justify-between w-full mb-2">
          <div className='flex items-center'>
            <span className="w-4 h-4 bg-[#cc6200] mr-2 rounded-full inline-block"></span>
            <p>Pending</p>
          </div>
          <p>{orderData.pending} </p>
        </div>

        <div className="flex items-center   justify-between w-full mb-2">
          <div className='flex items-center'>
            <span className="w-4 h-4 bg-[#F5BA02] mr-2 rounded-full inline-block"></span>
            <p>Accepted</p>
          </div>
          <p>{orderData.accepted} </p>
        </div>
      </div>
    </div>
  );
}
