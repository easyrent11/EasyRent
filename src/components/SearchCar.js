import React, { useState } from 'react';
import Select from 'react-select';
import { Cities } from '../res/Cities';
import { CarTypes } from '../res/CarTypes';

export default function SearchCarForm() {
  const [location, setLocation] = useState('');
  const [pickDate, setPickDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [carType, setCarType] = useState('');


  const handleLocationChange = (selectedOption) => {
    setLocation(selectedOption.value);
  };

  const handlePickDateChange = (e) => {
    setPickDate(e.target.value);
  };

  const handleReturnDateChange = (e) => {
    setReturnDate(e.target.value);
  };

  const handleCarTypeChange = (selectedOption) => {
    setCarType(selectedOption.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
    // You can access the form values using the state variables (location, pickDate, returnDate, carType)
    console.log('Form submitted:', location, pickDate, returnDate, carType);
  };

  return (
    <form className='flex item-center justify-center p-4 w-1/2 ' onSubmit={handleSubmit}>
      <div className='flex-1  mr-2'>
        <Select
          id="location"
          value={{ value: location, label: location }}
          onChange={handleLocationChange}
          options={Cities}
        />
      </div>

      <div className='flex items-center justify-center flex-1 mr-2 bg-white'>
        <input type="date" id="pickDate" value={pickDate} onChange={handlePickDateChange} />
      </div>

      <div className='flex items-center justify-center flex-1 mr-2 bg-white'>
        <input type="date" id="returnDate" value={returnDate} onChange={handleReturnDateChange} />
      </div>

      <div className='flex-1 mr-2'>
        <Select
          id="carType"
          value={{ value: carType, label: carType }}
          onChange={handleCarTypeChange}
          options={CarTypes}
        />
      </div>

      <button className='bg-black text-1xl text-white p-1 w-1/5 ' type="submit">Search</button>
    </form>
  );
};

