import React, { useState, useContext, useEffect } from "react";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import Select from "react-select";
import { AllCarsContext } from "../contexts/AllCarsContext";
import { CarMakesAndModels } from "../res/CarMakesAndModels";
import { selectStyle } from "../res/SelectStyle";

export default function CarFilterSection({filterCars,setFilteredCars}) {
  const {allCars} = useContext(AllCarsContext);
  // getting the list of manufacturers from the json object and sorting them.
  const sortedManufacturers = CarMakesAndModels.map((make) => ({
    value: make.brand,
    label: make.brand,
  })).sort((a, b) => a.label.localeCompare(b.label));
  const [manufacturers, setManufacturers] = useState(sortedManufacturers);
  const [models, setModels] = useState([]);
  const [selectedManufacturer, setSelectedManufacturer] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [selectedFromYear, setSelectedFromYear] = useState("");
  const [selectedToYear, setSelectedToYear] = useState("");
  const [seatsAmount, setSeatsAmount] = useState("");
  const [engineType, setEngineType] = useState("");
  const [transmissionType, setTransmissionType] = useState("");
  const [priceRange, setPriceRange] = useState([30, 2000]);

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

  const handleTransmissionTypeChange = (selectedOption) => {
    setTransmissionType(selectedOption);
  };
  const handleRentalPricePerDayChange = (value) => {
    setPriceRange(value);
  };

  //  =================== handle manufacturer and model change ==================== .
  const handleManufacturerChange = (selectedOption) => {
    setSelectedManufacturer(selectedOption);
    const manufacturerModels = CarMakesAndModels.find(
      (make) => make.brand === selectedOption.value
    ).models;
    setModels(manufacturerModels);
    setSelectedModel(""); // Clear the selected model when the manufacturer changes
  };

  const handleModelChange = (selectedOption) => {
    setSelectedModel(selectedOption.value);
  };

  useEffect(() => {
    const filterOptions = JSON.parse(localStorage.getItem("filterOptions"));
    if (filterOptions) {
      filterCars(filterOptions);
    }
  }, []);

 

  // function that resets the filters 
  function resetFilters(){
    localStorage.removeItem('filterOptions');
    setFilteredCars([... allCars]);
    setSelectedManufacturer("");
    setSelectedModel("");
    setSelectedFromYear("");
    setSelectedToYear("");
    setSeatsAmount("");
    setEngineType("");
    setTransmissionType("");
    setPriceRange([0,5000]);
  }

  // function that handles the car filtering when the user clicks a button
  function applyCarsFilter() {
    // build the filter options based on user options.
    let filterOptions = {};
    if (selectedManufacturer) {
      filterOptions["manufacturer"] = selectedManufacturer.value.toLowerCase();
    }
    if (selectedModel) {
      filterOptions["model"] = selectedModel;
    }
    if (selectedFromYear) {
      filterOptions["fromYear"] = selectedFromYear.value;
    }
    if (selectedToYear) {
      filterOptions["toYear"] = selectedToYear.value;
    }
    if (seatsAmount) {
      filterOptions["seatAmount"] = seatsAmount.value;
    }
    if (engineType) {
      filterOptions["engineType"] = engineType.value;
    }
    if (transmissionType) {
      filterOptions["transmissionType"] = transmissionType.value;
    }
    if (priceRange) {
      filterOptions["priceRange"] = priceRange;
    }
    // Convert the filterOptions object to a JSON string
    const filterOptionsJSON = JSON.stringify(filterOptions);
    // Store it in local storage
    localStorage.setItem("filterOptions", filterOptionsJSON);
    console.log(filterOptions);
    filterCars(filterOptions);
  }

  return (
    <>
      <div className="w-full flex flex-col justify-between p-4">
        <h2 className="font-bold text-xl text-center">Car Results Filters</h2>
        <div className="my-4">
          <h3>Price Range</h3>
          <Slider
            range
            min={30}
            max={2000}
            defaultValue={priceRange}
            onChange={handleRentalPricePerDayChange}
            tipFormatter={(value) => `₪${value}`}
          />
          <div>
            Price: ₪{priceRange[0]} - ₪{priceRange[1]}
          </div>
        </div>

        <div className="my-4 rounded-md">
          <h3>Manufacturer : </h3>
          <Select
            value={selectedManufacturer}
            onChange={handleManufacturerChange}
            options={manufacturers}
            placeholder="Select Manufacturer"
            styles={selectStyle}
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
            styles={selectStyle}
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
                styles={selectStyle}
              />
            </div>
            <div>
              <Select
                value={selectedToYear}
                onChange={handleToYearChange}
                options={Array.from({ length: 2025 - 1990 }, (_, index) => ({
                  value: 1990 + index,
                  label: (1990 + index).toString(),
                }))}
                placeholder="To Year"
                styles={selectStyle}
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
            styles={selectStyle}
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
            styles={selectStyle}
          />
        </div>

        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="seatsAmount"
          >
            Seats Amount:
          </label>
          <Select
            value={seatsAmount}
            onChange={handleSeatsAmountChange}
            options={[
              { value: 2, label: "2" },
              { value: 4, label: "4" },
              { value: 5, label: "5" },
              { value: 7, label: "7" },
              { value: 8, label: "8" },
              { value: 9, label: "9" },
              { value: 12, label: "12" },
              { value: 15, label: "15" },
            ]}
            placeholder="Select Seats Amount"
            styles={selectStyle}
          />
        </div>

        {/* Reset And Filter Buttons Section */}
        <div className="flex items-center justify-center w-full flex-col">
          <button
            onClick={applyCarsFilter}
            className="bg-black p-2 text-white w-4/5 rounded-md font-bold text-lg"
          >
            Filter
          </button>
          <button onClick={resetFilters} className="border-2 border-red-500 hover:bg-red-500 hover:text-white p-2 text-red-500 rounded-md w-4/5 mt-4  font-bold text-lg">
            reset
          </button>
        </div>
      </div>
    </>
  );
}
