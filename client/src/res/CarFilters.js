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
  