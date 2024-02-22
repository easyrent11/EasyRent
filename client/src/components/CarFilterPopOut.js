// CarFilterPopout.js
import React from "react";
import CarFilterSection from "./CarFilterSection";
import { XMarkIcon } from "@heroicons/react/24/outline";

const CarFilterPopout = ({ toggleCarFilterSection }) => {
  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
      <div className="bg-white w-full p-4 rounded-md">
        <XMarkIcon
          className="w-8 h-8 cursor-pointer absolute top-45 right-2"
          onClick={toggleCarFilterSection}
        />
        <CarFilterSection />
      </div>
    </div>
  );
};

export default CarFilterPopout;
