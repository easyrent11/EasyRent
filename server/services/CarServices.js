/*
#####################################################################
#                       CAR SERVICE                                 #
#####################################################################
*/

const db = require("../models/db");
const path = require('path');
const fs = require('fs');

function getAllCarsWithImages() {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT c.*, GROUP_CONCAT(i.image_url) AS car_urls
      FROM cars AS c
      LEFT JOIN car_images AS i ON c.Plates_Number = i.Plates_Number
      GROUP BY c.Plates_Number
    `;
    db.query(query, (error, results) => {
      if (error) {
        console.error("Error retrieving cars:", error);
        reject("Error retrieving cars");
      } else {
        const carsWithImages = results.map((car) => ({
          ...car,
          car_urls: car.car_urls ? car.car_urls.split(",") : [],
        }));
        resolve(carsWithImages);
      }
    });
  });
}

function getAllCarsWithImages() {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT c.*, GROUP_CONCAT(i.image_url) AS car_urls
      FROM cars AS c
      LEFT JOIN car_images AS i ON c.Plates_Number = i.Plates_Number
      GROUP BY c.Plates_Number
    `;
    db.query(query, (error, results) => {
      if (error) {
        console.error("Error retrieving cars:", error);
        reject("Error retrieving cars");
      } else {
        const carsWithImages = results.map((car) => ({
          ...car,
          car_urls: car.car_urls ? car.car_urls.split(",") : [],
        }));
        resolve(carsWithImages);
      }
    });
  });
}
/*
#####################################################################
#                      END OF SERVICE                               #
#####################################################################
*/


/*
#####################################################################
#             UPDATE CAR ATTRIBUTES SERVICE                         #
#####################################################################
*/
// Function to update car details
function updateCarDetails(db, updatedCarDetails) {
  return new Promise((resolve, reject) => {
    const { Manufacturer_Code, model_code, Plates_Number } = updatedCarDetails;

    // Check if the Manufacturer_Code exists in the car_manufacturer table
    const findManufacturerQuery = `SELECT * FROM car_manufacturer WHERE Manufacturer_Code = '${Manufacturer_Code}'`;
    db.query(findManufacturerQuery, (error, results) => {
      if (error) {
        console.error("Error retrieving manufacturer details:", error);
        reject("Failed to retrieve manufacturer details");
        return;
      }

      if (results.length === 0) {
        // Manufacturer_Code does not exist, insert new manufacturer
        const { Manufacturer_Name } = updatedCarDetails;
        const insertManufacturerQuery = `INSERT INTO car_manufacturer (Manufacturer_Code, Manufacturer_Name) VALUES ('${Manufacturer_Code}', '${Manufacturer_Name}')`;
        db.query(insertManufacturerQuery, (error) => {
          if (error) {
            console.error("Error inserting new manufacturer:", error);
            reject("Failed to insert new manufacturer");
            return;
          }
          updateCarModel();
        });
      } else {
        updateCarModel();
      }
    });

    // Function to update the car model details in the car_models table
    const updateCarModel = () => {
      const { model_name } = updatedCarDetails;

      // Check if the model_code exists in the car_models table
      const findModelQuery = `SELECT * FROM car_models WHERE model_code = '${model_code}'`;
      db.query(findModelQuery, (error, results) => {
        if (error) {
          console.error("Error retrieving model details:", error);
          reject("Failed to retrieve model details");
          return;
        }

        if (results.length === 0) {
          // model_code does not exist, insert new model
          const insertModelQuery = `INSERT INTO car_models (model_code, model_name,Manufacturer_Code) VALUES ('${model_code}', '${model_name}', '${Manufacturer_Code}')`;
          db.query(insertModelQuery, (error) => {
            if (error) {
              console.error("Error inserting new model:", error);
              reject("Failed to insert new model");
              return;
            }
            updateCarDetailsInCarsTable();
          });
        } else {
          updateCarDetailsInCarsTable();
        }
      });
    };

    // Function to update the car details in the cars table
    const updateCarDetailsInCarsTable = () => {
      // Get the previous car details from the database
      const findPreviousCarQuery = `SELECT * FROM cars WHERE Plates_Number = ${Plates_Number}`;

      db.query(findPreviousCarQuery, (error, results) => {
        if (error) {
          console.error("Error retrieving previous car details:", error);
          reject("Failed to retrieve previous car details");
        } else {
          if (results.length === 0) {
            reject("Car not found");
            return;
          }

          const previousCarDetails = results[0];
          const updatedFields = {};

          // Compare the updatedCarDetails with the previousCarDetails and store the changed fields
          for (const key in updatedCarDetails) {
            if (updatedCarDetails[key] !== previousCarDetails[key]) {
              updatedFields[key] = updatedCarDetails[key];
            }
          }

          // If there are no updated fields, resolve with a message
          if (Object.keys(updatedFields).length === 0) {
            resolve("No changes detected");
            return;
          }

          let updateQuery = "UPDATE cars SET ";

          // Build the SET clause of the update query
          for (const key in updatedFields) {
            if (key !== "model_name" && key !== "Manufacturer_Name") {
              updateQuery += `${key} = '${updatedFields[key]}', `;
            }
          }

          // Remove the trailing comma and space
          updateQuery = updateQuery.slice(0, -2);

          // Add the WHERE clause to update the specific car
          updateQuery += ` WHERE Plates_Number = ${Plates_Number}`;

          db.query(updateQuery, (error) => {
            if (error) {
              console.error("Error updating car details:", error);
              reject("Failed to update car details");
            } else {
              resolve("Car details updated successfully");
            }
          });
        }
      });
    };
  });
}


