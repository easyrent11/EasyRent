import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { getGraphData } from "../api/AdminApi";
import { Typography, CircularProgress, Paper, FormControl, InputLabel, Select, MenuItem } from '@material-ui/core';

export default function StatisticsGraph() {
  const [graphData, setGraphData] = useState(null);
  const [dataType, setDataType] = useState('order');
  const [timeInterval, setTimeInterval] = useState('month');

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getGraphData();
        setGraphData(data.data.graphData);
        console.log("data", data);
      } catch (error) {
        console.error("Error fetching graph data:", error);
      }
    }

    fetchData();
  }, []);


  if (!graphData) {
    return (
      <Paper className="p-4 flex flex-col items-center justify-center w-full mt-8 rounded">
        <CircularProgress />
        <Typography>Loading...</Typography>
      </Paper>
    );
  }

  const getDataForTimeInterval = (interval, dataKey) => {
    const data = {};
    console.log("data key = ", dataKey);
    graphData[dataKey].forEach(date => {
      const key = interval === 'day' ? new Date(date).toLocaleDateString() :
        interval === 'year' ? new Date(date).getFullYear() :
          months[new Date(date).getMonth()];

      if (key in data) {
        data[key]++;
      } else {
        data[key] = 1;
      }
    });

    return data;
  };

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const chartData = getDataForTimeInterval(timeInterval, `${dataType === 'user' ? 'userRegistrationDates' : dataType === 'car' ? 'carRegistrationDates' : 'orderCreationDates' }`);

  let fill;

  switch (dataType) {
    case 'users':
      fill = '#cc6200';
      break;
    case 'cars':
      fill = '#F5BA02';
      break;
    default:
      fill = '#000000';
      break;
  }

  const selectedData = Object.keys(chartData).map(label => ({
    label,
    [dataType]: chartData[label],
  }));

  return (
    <Paper>
      <div className="flex items-center justify-center w-full">
        <Typography className='w-full  p-2 m-2' variant="h6">Statistics Graph</Typography>

        <FormControl className='p-2 m-2 w-2/12'>
          <InputLabel className='m-2 p-2'>Data Type</InputLabel>
          <Select
            value={dataType}
            className='m-2 p-2'
            onChange={(event) => setDataType(event.target.value)}
          >
            <MenuItem value="order">Orders</MenuItem>
            <MenuItem value="user">Users</MenuItem>
            <MenuItem value="car">Cars</MenuItem>
          </Select>
        </FormControl>

        <FormControl className='p-2 m-2 w-2/12'>
          <InputLabel className='m-2 p-2'>Time Frame</InputLabel>
          <Select
            className='m-2 p-2'
            value={timeInterval}
            onChange={(event) => setTimeInterval(event.target.value)}
          >
            <MenuItem value="month">Month</MenuItem>
            <MenuItem value="year">Year</MenuItem>
            <MenuItem value="day">Day</MenuItem>
          </Select>
        </FormControl>

      </div>
      <div className="w-full  hidden 2xl:block p-2 relative">
        <BarChart width={1560} height={500} data={selectedData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="label" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey={dataType} fill={fill} />
        </BarChart>
      </div>
    </Paper>
  );
}
