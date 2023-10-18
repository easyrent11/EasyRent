const express = require("express");
const router = express.Router();
const fs = require("fs");
const db = require("../models/db");
const verifyToken = require("../middleware/auth");
const multer = require("multer");
const path = require("path");
const UserServices = require("../services/UserServices");
const bcrypt = require("bcrypt");

// register route.
router.post("/register", async (req, res) => {
  const userData = req.body;
  console.log(userData);
  try {
    const result = await UserServices.registerUser(db, userData);
    res.status(200).json(result);
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ error: "Failed to register user" });
  }
});
// route to checkc if user details exist in the website.
router.post("/userdetailsexist", (req, res) => {
  const userDetails = req.body;
  UserServices.checkUserDetailsExist(db, userDetails)
    .then((results) => {
      res.status(200).json({ results: results });
    })
    .catch((error) => {
      console.error("Error:", error);
      res.status(500).json({ error: "An error occurred" });
    });
});

// login route.
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await UserServices.loginUser(db, email, password);
    res.status(200).json(result);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    const colonIndex = errorMessage.indexOf(":");
    const formattedErrorMessage =
      colonIndex !== -1
        ? errorMessage.slice(colonIndex + 1).trim()
        : errorMessage;
    res.status(401).json({ message: formattedErrorMessage });
  }
});

// Protected user page route. *****
router.get("/homepage", verifyToken, (req, res) => {
  // Access user information from req.user
  const { first_name } = req.user;

  // Perform actions specific to the authenticated user
  res.json({ message: `Welcome, ${first_name}` });
});

// Route for adding a car.
router.post("/addcar", async (req, res) => {
  // grabbing the car details  from the body.
  const carData = req.body;
  try {
    // calling the function that will do the logic.
    const result = await UserServices.addCar(db, carData);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json(error);
  }
});

