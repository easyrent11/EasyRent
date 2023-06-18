const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const db = require("../models/db");
const verifyToken = require("../middleware/auth");
const multer = require("multer");
const path = require("path");
const e = require("express");

router.post("/register", async (req, res) => {
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
  } = req.body;

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
    db.query(
      "SELECT * FROM cities WHERE City_Code = ?",
      [city_code],
      (cityError, cityResults) => {
        if (cityError) {
          console.error("Error checking city:", cityError);
          res.status(500).json({ error: "Failed to register user" });
        } else {
          if (cityResults.length > 0) {
            // City already exists, update the user instead of inserting
            db.query(
              "INSERT INTO users SET ?",
              user,
              (userError, userResults) => {
                if (userError) {
                  console.error("Error registering user:", userError);
                  res.status(500).json({ error: "Failed to register user" });
                } else {
                  res.status(200).json({
                    results: userResults,
                    message: "User registered successfully",
                  });
                }
              }
            );
          } else {
            // City does not exist, insert the city and user
            db.query(
              "INSERT INTO cities (City_Code, City_Name) VALUES (?, ?)",
              [city_code, city_name],
              (insertError) => {
                if (insertError) {
                  console.error("Error adding city:", insertError);
                  res.status(500).json({ error: "Failed to register user" });
                } else {
                  // Insert the user into the "users" table
                  db.query(
                    "INSERT INTO users SET ?",
                    user,
                    (userError, userResults) => {
                      if (userError) {
                        console.error("Error registering user:", userError);
                        res
                          .status(500)
                          .json({ error: "Failed to register user" });
                      } else {
                        res.status(200).json({
                          results: userResults,
                          message: "User registered successfully",
                        });
                      }
                    }
                  );
                }
              }
            );
          }
        }
      }
    );
  } catch (error) {
    console.error("Error hashing password:", error);
    res.status(500).json({ error: "Failed to register user" });
  }
});

router.post("/login", (req, res) => {
  const { email, password } = req.body;

  // Check if the user exists in the database
  const query = "SELECT * FROM users WHERE email = ?";
  db.query(query, [email], async (error, results) => {
    if (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const user = results[0];
    console.log(user);

    // Compare the provided password with the hashed password
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid password" });
    }
    // Password is correct, user is authenticated
    // Generate a token with the userId and userFirstName
    const token = jwt.sign(
      { userId: user.Id },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "12h" }
    );
    // Send the token and success message as a response
    res.status(200).json({
      message: "Login successful",
      token,
      userFirstName: user.first_name,
      userId: user.Id,
    });
  });
});
// Protected user page route.
router.get("/homepage", verifyToken, (req, res) => {
  // Access user information from req.user
  const { first_name, userId } = req.user;

  // Perform actions specific to the authenticated user
  res.json({ message: `Welcome, ${first_name}` });
});

