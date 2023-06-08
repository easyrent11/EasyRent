import React, { useState, useEffect } from "react";
import { CarTypes } from "../res/CarTypes";
import { ManufacturersAndModels } from "../res/ManufacturersAndModels";

export default function AddCarForm() {
  const [types, setTypes] = useState([]);
  const [manufacturers, setManufacturers] = useState([]);
  const [models, setModels] = useState([]);
  const [selectedManufacturer, setSelectedManufacturer] = useState("");
  const [filteredModels, setFilteredModels] = useState([]);

  useEffect(() => {
    // Set types from JavaScript file
    setTypes(CarTypes);

    // Set manufacturers from JavaScript file
    setManufacturers(ManufacturersAndModels.map((item) => item.manufacturer));

    // Set models from JavaScript file
    setModels(ManufacturersAndModels);
  }, []);

  useEffect(() => {
    // Filter models based on selected manufacturer
    const filtered = models.find(
      (item) => item.manufacturer === selectedManufacturer
    );
    setFilteredModels(filtered ? filtered.models : []);
  }, [models, selectedManufacturer]);

  const handleManufacturerChange = (event) => {
    const selectedManufacturer = event.target.value;
    setSelectedManufacturer(selectedManufacturer);
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-4">Add Car</h2>
      <form>
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="type"
          >
            Type:
          </label>
          <select
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="type"
          >
            <option value="">Select Type</option>
            {types.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="manufacturer"
          >
            Manufacturer:
          </label>
          <select
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="manufacturer"
            onChange={handleManufacturerChange}
          >
            <option value="">Select Manufacturer</option>
            {manufacturers.map((manufacturer, index) => (
              <option key={index} value={manufacturer}>
                {manufacturer}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="model"
          >
            Model:
          </label>
          <select
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="model"
          >
            <option value="">Select Model</option>
            {filteredModels.map((model, index) => (
              <option key={index} value={model}>
                {model}
              </option>
            ))}
          </select>
        </div>
        {/* Add more input fields for the remaining columns */}

        <div className="flex justify-end">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
          >
            Add
          </button>
        </div>
      </form>
    </div>
  );
}
