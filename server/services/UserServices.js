const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const path = require("path");
const fs = require("fs");
const moment = require("moment")

// ########################################################################################
// #                                ADD CAR SERVICE FUNCTIONS                             #
// ########################################################################################

// Function to check if a manufacturer exists
function checkManufacturerExists(db, manufacturerCode) {
  return new Promise((resolve, reject) => {
    db.query(
      "SELECT * FROM car_manufacturer WHERE Manufacturer_Code = ?",
      [manufacturerCode],
      (error, results) => {
        if (error) {
          console.error("Error checking manufacturer:", error);
          reject("Failed to add car");
        } else {
          resolve(results.length > 0);
        }
      }
    );
  });
}

// Function to insert a manufacturer
function insertManufacturer(db, manufacturerCode, manufacturerName) {
  return new Promise((resolve, reject) => {
    db.query(
      "INSERT INTO car_manufacturer (Manufacturer_Code, Manufacturer_Name) VALUES (?, ?)",
      [manufacturerCode, manufacturerName],
      (error) => {
        if (error) {
          console.error("Error adding manufacturer:", error);
          reject("Failed to add car");
        } else {
          resolve();
        }
      }
    );
  });
}

// Function to check if a model exists
function checkModelExists(db, modelCode) {
  return new Promise((resolve, reject) => {
    db.query(
      "SELECT * FROM car_models WHERE model_code = ?",
      [modelCode],
      (error, results) => {
        if (error) {
          console.error("Error checking model:", error);
          reject("Failed to add car");
        } else {
          resolve(results.length > 0);
        }
      }
    );
  });
}

// Function to insert a model
function insertModel(db, modelCode, modelName, manufacturerCode) {
  return new Promise((resolve, reject) => {
    db.query(
      "INSERT INTO car_models (model_code, model_name, Manufacturer_code) VALUES (?, ?, ?)",
      [modelCode, modelName, manufacturerCode],
      (error) => {
        if (error) {
          console.error("Error adding model:", error);
          reject("Failed to add car");
        } else {
          resolve();
        }
      }
    );
  });
}

// Function to check if a user exists
function checkUserExists(db, renterId) {
  return new Promise((resolve, reject) => {
    db.query(
      "SELECT id FROM users WHERE id = ?",
      [renterId],
      (error, results) => {
        if (error) {
          console.error("Error checking user:", error);
          reject("Failed to add car");
        } else {
          resolve(results.length > 0);
        }
      }
    );
  });
}

