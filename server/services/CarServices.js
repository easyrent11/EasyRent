/*
#####################################################################
#                       CAR SERVICE                                 #
#####################################################################
*/
const db = require("../models/db");
const path = require("path");
const fs = require("fs");
const e = require("express");
const moment = require("moment");

// ########################################################################################
// #                  Check if car exists  SERVICE FUNCTION                               #
// ########################################################################################
// Function to check if a car plates number exists in the db.
function checkIfCarExists(db, platesNumber) {
  return new Promise((resolve, reject) => {
    db.query(
      "SELECT * FROM cars WHERE Plates_Number = ?",
      [platesNumber],
      (error, results) => {
        if (error) {
          console.error("Error checking car plates number:", error);
          reject("Failed to add car");
        } else {
          resolve(results);
        }
      }
    );
  });
}
// function that will retrieve all the cars with their images.
function getAllCarsWithImages() {
  return new Promise((resolve, reject) => {
    const query = `
  SELECT c.*, GROUP_CONCAT(i.image_url) AS car_urls
  FROM cars AS c
  LEFT JOIN car_images AS i ON c.Plates_Number = i.Plates_Number
  WHERE c.status = 1
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

//#####################################################################
//#                    DELETE CAR IMAGES AND CAR SERVICE              #
//#####################################################################

// function that checks if a given car exists in one of the orders in the website (if the car is used).
async function carExistsInOrders(db, platesNumber) {
  platesNumber = Number(platesNumber);
  const twentyFourHoursAgo = moment().subtract(24, "hours");
  const formattedDate = twentyFourHoursAgo.format('YYYY-MM-DD HH:mm:ss');
  return new Promise((resolve, reject) => {
    db.query(
      `SELECT * FROM orders WHERE Car_Plates_Number = ? AND status='pending' AND Order_Date >= '${formattedDate}'`,
      [platesNumber],
      (error, results) => {
        if (error) {
          console.error("Error checking car plates number:", error);
          reject("Failed to check car's status");
        } else {
          // Check if any orders were found for the car
          if (results.length === 0) {
            resolve(false);
          } else {
            resolve(true);
          }
        }
      }
    );
  });
}
// function that takes a car plates number and updates its status to false so it doesnt show in the user ui.
async function deleteCar(db, platesNumber) {
  platesNumber = Number(platesNumber);
  return new Promise(async (resolve, reject) => {
    // Now we update the status of the car in the cars table
    db.query(
      "UPDATE cars SET status = false WHERE Plates_Number = ?",
      [platesNumber],
      (error, results) => {
        if (error) {
          reject("Failed to update car status in the cars table.");
        } else {
          console.log(
            results.affectedRows > 0
              ? "Car status updated successfully"
              : "Car not found"
          );
          resolve(results.affectedRows > 0);
        }
      }
    );
  }).catch((error) => {
    reject(error);
  });
}

// helper function that takes a filename of a picture and deletes it from the images folder.
function deletePictureFromFolder(filename) {
  const filePath = path.join(__dirname, "../images/", filename);

  if (fs.existsSync(filePath)) {
    fs.unlink(filePath, (error) => {
      if (error) {
        console.error("Error deleting previous car picture:", error);
      } else {
        console.log("Previous car picture deleted successfully");
      }
    });
  }
}
// function that takes a car and deletes all of its images from the local folder in the server.
async function deleteCarPictures(db, Plates_Number) {
  return new Promise(async (resolve, reject) => {
    db.query(
      "SELECT image_url FROM car_images WHERE Plates_Number = ?",
      [Plates_Number],
      async (error, results) => {
        if (error) {
          reject("Failed to check if car images exist.");
        } else {
          if (results.length === 0) {
            resolve("No previous images were found.");
            return;
          } else {
            const imageUrls = results.map((result) => result.image_url);

            // Check if there's only one image and its the default one.
            if (imageUrls.length === 1 && imageUrls[0] === "default-car.jpg") {
              // Delete the default image from the database
              const deleteResult = await deletePictureFromDataBase(
                db,
                Plates_Number
              );
              if (deleteResult) {
                console.log("Default image deleted from the database.");
              } else {
                console.log(
                  "Failed to delete default image from the database."
                );
              }

              resolve(
                "Car has no image other than the default one. Skipping deletion."
              );
              return;
            }

            // Delete images from folder and database
            for (let i = 0; i < imageUrls.length; i++) {
              deletePictureFromFolder(imageUrls[i]);
            }
            const result = await deletePictureFromDataBase(db, Plates_Number);
            console.log(
              result
                ? "Images deleted successfully"
                : "Failed to delete the car images"
            );
            resolve(result);
          }
        }
      }
    );
  });
}

// helper function that takes the plates number of a car and deletes all of its images from the database.
function deletePictureFromDataBase(db, Plates_Number) {
  return new Promise((resolve, reject) => {
    db.query(
      "SELECT image_url FROM car_images WHERE Plates_Number = ?",
      [Plates_Number],
      (error, results) => {
        if (error) {
          console.error("Error deleting car image:", error);
          reject(error);
        } else {
          if (results.length === 0) {
            console.log(
              "No images found in the database for the given Plates Number."
            );
            resolve(0);
          } else {
            db.query(
              "DELETE FROM car_images WHERE Plates_Number = ?",
              [Plates_Number],
              (error, result) => {
                if (error) {
                  console.error("Error deleting car image:", error);
                  reject(error);
                } else {
                  console.log("Car image deleted successfully");
                  resolve(1);
                }
              }
            );
          }
        }
      }
    );
  });
}
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

    // Function to update the car details in the database.
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
// function that retrieves a car via plates number along with its images.
async function getCarWithPlatesNumber(db, PlatesNumber) {
  const query = `
  SELECT c.*, GROUP_CONCAT(i.image_url) AS car_urls
  FROM cars AS c
  LEFT JOIN car_images AS i ON c.Plates_Number = i.Plates_Number
  WHERE c.Plates_Number = ?
  GROUP BY c.Plates_Number;
`;
  return new Promise((resolve, reject) => {
    db.query(query, [PlatesNumber], (error, results) => {
      if (error) {
        reject(error);
      } else {
        resolve(results);
      }
    });
  });
}
// function that retrieves a given user's cars
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

/*
#####################################################################
#             INSERT CAR IMAGES SERVICE                             #
#####################################################################
*/
// function that retrieves all of the images of a car.
function fetchAllCarImages(db, PlatesNumber) {
  return new Promise((resolve, reject) => {
    if (!PlatesNumber) {
      reject("No plates number provided");
      return;
    }
    db.query(
      "SELECT image_url FROM car_images WHERE Plates_Number = ? ",
      [PlatesNumber],
      (error, results) => {
        if (error) {
          reject("Failed to fetch car images");
        } else {
          console.log(results);
          resolve(results);
        }
      }
    );
  });
}
// Function to insert car images
function insertCarImages(db, platesNumber, imageUrls) {
  const insertPromises = imageUrls.map((url) => {
    return new Promise((resolve, reject) => {
      db.query(
        "INSERT INTO car_images (Plates_Number, image_url) VALUES (?, ?)",
        [platesNumber, url],
        (error) => {
          if (error) {
            console.error("Error adding image URL:", error);
            reject(error);
          } else {
            resolve("Car Images successfully inserted");
          }
        }
      );
    });
  });

  return Promise.all(insertPromises);
}

module.exports = {
  getAllCarsWithImages,
  updateCarDetails,
  getCarWithPlatesNumber,
  getCarsWithUserId,
  checkIfCarExists,
  deleteCarPictures,
  fetchAllCarImages,
  insertCarImages,
  deleteCar,
  carExistsInOrders,
};
