const express = require("express");
const router = express.Router();
const fs = require("fs");
const db = require("../models/db");
const verifyToken = require("../middleware/auth");
const multer = require("multer");
const path = require("path");
const UserServices = require('../services/UserServices');


// register route.
router.post("/register", async (req, res) => {
  const userData = req.body;
  try {
    const result = await UserServices.registerUser(db, userData);
    res.status(200).json(result);
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ error: "Failed to register user" });
  }
});
// login route.
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await UserServices.loginUser(db, email, password);
    res.status(200).json(result);
  } catch (error) {
    console.error("Error during login:", error);
    res.status(401).json({ message: "Invalid credentials" });
  }
});


// Protected user page route. *****
router.get("/homepage", verifyToken, (req, res) => {
  // Access user information from req.user
  const { first_name, userId } = req.user;

  // Perform actions specific to the authenticated user
  res.json({message: `Welcome, ${first_name}` });
});


router.post("/addcar", async (req, res) => {
  const carData = req.body;
  console.log(carData);
  try {
    const result = await UserServices.addCar(db, carData);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: "Failed to add car" });
  }
});

router.post("/searchcar", async (req, res) => {
  const { city, pickupDate, returnDate, startTime, endTime } = req.body;

  try {
    const result = await UserServices.searchCar(
      db,
      city,
      pickupDate,
      returnDate,
      startTime,
      endTime
    );
    res.send(result);
  } catch (error) {
    console.error("Error fetching car list:", error);
    res.status(500).send("Internal Server Error");
  }
});


router.get("/getuser/:id", (req, res) => {
  const userId = req.params.id;
  const query = `SELECT users.Id, users.phone_number, users.driving_license, users.picture, users.email, users.city_code,cities.City_Name, users.street_name, users.first_name, users.last_name, users.isadmin, users.status
                 FROM users
                 INNER JOIN cities ON users.city_code = cities.city_code
                 WHERE users.id = ${userId}`;

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
        const filePath = path.join(__dirname,"../images/",previousPictureFilename);
        if (fs.existsSync(filePath)) {
          fs.unlink(filePath, (error) => {
            if (error) 
              console.error("Error deleting previous picture:", error);
            else 
              console.log("Previous picture deleted successfully");
          });
        }
      } 
      else {
        console.log("No previous picture found in the user database.");
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
      street_name = '${updatedUserDetails.street_name}',
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

router.post('/changepassword', (req, res) => {
  const { userId, currentPassword, newPassword } = req.body;
  console.log(userId,currentPassword, newPassword);
  // Retrieve the user's hashed password from the database
  const passwordQuery = `SELECT password FROM users WHERE id = ${userId}`;
  db.query(passwordQuery, (error, results) => {
    if (error) {
      console.error("Error retrieving user's hashed password:", error);
      res.status(500).json({ error: "Internal Server Error" });
      return;
    }

    if (results.length === 0) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    const hashedPassword = results[0].password;

    // Compare the entered current password with the stored hashed password
    bcrypt.compare(currentPassword, hashedPassword, (error, result) => {
      if (error) {
        console.error("Error comparing passwords:", error);
        res.status(500).json({ error: "Internal Server Error" });
        return;
      }

      if (!result) {
        // Current password is incorrect
        res.status(400).json({ error: "Incorrect current password" });
        return;
      }

      // Hash the new password
      bcrypt.hash(newPassword, 10, (error, newHashedPassword) => {
        if (error) {
          console.error("Error hashing new password:", error);
          res.status(500).json({ error: "Internal Server Error" });
          return;
        }

        // Update the user's password in the database with the new hashed password
        const updateQuery = `UPDATE users SET password = ${newHashedPassword} WHERE id = ${userId}`;
        db.query(updateQuery, (error) => {
          if (error) {
            console.error("Error updating user's password:", error);
            res.status(500).json({ error: "Internal Server Error" });
            return;
          }

          // Password update successful
          res.json({ message: "Password updated successfully" });
        });
      });
    });
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


router.post('/ordercar', async (req, res) => {
  try {
    const orderId = await orderCar(req.body);
    res.status(201).json({ orderId });
  } catch (error) {
    res.status(500).json({ error: "Failed to create order" });
  }
});

const upload = multer({
  dest: path.join(__dirname, "../images"),
}).single("profileImage");

module.exports = router;
