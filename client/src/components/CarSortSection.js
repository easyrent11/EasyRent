import React, { useContext } from 'react';
import Select from 'react-select';
import { AllCarsContext } from '../contexts/AllCarsContext';

export default function CarSortSection() {
    
    // getting all of the cars list from the context so we can preform a sort and update the list after.
    const {allCars,setAllCars} = useContext(AllCarsContext);
    
    const handleSort = (sortOption) => {
        let sortedCarsList = [...allCars]; // Create a copy of the original car list
        console.log(sortOption === 'priceLowToHigh');

        if(sortOption === 'priceLowToHigh'){
            sortedCarsList.sort((a, b) => a.Rental_Price_Per_Day - b.Rental_Price_Per_Day);
        }
        else if(sortOption === 'priceHighToLow'){
            sortedCarsList.sort((a, b) => b.Rental_Price_Per_Day - a.Rental_Price_Per_Day);
        }
        console.log(sortedCarsList);
        setAllCars(sortedCarsList);
    }
    
    // the select combo box options.
    const options = [
        { value: 'priceLowToHigh', label: 'Price: Low to High' },
        { value: 'priceHighToLow', label: 'Price: High to Low' },
    ];

    const customStyles = {
        control: (provided, state) => ({
          ...provided,
          backgroundColor: '#f6f6f6',
          borderRadius: '20px',
        }),
       
        placeholder: (provided) => ({
          ...provided,
          color: 'black',
        }),
      };

    // event handler for select change value.
    const handleOptionSelect = (selectedOption) => {
        handleSort(selectedOption.value);
        selectedOption.label = "Select an option";
    };

    return (
        <div className="flex justify-end items-center w-4/5 bg-[#f6f6f6] p-4 m-4">
            <p className="text-xl  p-2 m-2">Sort By</p>
            <Select
                className="w-3/12"
                styles={customStyles}
                options={options}
                onChange={handleOptionSelect}
                placeholder="Select an option"
                isSearchable={false}
            />
        </div>
    );
}
