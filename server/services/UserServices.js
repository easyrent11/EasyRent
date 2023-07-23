const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

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
            resolve();
          }
        }
      );
    });
  });

  return Promise.all(insertPromises);
}

// Function to add a car
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
    console.error("Error adding car:", error);
    throw new Error("Failed to add car");
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
      const userResults = await insertUser(db, user);
      return { results: userResults, message: "User registered successfully" };
    } else {
      // City does not exist, insert the city and user
      await insertCity(db, city_code, city_name);
      const userResults = await insertUser(db, user);
      return { results: userResults, message: "User registered successfully" };
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

function generateToken(userId, expiresIn) {
  const accessToken = jwt.sign({ userId }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn,
  });

  return accessToken;
}
// Function to handle user login
async function loginUser(db, email, password) {
  try {
    // Check if the user exists in the database
    const results = await getUserByEmail(db, email);
    if (results.length === 0) {
      throw new Error("User not found");
    }

    const user = results[0];

    // Compare the provided password with the hashed password
    const passwordMatch = await comparePasswords(password, user.password);
    if (!passwordMatch) {
      throw new Error("Invalid password");
    }

    //If we got here then password is correct, Generate a token with the userId
    const token = generateToken(user.Id,'1h');

    // Return the token and user details
    return {
      message: "Login successful",
      token,
      userFirstName: user.first_name,
      userId: user.Id,
    };
  } catch (error) {
    console.error("Error during login:", error);
    throw new Error("Failed to login");
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
    INSERT INTO orders (Start_Date, End_Date, Car_Plates_Number, Rentee_id, Start_Time, End_Time, status, Renter_Id)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
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
      ],
      (err, result) => {
        if (err) {
          console.log("Error creating order:", err);
          reject("Failed to create order");
        } else {
          console.log("Order created successfully:", result);
          resolve(result.insertId); // Return the ID of the newly inserted order
        }
      }
    );
  });
}

/*
##################################################################################
#           Function to get all orders based on renter id and rentee id          #                            
##################################################################################
*/
  // Function to fetch orders with renter_id matching userId
  async function getOrdersByRenterId(db, userId){
    const query = `SELECT * FROM orders WHERE Renter_Id = ${userId}`;
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
  async function getOrdersByRenteeId(db, userId){
    const query = `SELECT * FROM orders WHERE Rentee_Id = ${userId}`;
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



module.exports = {
  registerUser,
  loginUser,
  addCar,
  searchCar,
  orderCar,
  getOrdersByRenteeId,
  getOrdersByRenterId,
};
