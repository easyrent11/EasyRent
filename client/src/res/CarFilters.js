// export const filterCarsByPriceRange = (cars, lowPrice, highPrice) => {
//     let filteredList = [...cars];
  
//     // Filter by price range
//     filteredList = filteredList.filter(
//       (car) => car.Rental_Price_Per_Day >= lowPrice && car.Rental_Price_Per_Day <= highPrice
//     );
  
//     return filteredList;
//   };

// CarFilters.js

export function filterCars(allCars, filters) {
    return allCars.filter((car) => {
      // Filter by manufacturer
      if (filters.manufacturer && car.Manufacturer_Code.toLowerCase() !== filters.manufacturer) {
        return false;
      }
  
      // Filter by model
      if (filters.model && car.model_code.toLowerCase() !== filters.model) {
        return false;
      }
  
      // Filter by color
      if (filters.color && car.Color !== filters.color) {
        return false;
      }
  
      // Filter by year range
      if (
        filters.fromYear &&
        (car.Year < filters.fromYear || car.Year > filters.toYear)
      ) {
        return false;
      }
  
      // Filter by transmission type
      if (
        filters.transmissionType &&
        car.Transmission_Type !== filters.transmissionType
      ) {
        return false;
      }
  
      // Filter by engine type
      if (filters.engineType && car.Engine_Type !== filters.engineType) {
        return false;
      }
  
      // Filter by price range
      if (
        filters.lowPrice &&
        (car.Rental_Price_Per_Day < filters.lowPrice ||
          car.Rental_Price_Per_Day > filters.highPrice)
      ) {
        return false;
      }
  
      // All filters passed
      return true;
    });
  }
  