import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { getGraphData } from "../api/AdminApi";
import { Typography, CircularProgress, Paper, FormControl, InputLabel, Select, MenuItem } from '@material-ui/core';


export default function StatisticsGraph() {

  const [graphData, setGraphData] = useState(null);
  const [timeInterval, setTimeInterval] = useState('month'); // Default selection is month

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getGraphData();
        setGraphData(data.data.graphData);
      } catch (error) {
        console.error("Error fetching graph data:", error);
      }
    }

    fetchData();
  }, []);

  if (!graphData) {
    return (
      <Paper className='className="p-4 flex flex-col items-center justify-center w-full mt-8 rounded '>
        <CircularProgress />
        <Typography>Loading...</Typography>
      </Paper>
    );
  }

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const monthData = {};

  graphData.orderCreationDates.forEach(date => {
    const monthIndex = new Date(date).getMonth();
    const month = months[monthIndex];
    monthData[month] = monthData[month] || { orders: 0, users: 0, cars: 0 };
    monthData[month].orders++;
  });

  graphData.userRegistrationDates.forEach(date => {
    const monthIndex = new Date(date).getMonth();
    const month = months[monthIndex];
    monthData[month] = monthData[month] || { orders: 0, users: 0, cars: 0 };
    monthData[month].users++;
  });

  graphData.carRegistrationDates.forEach(date => {
    const monthIndex = new Date(date).getMonth();
    const month = months[monthIndex];
    monthData[month] = monthData[month] || { orders: 0, users: 0, cars: 0 };
    monthData[month].cars++;
  });

  const chartData = months.map(month => ({
    month,
    ...monthData[month],
  }));

  let chartComponent = null;

  if (timeInterval === 'year') {
    const yearlyData = {};

    graphData.orderCreationDates.forEach(date => {
      const year = new Date(date).getFullYear();
      yearlyData[year] = yearlyData[year] || { orders: 0, users: 0, cars: 0 };
      yearlyData[year].orders++;
    });

    graphData.userRegistrationDates.forEach(date => {
      const year = new Date(date).getFullYear();
      yearlyData[year] = yearlyData[year] || { orders: 0, users: 0, cars: 0 };
      yearlyData[year].users++;
    });

    graphData.carRegistrationDates.forEach(date => {
      const year = new Date(date).getFullYear();
      yearlyData[year] = yearlyData[year] || { orders: 0, users: 0, cars: 0 };
      yearlyData[year].cars++;
    });

    const years = Object.keys(yearlyData).sort();
    const yearlyChartData = years.map(year => ({
      year,
      ...yearlyData[year],
    }));

    chartComponent = (
      <BarChart width={1650} height={400} data={yearlyChartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="year" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="orders" fill="#000000" />   
        <Bar dataKey="users" fill="#cc6200" />    
        <Bar dataKey="cars" fill="#190404" />
      </BarChart>
    );
  } else if (timeInterval === 'day') {
    const dayData = {};

    graphData.orderCreationDates.forEach(date => {
      const day = new Date(date).toLocaleDateString();
      dayData[day] = dayData[day] || { orders: 0, users: 0, cars: 0 };
      dayData[day].orders++;
    });

    graphData.userRegistrationDates.forEach(date => {
      const day = new Date(date).toLocaleDateString();
      dayData[day] = dayData[day] || { orders: 0, users: 0, cars: 0 };
      dayData[day].users++;
    });

    graphData.carRegistrationDates.forEach(date => {
      const day = new Date(date).toLocaleDateString();
      dayData[day] = dayData[day] || { orders: 0, users: 0, cars: 0 };
      dayData[day].cars++;
    });

    const days = Object.keys(dayData).sort();
    const dailyChartData = days.map(day => ({
      day,
      ...dayData[day],
    }));

    chartComponent = (
      <BarChart width={1650} height={400} data={dailyChartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="day" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="orders" fill="#000000" />   
        <Bar dataKey="users" fill="#cc6200" />    
        <Bar dataKey="cars" fill="#190404" />
      </BarChart>
    );
  } else {
    chartComponent = (
      <BarChart width={1660}  height={400} data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="orders" fill="#000000" />   
        <Bar dataKey="users" fill="#cc6200" />    
        <Bar dataKey="cars" fill="#190404" />
      </BarChart>
    );
  }
  return (
    <Paper className=" flex flex-col items-center justify-center w-full mt-8 ">
      <div className="flex items-center justify-center w-full p-2 m-2">
        <Typography className='w-full p-2 m-2' variant="h6">Statistics Graph</Typography>
        <FormControl className='p-2 m-2 w-2/12'>
          <InputLabel>Time Frame</InputLabel>
          <Select
            value={timeInterval}
            onChange={(event) => setTimeInterval(event.target.value)}
          >
            <MenuItem value="month">Month</MenuItem>
            <MenuItem value="year">Year</MenuItem>
            <MenuItem value="day">Day</MenuItem>
          </Select>
        </FormControl>
      </div>
      <div className="w-full p-2 relative">
        {chartComponent}
      </div>
    </Paper>
  );
}