async function getCarWithPlatesNumber(db, PlatesNumber) {
  const query = `SELECT Manufacturer_Code, model_code, Plates_Number, Year, Color, Seats_Amount, Engine_Type, Transmission_type, Description, Rental_Price_Per_Day FROM cars WHERE Plates_Number = ${PlatesNumber}`;
  return new Promise((resolve, reject) => {
    db.query(query, (error, results) => {
      if (error) {
        reject(error);
      } else {
        resolve(results);
      }
    });
  });
}

async function getCarsWithUserId(db, userId) {
  const query = `select * from cars WHERE Renter_Id = ${userId}`;
  return new Promise((resolve, reject) => {
    db.query(query, (error, results) => {
      if (error) {
        reject(error);
      } else {
        resolve(results);
      }
    });
  });
}
// Function to update car details
function updateCarDetails(db, updatedCarDetails) {
  return new Promise((resolve, reject) => {
    const { Manufacturer_Code, model_code, Plates_Number } = updatedCarDetails;

    // Check if the Manufacturer_Code exists in the car_manufacturer table
    const findManufacturerQuery = `SELECT * FROM car_manufacturer WHERE Manufacturer_Code = '${Manufacturer_Code}'`;
    db.query(findManufacturerQuery, (error, results) => {
      if (error) {
        console.error("Error retrieving manufacturer details:", error);
        reject("Failed to retrieve manufacturer details");
        return;
      }

      if (results.length === 0) {
        // Manufacturer_Code does not exist, insert new manufacturer
        const { Manufacturer_Name } = updatedCarDetails;
        const insertManufacturerQuery = `INSERT INTO car_manufacturer (Manufacturer_Code, Manufacturer_Name) VALUES ('${Manufacturer_Code}', '${Manufacturer_Name}')`;
        db.query(insertManufacturerQuery, (error) => {
          if (error) {
            console.error("Error inserting new manufacturer:", error);
            reject("Failed to insert new manufacturer");
            return;
          }
          updateCarModel();
        });
      } else {
        updateCarModel();
      }
    });

    // Function to update the car model details in the car_models table
    const updateCarModel = () => {
      const { model_name } = updatedCarDetails;

      // Check if the model_code exists in the car_models table
      const findModelQuery = `SELECT * FROM car_models WHERE model_code = '${model_code}'`;
      db.query(findModelQuery, (error, results) => {
        if (error) {
          console.error("Error retrieving model details:", error);
          reject("Failed to retrieve model details");
          return;
        }

        if (results.length === 0) {
          // model_code does not exist, insert new model
          const insertModelQuery = `INSERT INTO car_models (model_code, model_name,Manufacturer_Code) VALUES ('${model_code}', '${model_name}', '${Manufacturer_Code}')`;
          db.query(insertModelQuery, (error) => {
            if (error) {
              console.error("Error inserting new model:", error);
              reject("Failed to insert new model");
              return;
            }
            updateCarDetailsInCarsTable();
          });
        } else {
          updateCarDetailsInCarsTable();
        }
      });
    };

    // Function to update the car details in the cars table
    const updateCarDetailsInCarsTable = () => {
      // Get the previous car details from the database
      const findPreviousCarQuery = `SELECT * FROM cars WHERE Plates_Number = ${Plates_Number}`;

      db.query(findPreviousCarQuery, (error, results) => {
        if (error) {
          console.error("Error retrieving previous car details:", error);
          reject("Failed to retrieve previous car details");
        } else {
          if (results.length === 0) {
            reject("Car not found");
            return;
          }

          const previousCarDetails = results[0];
          const updatedFields = {};

          // Compare the updatedCarDetails with the previousCarDetails and store the changed fields
          for (const key in updatedCarDetails) {
            if (updatedCarDetails[key] !== previousCarDetails[key]) {
              updatedFields[key] = updatedCarDetails[key];
            }
          }

          // If there are no updated fields, resolve with a message
          if (Object.keys(updatedFields).length === 0) {
            resolve("No changes detected");
            return;
          }

          let updateQuery = "UPDATE cars SET ";

          // Build the SET clause of the update query
          for (const key in updatedFields) {
            if (key !== "model_name" && key !== "Manufacturer_Name") {
              updateQuery += `${key} = '${updatedFields[key]}', `;
            }
          }

          // Remove the trailing comma and space
          updateQuery = updateQuery.slice(0, -2);

          // Add the WHERE clause to update the specific car
          updateQuery += ` WHERE Plates_Number = ${Plates_Number}`;

          db.query(updateQuery, (error) => {
            if (error) {
              console.error("Error updating car details:", error);
              reject("Failed to update car details");
            } else {
              resolve("Car details updated successfully");
            }
          });
        }
      });
    };
  });
}

module.exports = {
  getAllCarsWithImages,
  updateCarDetails,
  getCarWithPlatesNumber,
  getCarsWithUserId,
};
  