// Function to insert a car
function insertCar(
  db,
  manufacturerCode,
  modelCode,
  platesNumber,
  year,
  color,
  seatsAmount,
  engineType,
  transmissionType,
  description,
  rentalPricePerDay,
  renterId
) {
  return new Promise((resolve, reject) => {
    db.query(
      "INSERT INTO cars (Manufacturer_Code, model_code, Plates_Number, Year, Color, Seats_Amount, Engine_Type, Transmission_type, Description, Rental_Price_Per_Day, Renter_Id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        manufacturerCode,
        modelCode,
        platesNumber,
        year,
        color,
        seatsAmount,
        engineType,
        transmissionType,
        description,
        rentalPricePerDay,
        renterId,
      ],
      (error, results) => {
        if (error) {
          console.error("Error adding car:", error);
          reject("Failed to add car");
        } else {
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

// The main function that will execute all of the above functions with the validations and successfully add a car to the website.
async function addCar(db, carData) {
  const {
    Manufacturer_Code,
    Manufacturer_Name,
    model_name,
    model_code,
    Plates_Number,
    Year,
    Color,
    Seats_Amount,
    Engine_Type,
    Transmission_type,
    Description,
    Rental_Price_Per_Day,
    Renter_Id,
    image_url,
  } = carData;
  try {
    // Check if the manufacturer exists
    const manufacturerExists = await checkManufacturerExists(
      db,
      Manufacturer_Code
    );

    if (!manufacturerExists) {
      // Manufacturer does not exist, insert into manufacturers table
      await insertManufacturer(db, Manufacturer_Code, Manufacturer_Name);
    }

    // Check if the model exists
    const modelExists = await checkModelExists(db, model_code);

    if (!modelExists) {
      // Model does not exist, insert into models table
      await insertModel(db, model_code, model_name, Manufacturer_Code);
    }

    // Check if the user exists
    const userExists = await checkUserExists(db, Renter_Id);
    console.log("Renter id = ", Renter_Id);
    if (!userExists) {
      // User with the specified Renter_Id doesn't exist
      throw new Error("Renter_Id not found");
    }

    // Insert the car details into the cars table
    await insertCar(
      db,
      Manufacturer_Code,
      model_code,
      Plates_Number,
      Year,
      Color,
      Seats_Amount,
      Engine_Type,
      Transmission_type,
      Description,
      Rental_Price_Per_Day,
      Renter_Id
    );
    const addedCar = {
      Manufacturer_Code,
      model_code,
      Plates_Number,
      Year,
      Color,
      Seats_Amount,
      Engine_Type,
      Transmission_type,
      Description,
      Rental_Price_Per_Day,
      Renter_Id,
      car_urls: image_url,
    };
    // Insert the image URLs into the car_images table
    if (image_url && image_url.length > 0) {
      await insertCarImages(db, Plates_Number, image_url);
    }

    return { message: "Car added successfully", car: addedCar };
  } catch (error) {
    throw new Error(`Failed to add car}`);
  }
}

// ########################################################################################
// #                          END OF ADD CAR SERVICE FUNCTIONS                            #
// ########################################################################################

/*
#####################################################################
#                       USER REGISTER SERVICE                       #
#####################################################################
*/

// Function to check if a city exists
function checkCityExists(db, cityCode) {
  return new Promise((resolve, reject) => {
    db.query(
      "SELECT * FROM cities WHERE City_Code = ?",
      [cityCode],
      (error, results) => {
        if (error) {
          reject("Failed to register user");
        } else {
          resolve(results.length > 0);
        }
      }
    );
  });
}

// Function to insert a city
function insertCity(db, cityCode, cityName) {
  return new Promise((resolve, reject) => {
    db.query(
      "INSERT INTO cities (City_Code, City_Name) VALUES (?, ?)",
      [cityCode, cityName],
      (error) => {
        if (error) {
          reject("Failed to register user");
        } else {
          resolve();
        }
      }
    );
  });
}

// Function to insert a user
function insertUser(db, user) {
  return new Promise((resolve, reject) => {
    db.query("INSERT INTO users SET ?", user, (error, results) => {
      if (error) {
        reject("Failed to register user");
      } else {
        resolve(results);
      }
    });
  });
}

// Function to register a user
async function registerUser(db, userData) {
  console.log("Register data = ", userData);
  const {
    id,
    phone_number,
    driving_license,
    picture,
    email,
    password,
    city_code,
    city_name,
    street_name,
    first_name,
    last_name,
  } = userData;

  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the user object with hashed password
    const user = {
      id,
      phone_number,
      driving_license,
      picture,
      email,
      password: hashedPassword,
      city_code,
      street_name,
      first_name,
      last_name,
    };

    // Check if the city already exists
    const cityExists = await checkCityExists(db, city_code);

    if (cityExists) {
      // City already exists, update the user instead of inserting
      await insertUser(db, user);
      return { user: user, message: "User registered successfully" };
    } else {
      // City does not exist, insert the city and user
      await insertCity(db, city_code, city_name);
      await insertUser(db, user);
      return { user: user, message: "User registered successfully" };
    }
  } catch (error) {
    console.error("Error hashing password:", error);
    throw new Error("Failed to register user");
  }
}
/*
#####################################################################
#                      END USER REGISTER SERVICE                    #
#####################################################################
*/

/*
#####################################################################
#                      CHECK USER  DETAILS EXIST SERVICE            #
#####################################################################
*/

// Function that get user details and check if those details exist in the website.
async function checkUserDetailsExist(db, userDetails) {
  const { email, Id, phoneNumber, drivingLicense } = userDetails;
  // function that will check if the given email exists.
  function checkIfEmailExists() {
    return new Promise((resolve, reject) => {
      const query = "SELECT * FROM users WHERE email = ?";
      db.query(query, [email], (error, results) => {
        if (error) {
          console.error(error);
          reject("Internal server error");
        } else {
          resolve(results);
        }
      });
    });
  }
  // function that will check if the given user id exists.
  function checkIfUserIdExists() {
    return new Promise((resolve, reject) => {
      const query = "SELECT * FROM users WHERE id = ?";
      db.query(query, [Id], (error, results) => {
        if (error) {
          console.error(error);
          reject("Internal server error");
        } else {
          resolve(results);
        }
      });
    });
  }
  // function that will check if the given plates number exists.
  function checkPhoneNumberExists() {
    return new Promise((resolve, reject) => {
      const query = "SELECT * FROM users WHERE phone_number = ?";
      db.query(query, [phoneNumber], (error, results) => {
        if (error) {
          console.error(error);
          reject("Internal server error");
        } else {
          resolve(results);
        }
      });
    });
  }
  // function that will check if the given driving license exist.
  function checkIfDrivingLicenseExists() {
    return new Promise((resolve, reject) => {
      const query = "SELECT * FROM users WHERE driving_license = ?";
      db.query(query, [drivingLicense], (error, results) => {
        if (error) {
          console.error(error);
          reject("Internal server error");
        } else {
          resolve(results);
        }
      });
    });
  }

  // Call the helper functions and return a combined result
  return Promise.all([
    checkIfEmailExists(),
    checkIfUserIdExists(),
    checkPhoneNumberExists(),
    checkIfDrivingLicenseExists(),
  ])
    .then(
      ([
        emailResults,
        userIdResults,
        phoneNumberResults,
        drivingLicenseResults,
      ]) => {
        const result = {};

        if (emailResults.length > 0) {
          result.email = true;
        }

        if (userIdResults.length > 0) {
          result.Id = true;
        }

        if (phoneNumberResults.length > 0) {
          result.phoneNumber = true;
        }

        if (drivingLicenseResults.length > 0) {
          result.drivingLicense = true;
        }

        return result;
      }
    )
    .catch((error) => {
      console.error(error);
      throw new Error("An error occurred while checking user details");
    });
}

/*
#####################################################################
#                       USER LOGIN SERVICE                          #
#####################################################################
*/

// Function to retrieve user by email
function getUserByEmail(db, email) {
  return new Promise((resolve, reject) => {
    const query = "SELECT * FROM users WHERE email = ?";
    db.query(query, [email], (error, results) => {
      if (error) {
        console.error(error);
        reject("Internal server error");
      } else {
        resolve(results);
      }
    });
  });
}

// Function to compare passwords
async function comparePasswords(password, hashedPassword) {
  return await bcrypt.compare(password, hashedPassword);
}

// function that will generate a jwt token and return it.
function generateToken(userId, expiresIn) {
  const accessToken = jwt.sign({ userId }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn,
  });

  return accessToken;
}
// Function to log in the user.
async function loginUser(db, email, password) {
  try {
    // Check if the user exists in the database
    const results = await getUserByEmail(db, email);
    console.log(results);
    if (results.length === 0) {
      throw new Error("User not found");
    }

    const user = results[0];
    if (user.status === "disabled") {
      throw new Error(
        "Your account was disabled, please check your email if this was a mistake let us know."
      );
    }

    // Compare the provided password with the hashed password
    const passwordMatch = await comparePasswords(password, user.password);
    if (!passwordMatch) {
      throw new Error("Invalid password");
    }

    //If we got here then password is correct, Generate a token with the userId
    const token = generateToken(user.Id, "1h");

    // Return the token, user details, and isAdmin status
    return {
      message: "Login successful",
      token,
      userFirstName: user.first_name,
      userId: user.Id,
      isAdmin: user.isadmin, // Include the isAdmin status
    };
  } catch (error) {
    throw new Error(`error is :${error}`);
  }
}

/*
#####################################################################
#                   END OF USER LOGIN SERVICE                       #
#####################################################################
*/

/*
#####################################################################
#                   USER CAR SEARCH SERVICE                         #
#####################################################################
*/
// function that will take search attributes and search for cars with the given attributes.
async function searchCar(db, city, pickupDate, returnDate, startTime, endTime) {
  const sql = `
    SELECT c.*, m.model_name, mf.Manufacturer_Name, GROUP_CONCAT(ci.image_url) AS car_urls
    FROM cars c
    JOIN users u ON c.Renter_Id = u.Id
    JOIN car_models m ON c.model_code = m.model_code
    JOIN car_manufacturer mf ON m.manufacturer_code = mf.manufacturer_code
    LEFT JOIN car_images ci ON c.Plates_Number = ci.Plates_Number
    WHERE u.City_Code = ? 
      AND c.Plates_Number NOT IN (
        SELECT o.Car_Plates_Number
        FROM orders o
        WHERE (
          (o.Start_Date > ? AND o.Start_Time >= ? AND o.End_Time >= ?) OR
          (o.Start_Date = ? AND o.Start_Time >= ?) OR
          (o.End_Date = ? AND o.End_Time <= ?)
        )
      )
    GROUP BY c.Plates_Number;
  `;

  return new Promise((resolve, reject) => {
    db.query(
      sql,
      [
        city,
        returnDate,
        startTime,
        endTime,
        pickupDate,
        startTime,
        returnDate,
        endTime,
      ],
      (err, result) => {
        if (err) {
          console.log("Error fetching car list:", err);
          reject("Failed to fetch car list");
        } else {
          // Parse the comma-separated image URLs and create an array
          result.forEach((car) => {
            if (car.car_urls) {
              car.car_urls = car.car_urls.split(",");
            } else {
              car.car_urls = [];
            }
          });
          resolve(result);
        }
      }
    );
  });
}
/*
#####################################################################
#                 END OF USER CAR SEARCH SERVICE                    #
#####################################################################
*/

/*
#####################################################################
#                   Order CAR SERVICE                               #
#####################################################################
*/

// function that will take an order details object and create an order
async function orderCar(db, orderDetails) {
  console.log(orderDetails);
  const {
    Start_Date,
    End_Date,
    Car_Plates_Number,
    Rentee_id,
    Start_Time,
    End_Time,
    status = "pending", // Default value for status is 'pending'
    Renter_Id,
    Order_Date,
  } = orderDetails;

  // Check if the Renter_Id exists in the users table
  const checkRenterQuery = `SELECT Id FROM users WHERE Id = ?`;
  const renterExists = await new Promise((resolve, reject) => {
    db.query(checkRenterQuery, [Renter_Id], (err, result) => {
      if (err) {
        console.log("Error checking Renter_Id:", err);
        reject("Failed to check Renter_Id");
      } else {
        console.log("Renter exists.");
        resolve(result.length > 0);
      }
    });
  });

  // Check if the Rentee_id exists in the users table
  const checkRenteeQuery = `SELECT Id FROM users WHERE Id = ?`;
  const renteeExists = await new Promise((resolve, reject) => {
    db.query(checkRenteeQuery, [Rentee_id], (err, result) => {
      if (err) {
        console.log("Error checking Rentee_id:", err);
        reject("Failed to check Rentee_id");
      } else {
        console.log("Rentee exists.");
        resolve(result.length > 0);
      }
    });
  });

  // Check if the Car_Plates_Number exists in the cars table
  const checkCarQuery = `SELECT Plates_Number FROM cars WHERE Plates_Number = ?`;
  const carExists = await new Promise((resolve, reject) => {
    db.query(checkCarQuery, [Car_Plates_Number], (err, result) => {
      if (err) {
        console.log("Error checking Car_Plates_Number:", err);
        reject("Failed to check Car_Plates_Number");
      } else {
        console.log("Car plates exist.");
        resolve(result.length > 0);
      }
    });
  });

  // If any of the required data is not found in the corresponding tables, reject the promise
  if (!renterExists || !renteeExists || !carExists) {
    return Promise.reject("Invalid Renter_Id, Rentee_id, or Car_Plates_Number");
  }

  const insertOrderQuery = `
    INSERT INTO orders (Start_Date, End_Date, Car_Plates_Number, Rentee_id, Start_Time, End_Time, status, Renter_Id,Order_Date)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?,?)
  `;

  return new Promise((resolve, reject) => {
    db.query(
      insertOrderQuery,
      [
        Start_Date,
        End_Date,
        Car_Plates_Number,
        Rentee_id,
        Start_Time,
        End_Time,
        status,
        Renter_Id,
        Order_Date,
      ],
      (err, result) => {
        if (err) {
          console.log("Error creating order:", err);
          reject("Failed to create order");
        } else {
          console.log("Order created successfully:", result);
          // Get the ID of the newly inserted order
          const orderId = result.insertId;

          // Create an object containing the order and its ID
          const createdOrder = {
            ...orderDetails,
            Order_Id: orderId,
          };

          resolve(createdOrder);
        }
      }
    );
  });
}

/*
##################################################################################
#                             ORDERS FUNCTIONS                                   #                            
##################################################################################
*/
// Function to fetch orders with renter_id matching userId
async function getOrdersByRenterId(db, userId) {
  const query = `SELECT * FROM orders WHERE Renter_Id = ${userId} and status!='cancelled'`;
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
// Function to fetch orders with rentee_id matching userId
async function getOrdersByRenteeId(db, userId) {
  const query = `SELECT * FROM orders WHERE Rentee_id = ${userId} and status!='cancelled'`;
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
// function that retrieve an order via order id.
async function getOrderById(db, orderId) {
  const query = `SELECT * FROM orders WHERE Order_Id = ?`;
  return new Promise((resolve, reject) => {
    db.query(query, [orderId], (error, results) => {
      if (error) {
        console.error("Error fetching order by ID:", error);
        reject(error);
      } else {
        if (results.length === 0) {
          console.log("No order found with ID:", orderId);
          resolve(null);
        } else {
          resolve(results[0]); // Return the first order if found
        }
      }
    });
  });
}
// Function to update the order status and return the updated order
async function updateOrderStatus(db, orderId, status) {
  const query = `UPDATE orders SET Status = '${status}' WHERE Order_Id = ${orderId}`;
  return new Promise((resolve, reject) => {
    db.query(query, (error, results) => {
      if (error) {
        reject(error);
      } else {
        const selectQuery = `SELECT * FROM orders WHERE Order_Id = ${orderId}`;
        db.query(selectQuery, (selectError, selectResults) => {
          if (selectError) {
            reject(selectError);
          } else {
            resolve(selectResults[0]);
          }
        });
      }
    });
  });
}
async function checkCarInUse(db, startDate, endDate, startTime, endTime, carPlatesNumber) {
  try {
    const sql = `
      SELECT * FROM orders 
      WHERE status = 'accepted' 
      AND Car_Plates_Number = ? 
      AND NOT(
        (Start_Date < ? AND End_Date < ?)
        OR 
        (Start_Date > ? AND End_Date > ?)
        OR 
        (Start_Date = ? AND End_Time < ?)
        OR 
        (Start_Date = ? AND Start_Time > ?)
      )
    `;
    
    // creating the query parameter object.
    const queryParams = [
      carPlatesNumber,
      startDate,
      endDate,
      startDate,
      endDate,
      startDate,
      startTime,
      startDate,
      endTime
    ];

    // Use `await` directly on the query to get the results.
    const results = await new Promise((resolve, reject) => {
      db.query(sql, queryParams, (error, results) => {
        if (error) {
          console.error("Error finding if car in use", error);
          reject(error);
        } else {
          resolve(results);
        }
      });
    });

    // Return the length of the results array.
    return results.length > 0 ? true : false;
  } catch (error) {
    console.error("Error checking if car in use", error);
    throw error;
  }
}

// function that takes an order id and plates number and return all conflicting order details and decline them.
async function findAndDeclineConflictingOrders(db, orderId, carPlatesNumber) {
  try {
    // Get the order details for the provided orderId
    const currentOrder = await getOrderById(db, orderId);

    if (!currentOrder) {
      console.log("Order not found with ID:", orderId);
      return [];
    }

    // Extract date and time details from the current order
    const currentStartDate = currentOrder.Start_Date;
    const currentEndDate = currentOrder.End_Date;
    const currentStartTime = currentOrder.Start_Time;
    const currentEndTime = currentOrder.End_Time;
    // query that will find the conflicting orders.
    const sql = `
    SELECT * FROM orders 
    WHERE status = 'pending' 
    AND Order_Id <> ?
    AND Car_Plates_Number = ? 
    AND NOT(
      (Start_Date < ? AND End_Date < ?)
        OR 
        (Start_Date > ? AND End_Date > ?)
        OR 
        (Start_Date = ? AND End_Time < ?)
        OR 
        (Start_Date = ? AND Start_Time > ?)
    )

      `;
    // creating the query parameter object.
    const queryParams = [
      orderId,
      carPlatesNumber,
      currentStartDate,
      currentEndDate,
      currentStartDate,
      currentEndDate,
      currentStartDate,
      currentStartTime,
      currentStartDate,
      currentEndTime
    ];
    const declinedOrderInformation = [];

    await new Promise((resolve, reject) => {
      db.query(sql, queryParams, async (error, results) => {
        if (error) {
          console.error("Error finding conflicting orders:", error);
          reject(error);
        } else {
          // Update the status of conflicting orders to 'declined'
          for (const order of results) {
            if (order.Order_Id !== orderId) {
              await updateOrderStatus(db, order.Order_Id, "declined");
              declinedOrderInformation.push({
                Order_Id: order.Order_Id,
                startchat: order.Rentee_id,
              });
            }
          }
          resolve(results);
        }
      });
    });

    return declinedOrderInformation;
  } catch (error) {
    console.error("Error in findAndDeclineConflictingOrders:", error);
    throw error;
  }
}
/*
##################################################################################
#                           END OF ORDER FUNCTIONS                               #                            
##################################################################################
*/

/*
##################################################################################
#                       Services to update user details                           #                            
##################################################################################
*/

// function that takes a image file name and deletes the file from the local images folder.
function deletePreviousPicture(filename) {
  const filePath = path.join(__dirname, "../images/", filename);
  if (fs.existsSync(filePath)) {
    fs.unlink(filePath, (error) => {
      if (error) {
        console.error("Error deleting previous picture:", error);
      } else {
        console.log("Previous picture deleted successfully");
      }
    });
  }
}
// function that takes new user details and updates the user details with the given ones.
async function updateUserProfile(db, updatedUserDetails) {
  return new Promise((resolve, reject) => {
    const updateUserQuery = `
      UPDATE users
      SET
        first_name = '${updatedUserDetails.first_name}',
        last_name = '${updatedUserDetails.last_name}',
        email = '${updatedUserDetails.email}',
        phone_number = '${updatedUserDetails.phone_number}',
        driving_license = '${updatedUserDetails.driving_license}',
        street_name = '${updatedUserDetails.street_name}',
        picture = '${updatedUserDetails.picture}',
        city_code = '${updatedUserDetails.city_code}'
      WHERE id = ${updatedUserDetails.Id}
    `;

    db.query(updateUserQuery, (error, results) => {
      if (error) {
        console.error("Error updating user profile:", error);
        reject("Failed to update user profile");
      } else {
        resolve("User profile updated successfully");
      }
    });
  });
}
// function that will insert a user city first and then use the above function to update the details.
async function insertCityAndThenUpdateUser(db, updatedUserDetails) {
  return new Promise((resolve, reject) => {
    const insertCityQuery = `
      INSERT INTO cities (city_code, city_name)
      VALUES (${updatedUserDetails.city_code}, '${updatedUserDetails.City_Name}')
    `;

    db.query(insertCityQuery, (error, results) => {
      if (error) {
        console.error("Error inserting city:", error);
        reject("Failed to insert city");
      } else {
        updateUserProfile(updatedUserDetails)
          .then((message) => {
            resolve(message);
          })
          .catch((error) => {
            reject(error);
          });
      }
    });
  });
}
// the main function that will execute both functions above to successfully update the user details.
async function updateUserDetails(db, updatedUserDetails) {
  return new Promise(async (resolve, reject) => {
    // checking if the user has a previous profile picture
    const findPreviousPictureQuery = `SELECT picture FROM users WHERE id = ${updatedUserDetails.Id}`;

    db.query(findPreviousPictureQuery, async (error, results) => {
      if (error) {
        console.error("Error updating user profile:", error);
        reject("Could not find user old picture");
      } else {
        if (
          results.length > 0 &&
          results[0].picture !== updatedUserDetails.picture
        ) {
          const previousPictureFilename = results[0].picture;
          if (!previousPictureFilename === "default.jpg") {
            deletePreviousPicture(previousPictureFilename);
          }
        } else {
          console.log("No previous picture found in the user database.");
        }
        // checking if the city to update exists or not.
        const checkCityQuery = `SELECT COUNT(*) AS count FROM cities WHERE city_code = ${updatedUserDetails.city_code}`;
        db.query(checkCityQuery, async (error, results) => {
          if (error) {
            console.error("Error checking city:", error);
            reject("Error checking city");
          } else {
            const cityExists = results[0].count > 0;

            if (cityExists) {
              try {
                const message = await updateUserProfile(db, updatedUserDetails);
                resolve(message);
              } catch (error) {
                reject(error);
              }
            } else {
              try {
                const message = await insertCityAndThenUpdateUser(
                  db,
                  updatedUserDetails
                );
                resolve(message);
              } catch (error) {
                reject(error);
              }
            }
          }
        });
      }
    });
  });
}
/*
##################################################################################
#                     End Of Services to update user details                     #                            
##################################################################################
*/

// Function to update user's status
async function changeUserStatus(db, userId, newStatus) {
  return new Promise((resolve, reject) => {
    const query = `UPDATE users SET status = ? WHERE Id = ?`;

    db.query(query, [newStatus, userId], (error, results) => {
      if (error) {
        console.error("Error updating user status:", error);
        reject("Failed to update user status");
      } else {
        resolve("User status updated successfully");
      }
    });
  });
}
// function that will report a user
async function handleReportUser(db, reportDetails) {
  return new Promise((resolve, reject) => {
    const insertQuery =
      "INSERT INTO reports (Reported_User_Id, Reporting_User_Id, Report_Cause, Message) VALUES (?, ?, ?, ?)";
    const incrementCounterQuery =
      "UPDATE users SET Report_Counter = Report_Counter + 1 WHERE Id = ?";

    db.query(
      insertQuery,
      [
        reportDetails.reportedUserId,
        reportDetails.reportingUserId,
        reportDetails.selectedReportCause,
        reportDetails.reportMessage,
      ],
      (insertError, insertResults) => {
        if (insertError) {
          reject("Error adding report");
        } else {
          db.query(
            incrementCounterQuery,
            [reportDetails.reportedUserId],
            (counterError, counterResults) => {
              if (counterError) {
                reject("Error incrementing user's report counter");
              } else {
                const checkCounterQuery =
                  "SELECT Report_Counter FROM users WHERE Id = ?";
                db.query(
                  checkCounterQuery,
                  [reportDetails.reportedUserId],
                  (checkCounterError, checkCounterResults) => {
                    if (checkCounterError) {
                      reject("Error fetching user's report counter");
                    } else {
                      if (checkCounterResults[0].Report_Counter >= 3) {
                        // Report counter reached 3 or more, return all reports for the reported user
                        const allReportsQuery =
                          "SELECT * FROM reports WHERE Reported_User_Id = ?";
                        db.query(
                          allReportsQuery,
                          [reportDetails.reportedUserId],
                          (reportsError, reportsResults) => {
                            if (reportsError) {
                              reject("Error fetching all reports");
                            } else {
                              resolve(reportsResults);
                            }
                          }
                        );
                      } else {
                        resolve("Report added and user's counter updated");
                      }
                    }
                  }
                );
              }
            }
          );
        }
      }
    );
  });
}

// Function that takes a notification id and marks the notification as read.
async function markNotificationAsRead(db, notificationId) {
  const query = `UPDATE notifications SET isRead = 1 WHERE id = ${notificationId}`;
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

// a function that will mark all the messages that a user recieved from a specific person as read when he clicks on his chat page.
async function markMessagesAsRead(db, user1Id, chatroom_id) {
  console.log(user1Id, chatroom_id);
  return new Promise((resolve, reject) => {
    const query = `
    UPDATE messages 
    SET isRead = 1 
    WHERE chat_room_id = ? 
    AND user_id != ? `;
    db.query(query, [chatroom_id, user1Id], (error, results) => {
      if (error) {
        console.log("Error marking messages as read : ", error);
      } else {
        resolve("marked messages as read");
      }
    });
  });
}

async function checkUnreadMessages(db, user1Id) {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT user_id AS sender_user_id, COUNT(*) AS unread_count
      FROM messages
      WHERE user_id != ? AND chat_room_id IS NOT NULL AND isRead = 0
      GROUP BY user_id
    `;
    db.query(query, [user1Id], (error, results) => {
      if (error) {
        reject(error);
      } else {
        resolve(results);
      }
    });
  });
}

// function to start chat room between 2 users so they can talk privately.
const startChat = (db, user1Id, user2Id) => {
  return new Promise((resolve, reject) => {
    // Check if a chat room already exists between user1 and user2
    const query = `SELECT id FROM chat_rooms WHERE (user1_id = ? AND user2_id = ?) OR (user1_id = ? AND user2_id = ?)`;
    db.query(query, [user1Id, user2Id, user2Id, user1Id], (error, results) => {
      if (error) {
        console.error("Error checking chat room:", error);
        reject("Internal Server Error");
      }

      if (results.length > 0) {
        // If a chat room exists, return its ID
        resolve({ room: results[0].id });
      } else {
        // If a chat room doesn't exist, create a new one
        const createQuery = `INSERT INTO chat_rooms (user1_id, user2_id) VALUES (?, ?)`;
        db.query(
          createQuery,
          [user1Id, user2Id],
          (createError, createResults) => {
            if (createError) {
              console.error("Error creating chat room:", createError);
              reject("Internal Server Error");
            }
            resolve({ room: createResults.insertId });
          }
        );
      }
    });
  });
};

async function markAllNotificationsAsRead(db) {
  return new Promise((resolve, reject) => {
    const query = "UPDATE notifications SET isRead = 1";
    db.query(query, (error, results) => {
      if (error) {
        console.log("Error marking notifications as read : ", error);
      } else {
        resolve("notifications deleted");
      }
    });
  });
}
// mark chat notifications as read query function
async function markChatNotificationsAsRead(user1Id, user2Id, db) {
  const query =
    "UPDATE notifications SET isRead = 1 WHERE userId = ? AND targetId = ? AND type = 'recieve-message-notification' ";
  return new Promise((resolve, reject) => {
    db.query(query, [user1Id, user2Id], (error, results) => {
      if (error) {
        reject(error);
      } else {
        resolve(results);
      }
    });
  });
}

// function that automatically runs every hour and auto cancels all pending orders that are older than 24 hours
function schedulePendingRemovals(db) {
  const twentyFourHoursAgo = moment().subtract(24, 'hours'); // 24 hours ago.
  const formattedDate = twentyFourHoursAgo.format('YYYY-MM-DD HH:mm:ss');
  const query = `UPDATE orders SET status = 'cancelled' WHERE status = 'pending' AND Order_Date < '${formattedDate}'`;
  db.query(query, (err, result) => {
    if (err) {
      console.error('Error removing pending orders:', err);
      return;
    }
    console.log('Pending orders cancelled successfully');
  });
}

module.exports = {
  registerUser,
  loginUser,
  addCar,
  orderCar,
  getOrdersByRenteeId,
  getOrdersByRenterId,
  updateOrderStatus,
  getOrderById,
  startChat,
  checkUserDetailsExist,
  updateUserDetails,
  changeUserStatus,
  handleReportUser,
  markNotificationAsRead,
  findAndDeclineConflictingOrders,
  searchCar,
  markMessagesAsRead,
  checkUnreadMessages,
  markAllNotificationsAsRead,
  markChatNotificationsAsRead,
  checkCarInUse,
  schedulePendingRemovals,
};
