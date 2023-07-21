const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

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
    console.log("Renter id = ",Renter_Id);
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

    // Insert the image URLs into the car_images table
    if (image_url && image_url.length > 0) {
      await insertCarImages(db, Plates_Number, image_url);
    }

    return { message: "Car added successfully" };
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

// Function to generate JWT token
function generateToken(userId) {
  return jwt.sign({ userId }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "12h",
  });
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

    // Password is correct, user is authenticated
    // Generate a token with the userId
    const token = generateToken(user.Id);

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

module.exports = {
  registerUser,
  loginUser,
  addCar
};