// Route for searching a car.
router.post("/searchcar", async (req, res) => {
  // grabbing the search details from the body.
  const { city, pickupDate, returnDate, startTime, endTime } = req.body;

  try {
    // calling the function that will do the logic.
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
// route to report a user 
router.post("/reportuser", async (req, res) => {
  const reportDetails = req.body;
  console.log(reportDetails);

  try {
    const result = await UserServices.handleReportUser(db, reportDetails);
    res.send(result);
  } catch (error) {
    res.status(500).send("Internal server error");
  }
});
// route to get all reports.
router.get("/reports", (req, res) => {
  const getReportsQuery = `
    SELECT 
      reports.*, 
      reported_users.first_name AS reported_first_name, 
      reported_users.last_name AS reported_last_name,
      reporting_users.first_name AS reporting_first_name,
      reporting_users.last_name AS reporting_last_name
    FROM 
      reports 
    JOIN 
      users AS reported_users ON reports.Reported_User_Id = reported_users.Id 
    JOIN
      users AS reporting_users ON reports.Reporting_User_Id = reporting_users.Id 
    WHERE 
      Reported_User_Id IN (SELECT Id FROM users WHERE Report_Counter >= 3)
  `;

  db.query(getReportsQuery, (error, results) => {
    if (error) {
      res.status(500).json({ error: "Error fetching reports" });
    } else {
      res.json(results);
    }
  });
});

// Route to get all reports for a specific user
router.get("/reports/:userId", (req, res) => {
  const userId = req.params.userId;

  const getReportsQuery = `
    SELECT 
      reports.*, 
      reported_users.first_name AS reported_first_name, 
      reported_users.last_name AS reported_last_name,
      reporting_users.first_name AS reporting_first_name,
      reporting_users.last_name AS reporting_last_name
    FROM 
      reports 
    JOIN 
      users AS reported_users ON reports.Reported_User_Id = reported_users.Id 
    JOIN
      users AS reporting_users ON reports.Reporting_User_Id = reporting_users.Id 
    WHERE 
      Reported_User_Id = ?
  `;

  db.query(getReportsQuery, [userId], (error, results) => {
    if (error) {
      res.status(500).json({ error: "Error fetching user reports" });
    } else {
      res.json(results);
    }
  });
});

// Route for getting all user details of a user based on the provided user id.
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

// route to update user details.
router.put("/updateuserdetails", async (req, res) => {
  const updatedUserDetails = req.body;
  console.log("In backend", updatedUserDetails);

  try {
    const result = await UserServices.updateUserDetails(db, updatedUserDetails);
    res.status(200).json(result);
  } catch (error) {
    console.error("Failed to update user details :", error);
    res.status(500).json({ error: "Failed to update user details" });
  }
});
// route to change password.
router.post("/changepassword", (req, res) => {
  const { userId, currentPassword, newPassword } = req.body;
  console.log(userId, currentPassword, newPassword);
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

        const updateQuery = `UPDATE users SET password = ? WHERE Id = ?`;

        db.query(updateQuery, [newHashedPassword, userId], (error) => {
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

// route to upload a profile image of the user and return the full url of the uploaded image.
router.post("/uploadProfileImage", (req, res) => {
  upload(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      return res.status(500).json({ message: "File upload error" });
    } else if (err) {
      // An unknown error occurred during file upload
      console.error(err);
      return res.status(500).json({ message: "Internal Server Error" });
    }
    // Check if a file was uploaded
    const file = req.file;

    if (!file) {
      return res
        .status(200)
        .json({ message: "No file provided", fileUrl: null });
    }

    //  If no errors occured , Process the uploaded file and construct a url.
    const fileExtension = file.mimetype.split("/")[1];
    const newFileName = `${file.filename}.${fileExtension}`;
    const newFilePath = path.join(__dirname, "../images", newFileName);
    fs.renameSync(file.path, newFilePath);

    const fileUrl = `${req.protocol}://${req.get(
      "host"
    )}/images/${newFileName}`;
    // return the status message and the url of the image.
    return res.json({ message: "Success", fileUrl });
  });
});

// Route for ordering a car.
router.post("/ordercar", async (req, res) => {
  // Extracting the order details from the body.
  const {
    Start_Date,
    End_Date,
    Car_Plates_Number,
    Rentee_Id,
    Start_Time,
    End_Time,
    status,
    Renter_Id,
    Order_Date,
  } = req.body;

  // Constructing the order details object
  const orderDetails = {
    Start_Date,
    End_Date,
    Car_Plates_Number,
    Rentee_id: Rentee_Id, // Make sure to use the correct key here (Rentee_Id)
    Start_Time,
    End_Time,
    status,
    Renter_Id,
    Order_Date,
  };

  try {
    // calling the function that will do the logic and getting back the id of the order.
    const order = await UserServices.orderCar(db, orderDetails);
    res
      .status(201)
      .json({ message: "Your request was sent to the renter", order: order });
  } catch (error) {
    res.status(500).json({ error: "Failed to send request to the renter" });
  }
});

// Route for fetching orders with renter_id matching userId
router.get("/getOrdersByRenterId/:userId", async (req, res) => {
  const userId = req.params.userId;
  try {
    const orders = await UserServices.getOrdersByRenterId(db, userId);
    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching orders by renter_id:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Route for fetching orders with rentee_id matching userId
router.get("/getOrdersByRenteeId/:userId", async (req, res) => {
  const userId = req.params.userId;
  try {
    const orders = await UserServices.getOrdersByRenteeId(db, userId);
    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching orders by rentee_id:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// API route to get an order by orderId
router.get("/orders/:orderId", async (req, res) => {
  const { orderId } = req.params;

  try {
    const order = await UserServices.getOrderById(db, orderId);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    return res.status(200).json(order);
  } catch (error) {
    console.error("Error fetching order:", error);
    return res.status(500).json({ message: "Error fetching order" });
  }
});

router.put("/changeorderstatus", async (req, res) => {
  const { orderId, status } = req.body;
  try {
    // Check if the order with the given orderId exists in the database
    const order = await UserServices.getOrderById(db, orderId);
    if (!order) {
      return res.status(404).json({ error: "Order not found." });
    }
    // Update the status of the order and fetch the updated order
    const updatedOrder = await UserServices.updateOrderStatus(
      db,
      orderId,
      status
    );
    return res.json({
      order: updatedOrder,
      message: "Order status updated successfully.",
    });
  } catch (error) {
    console.error("Error updating order status:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
});

router.put("/decline-conficting-orders", async (req, res) => {
  const { orderId, carPlatesNumber } = req.body;
  console.log(orderId,carPlatesNumber);
  try {
    // Update the status of the order and fetch the updated order
    const result = await UserServices.findAndDeclineConflictingOrders(
      db,
      orderId,
      carPlatesNumber
    );
    console.log(result);
    return res.json({conflictingOrders:result});
  } catch (error) {
    console.error("Error updating order status:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
});

router.put("/changeuserstatus", async (req, res) => {
  const { userId, newStatus } = req.body;
  console.log(userId, newStatus);
  try {
    await UserServices.changeUserStatus(db, userId, newStatus);
    return res.json({ message: "User status changed" });
  } catch {
    return res.status(500).json({ error: "Internal server error" });
  }
});

// Route to get messages for a specific chat room
router.get("/messages/:room", (req, res) => {
  const room = req.params.room;

  // Use your database query method to retrieve messages for the specified chat room
  const query = `SELECT text AS message,chat_room_id as room, user_id,timestamp FROM messages WHERE chat_room_id = ?`;
  db.query(query, [room], (error, results) => {
    if (error) {
      console.error("Error retrieving messages:", error);
      res.status(500).json({ error: "Internal Server Error" });
    } else {
      // Send the messages back to the frontend
      res.json(results);
    }
  });
});
// route to get all chatrooms for a user via id.
router.get("/chatroom/:userId", (req, res) => {
  const userId = req.params.userId;
  const query = "SELECT * FROM chat_rooms WHERE user1_id = ? or user2_id = ?";
  db.query(query, [userId, userId], (error, results) => {
    if (error) {
      res.status(500).json({ error: "Internal Server Error" });
    } else {
      // send the chat rooms of the user.
      res.json(results);
    }
  });
});
// route to get all users.
router.get("/getAllUsers", (req, res) => {
  const query = "SELECT * from users";

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
// route to get a users latest orders.
router.get("/getlatestorders", (req, res) => {
  const query = "SELECT * FROM orders ORDER BY Order_Date DESC LIMIT 5";
  db.query(query, (error, results) => {
    if (error) {
      console.error("Failed to retrieve latest orders.", error);
      res.status(500).json({ error: "Internal server error" });
    } else {
      res.json(results);
    }
  });
});
// route to initialize a chat between 2 people.
router.post("/startChat", async (req, res) => {
  let { user1Id, user2Id } = req.body;
  // convert userId from string to int.
  user1Id = parseInt(user1Id);
  try {
    const result = await UserServices.startChat(db, user1Id, user2Id);
    res.status(200).json(result);
  } catch (error) {
    console.error("Error during chatroom start chat:", error);
    res.status(401).json({ message: "Something went wrong" });
  }
});
// route to get all orders.
router.get("/orders", async (req, res) => {
  const query = "SELECT * FROM orders";
  db.query(query, (error, results) => {
    if (error) {
      console.error("Failed to retrieve  orders.", error);
      res.status(500).json({ error: "Internal server error" });
    } else {
      res.json(results);
    }
  });
});
// route to get all unread notifications for a user via id.
router.get("/notifications/:userId", async (req, res) => {
  const userId = req.params.userId;
  const query =
    "SELECT * FROM notifications WHERE userId = ? AND isRead  = false";
  db.query(query, [userId], (error, results) => {
    if (error) {
      console.error("Failed to retrieve  notifications for user.", error);
      res.status(500).json({ error: "Internal server error" });
    } else {
      res.json(results);
    }
  });
});
// route to mark a notification as read via id.
router.put("/notifications/:notificationId", async (req, res) => {
  const notificationId = req.params.notificationId;
  try {
    const result = await UserServices.markNotificationAsRead(
      db,
      notificationId
    );
    res.status(200).json(result);
  } catch (error) {
    console.error("Error during marking notification as read", error);
    res.status(401).json({ message: "Something went wrong" });
  }
});

// multer function for uploading a single profile image.
const upload = multer({
  dest: path.join(__dirname, "../images"),
}).single("profileImage");

module.exports = router;
