import React, { useState,useContext,useEffect } from "react";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import { CarMakesAndModels } from "../res/CarMakesAndModels";
import Select from "react-select";
import { Cities } from "../res/Cities";
import { AllCarsContext } from '../contexts/AllCarsContext';
import { filterCars } from "../res/CarFilters";


export default function CarFilterSection() {

  
  // getting all of the cars list from the context so we can preform a sort and update the list after.
  const {allCars,setAllCars} = useContext(AllCarsContext);

  // getting the list of manufacturers from the json object and sorting them.
  const sortedManufacturers = CarMakesAndModels.map((make) => ({
    value: make.brand,
    label: make.brand,
  })).sort((a, b) => a.label.localeCompare(b.label));

  // car filter use states.
  const [manufacturers, setManufacturers] = useState(sortedManufacturers);
  const [models, setModels] = useState([]);
  const [selectedManufacturer, setSelectedManufacturer] = useState(null);
  const [selectedModel, setSelectedModel] = useState("");
  const [selectedFromYear, setSelectedFromYear] = useState(null);
  const [selectedToYear, setSelectedToYear] = useState(null);
  const [color, setColor] = useState("");
  const [seatsAmount, setSeatsAmount] = useState("");
  const [engineType, setEngineType] = useState("");
  const [transmissionType, setTransmissionType] = useState("");
  const [rentalPricePerDay, setRentalPricePerDay] = useState(0);
  const [priceRange, setPriceRange] = useState([0, 500]);
  const [city, setCity] = useState("");
  const [city_name, setCityName] = useState("");
  const [selectedCityLabel, setSelectedCityLabel] = useState("Choose a city");

  
  
  const handleSeatsAmountChange = (selectedOption) => {
    setSeatsAmount(selectedOption);
  };

  const handleEngineTypeChange = (selectedOption) => {
    setEngineType(selectedOption);
  };
  
  const handleFromYearChange = (selectedOption) => {
    setSelectedFromYear(selectedOption);
  };

  const handleToYearChange = (selectedOption) => {
    setSelectedToYear(selectedOption);
  };

  const handleColorChange = (selectedOption) => {
    setColor(selectedOption);
  };

  const handleTransmissionTypeChange = (selectedOption) => {
    setTransmissionType(selectedOption);
  };
  const handleRentalPricePerDayChange = (value) => {
    setPriceRange(value);
  };
  const handleCityChange = (selectedOption) => {
    setCity(selectedOption.value);
    setCityName(selectedOption.label);
    setSelectedCityLabel(selectedOption.label);
  };

  //  =================== handle manufacturer and model change ==================== .
  const handleManufacturerChange = (selectedOption) => {
    setSelectedManufacturer(selectedOption);
    const manufacturerModels = CarMakesAndModels.find(
      (make) => make.brand === selectedOption.value
    ).models;
    setModels(manufacturerModels);
    setSelectedModel(""); // Clear the selected model when the manufacturer changes
  
    // Filter cars based on the selected manufacturer
    const filters = { manufacturer: selectedOption.value };
    const filteredCars = filterCars(allCars, filters);
    setAllCars(filteredCars);
  };

  const handleModelChange = (selectedOption) => {
    setSelectedModel(selectedOption.value);
  
    // Filter cars based on the selected model
    const filters = { manufacturer: selectedManufacturer.value, model: selectedOption.value };
    const filteredCars = filterCars(allCars, filters);
    setAllCars(filteredCars);
  };

  const handleFilterClick = () => {
    const filters = {
      manufacturer: selectedManufacturer ? selectedManufacturer.value : null,
      model: selectedModel,
      color: color,
      fromYear: selectedFromYear ? selectedFromYear.value : null,
      toYear: selectedToYear ? selectedToYear.value : null,
      transmissionType: transmissionType ? transmissionType.value : null,
      engineType: engineType ? engineType.value : null,
      lowPrice: priceRange[0],
      highPrice: priceRange[1],
    };
  
    const filteredCars = filterCars(allCars, filters);
    setAllCars(filteredCars);
  };


  return (
    <div className=" p-4">
      <h2>Filters</h2>
      <div className="my-4">
        <h3>Price Range</h3>
        <Slider
          range
          min={0}
          max={500}
          defaultValue={priceRange}
          onChange={handleRentalPricePerDayChange}
          tipFormatter={(value) => `₪${value}`}
        />
        <div>
          Price: ₪{priceRange[0]} - ₪{priceRange[1]}
        </div>
      </div>
      <div className="my-4">
        <h3>Location : </h3>
        <Select
              className="my-4 rounded-md"
              id="city"
              value={{ value: city, label: selectedCityLabel }}
              onChange={handleCityChange}
              noOptionsMessage={() => "Not Found"}
              options={Cities}
              required
            />
      </div>
      <div className="my-4 rounded-md">
        <h3>Manufacturer : </h3>
        <Select
          value={selectedManufacturer}
          onChange={handleManufacturerChange}
          options={manufacturers}
          placeholder="Select Manufacturer"
        />
      </div>
      <div className="my-4 rounded-md">
        <h3>Model : </h3>
        <Select
          classNamePrefix="react-select"
          options={models.map((model) => ({
            value: model,
            label: model,
          }))}
          value={
            selectedModel
              ? { value: selectedModel, label: selectedModel }
              : null
          }
          onChange={handleModelChange}
          isDisabled={!selectedManufacturer}
        />
      </div>
      <div className="my-4">
        <h3>Color : </h3>
        <Select
            value={color}
            onChange={handleColorChange}
            options={[
              "red",
              "black",
              "blue",
              "green",
              "yellow",
              "orange",
              "purple",
              "pink",
              "gray",
              "brown",
              "white",
            ].map((colorOption) => ({
              value: colorOption,
              label: colorOption,
            }))}
            placeholder="Select Color"
          />
        
      </div>
      <div className="my-4">
        <h3>Year Range :</h3>
        <div className="flex">
          <div className="mr-4">
            <Select
              value={selectedFromYear}
              onChange={handleFromYearChange}
              options={Array.from({ length: 2025 - 1990 }, (_, index) => ({
                value: 1990 + index,
                label: (1990 + index).toString(),
              }))}
              placeholder="From Year"
            />
          </div>
          <div>
            <Select
              value={selectedToYear}
              onChange={handleToYearChange}
              options={Array.from({ length: 2025 - 1990 }, (_, index) => ({
                value: 1990 + index ,   
                label: (1990 + index).toString(),
              }))}
              placeholder="To Year"
            />
          </div>
        </div>
      </div>

      <div className="my-4">
        <h3>Transmission Type : </h3>
      <Select
            value={transmissionType}
            onChange={handleTransmissionTypeChange}
            options={["Manual", "Auto"].map((transmissionOption) => ({
              value: transmissionOption,
              label: transmissionOption,
            }))}
            placeholder="Select Transmission Type"
          />
      </div>

      <div className="my-4">
        <h3>Engine Type : </h3>
      <Select
            value={engineType}
            onChange={handleEngineTypeChange}
            options={["Petrol", "Diesel", "Electric", "Hybrid"].map(
              (engineOption) => ({
                value: engineOption,
                label: engineOption,
              })
            )}
            placeholder="Select Engine Type"
          />
      </div>

      <button className="p-2 w-full rounded-md bg-black text-white text-xl" onClick={handleFilterClick}>Filter</button>
   
    </div>
  );
}