// Route for adding a car
router.post("/addcar", (req, res) => {
  const {
    Manufacturer_Name,
    Manufacturer_Code,
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
  } = req.body;

  console.log(image_url, Renter_Id);

  // Check if the manufacturer exists in the manufacturers table
  db.query(
    "SELECT * FROM car_manufacturer WHERE Manufacturer_Code = ?",
    [Manufacturer_Code],
    (error, manufacturerResults) => {
      if (error) {
        console.error("Error checking manufacturer:", error);
        res.status(500).json({ error: "Failed to add car" });
      } else {
        if (manufacturerResults.length === 0) {
          // Manufacturer does not exist, insert into manufacturers table
          db.query(
            "INSERT INTO car_manufacturer (Manufacturer_Code, Manufacturer_Name) VALUES (?, ?)",
            [Manufacturer_Code, Manufacturer_Name],
            (error) => {
              if (error) {
                console.error("Error adding manufacturer:", error);
                res.status(500).json({ error: "Failed to add car" });
              } else {
                // Proceed to insert the model information
                insertModel();
              }
            }
          );
        } else {
          // Manufacturer exists, proceed to insert the model information
          insertModel();
        }
      }
    }
  );

  // Function to insert the model information
  function insertModel() {
    // Check if the model exists in the models table
    db.query(
      "SELECT * FROM car_models WHERE model_code = ?",
      [model_code],
      (error, modelResults) => {
        if (error) {
          console.error("Error checking model:", error);
          res.status(500).json({ error: "Failed to add car" });
        } else {
          if (modelResults.length === 0) {
            // Model does not exist, insert into models table
            db.query(
              "INSERT INTO car_models (model_code, model_name, Manufacturer_code) VALUES (?, ?, ?)",
              [model_code, model_name, Manufacturer_Code],
              (error) => {
                if (error) {
                  console.error("Error adding model:", error);
                  res.status(500).json({ error: "Failed to add car" });
                } else {
                  // Proceed to insert the type information
                  insertCar();
                }
              }
            );
          } else {
            // Model exists, proceed to insert the type information
            insertCar();
          }
        }
      }
    );
  }
  // Function to insert the car details into the cars table

  function insertCar() {
    db.query(
      "SELECT id FROM users WHERE id = ?",
      [Renter_Id],
      (error, results) => {
        if (error) {
          console.error("Error checking user:", error);
          res.status(500).json({ error: "Failed to add car" });
        } else {
          if (results.length === 0) {
            // User with the specified Renter_Id doesn't exist
            res.status(400).json({ error: "Renter_Id not found" });
          } else {
            // User exists, proceed to insert the car
            db.query(
              "INSERT INTO cars (Manufacturer_Code, model_code, Plates_Number, Year, Color, Seats_Amount, Engine_Type, Transmission_type, Description, Rental_Price_Per_Day, Renter_Id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
              [
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
              ],
              (error, results) => {
                if (error) {
                  console.error("Error adding car:", error);
                  res.status(500).json({ error: "Failed to add car" });
                } else {
                  // Proceed to insert the image URLs into the car_images table
                  const fileUrls = image_url || [];
                  const insertPromises = fileUrls.map((url) => {
                    return new Promise((resolve, reject) => {
                      db.query(
                        "INSERT INTO car_images (Plates_Number, image_url) VALUES (?, ?)",
                        [Plates_Number, url],
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

                  //Execute all insert promises
                  Promise.all(insertPromises)
                    .then(() => {
                      res
                        .status(200)
                        .json({ message: "Car added successfully" });
                    })
                    .catch((error) => {
                      res
                        .status(500)
                        .json({ error: "Failed to add car images" });
                    });
                }
              }
            );
          }
        }
      }
    );
  }
});

router.get("/getuser/:id", (req, res) => {
  const userId = req.params.id;
  const query = `SELECT * FROM users WHERE id = ${userId}`;
  db.query(query, (error, results) => {
    if (error) {
      // Handle the error
      console.error("Error retrieving user info:", error);
      res.status(500).json({ error: "Internal Server Error" });
    } else {
      // User info retrieved successfully
      res.json(results);
    }
  });
});

// route to update user infomation.
router.put("/updateuserdetails", (req, res) => {
  // Retrieve the updated user details from the request body
  const updatedUserDetails = req.body;
  console.log(updatedUserDetails);

  // Get the previous picture filename from the database
  const findPreviousPictureQuery = `SELECT picture FROM users WHERE id = ${updatedUserDetails.Id}`;

  db.query(findPreviousPictureQuery, (error, results) => {
    if (error) {
      console.error("Error updating user profile:", error);
      res.status(500).json({ message: "Could not find user old picture" });
    } else {
      if (results.length > 0) {
        const previousPictureFilename = results[0].picture;
        const filePath = path.join(
          __dirname,
          "../images/",
          previousPictureFilename
        );
        fs.unlink(filePath, (error) => {
          if (error) {
            console.error("Error deleting previous picture:", error);
          } else {
            console.log("Previous picture deleted successfully");
          }
        });
      } else {
        console.log("No previous picture found");
      }
    }
  });

  const query = `
    UPDATE users
    SET
      first_name = '${updatedUserDetails.first_name}',
      last_name = '${updatedUserDetails.last_name}',
      email = '${updatedUserDetails.email}',
      phone_number = '${updatedUserDetails.phone_number}',
      driving_license = '${updatedUserDetails.driving_license}',
      picture = '${updatedUserDetails.picture}'
    WHERE id = ${updatedUserDetails.Id}
  `;
  // Execute the SQL query
  db.query(query, (error, results) => {
    if (error) {
      console.error("Error updating user profile:", error);
      res.status(500).json({ message: "Failed to update user profile" });
    } else {
      res.json({ message: "User profile updated successfully" });
    }
  });
});

router.post("/uploadProfileImage", (req, res) => {
  upload(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      // A Multer error occurred during file upload
      console.error(err);
      return res.status(500).json({ message: "File upload error" });
    } else if (err) {
      // An unknown error occurred during file upload
      console.error(err);
      return res.status(500).json({ message: "Internal Server Error" });
    }

    // Check if a file was uploaded
    const file = req.file;
    if (!file) {
      return res.status(400).json({ message: "No file provided" });
    }

    //  If no errors occured , Process the uploaded file
    const fileExtension = file.mimetype.split("/")[1];
    const newFileName = `${file.filename}.${fileExtension}`;
    const newFilePath = path.join(__dirname, "../images", newFileName);
    fs.renameSync(file.path, newFilePath);

    const fileUrl = `${req.protocol}://${req.get(
      "host"
    )}/images/${newFileName}`;

    return res.json({ message: "Success", fileUrl });
  });
});

const upload = multer({
  dest: path.join(__dirname, "../images"),
}).single("profileImage");

module.exports = router;
