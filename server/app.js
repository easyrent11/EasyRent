const express = require("express");
const app = express();
const cors = require("cors");
const carRoutes = require("./routes/cars");
const userRoutes = require("./routes/users");
const adminRoutes = require("./routes/admin");
const UserServices = require("./services/UserServices");
const http = require("http");
const { Server } = require("socket.io");
const db = require("./models/db");
// defining the server port.
const port = process.env.PORT || 3001;

// middleware.
app.use(cors());
app.use(express.json());
app.use("/images", express.static("images"));
// middleware for users, cars and admin
app.use("/cars", carRoutes);
app.use("/user", userRoutes);
app.use("/admin", adminRoutes);

// creating a new http server for the sockets io.
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

// socket io setup for real time notifications and chat app messages
const usersToSockets = new Map(); // a map for all socket objects of users.

io.on("connection", (socket) => {
  socket.on("authenticate", (userId) => {
    // Store user-to-socket mapping
    usersToSockets.set(userId, socket);
  });

  socket.on("join_room", (data) => {
    socket.join(data);
  });
  socket.on("send_message", (data) => {
    // Save the message in the database
    saveMessageToDB(data);

    // Emit the received message to all users in the chat room
    io.to(data.room).emit("receive_message", data);
  });

  // event listen for notification that will call the function to save the notification to db and send the notification to the user.
  socket.on("notification", (notificationDetails) => {
    console.log("notification = ",notificationDetails);
    saveNotificationToDataBase(notificationDetails, (error, notificationId) => {
      if (error) {
        console.log("error",error);
        return error;
      } else {
        console.log("Notification", notificationId);
        sendNotificationToUser(
          notificationDetails.userId,
          notificationDetails.targetId,
          notificationDetails.message,
          notificationDetails.type,
          notificationDetails.orderId,
          notificationId
        ); // send the notification to the receiver.
      }
    });
  });
  socket.on("disconnect", () => {
    // Remove user-to-socket mapping on disconnect
    for (const [user, userSocket] of usersToSockets.entries()) {
      if (userSocket === socket) {
        usersToSockets.delete(user);
        break;
      }
    }
  });
});

// To send a notification to a specific user
function sendNotificationToUser(userId,targetId, message, type, orderId, notificationId) {
  console.log(targetId);
  const userSocket = usersToSockets.get(userId);
  // send a new notification event to the user.
  if (userSocket) {
    userSocket.emit("notification", {userId,targetId, message, type, orderId, notificationId });
  }
}

// a function that will take notification details object and a callback and save the notification to db and return the id.
function saveNotificationToDataBase(notificationDetails, callback) {
  console.log(notificationDetails);
  const { userId,targetId, message, type, orderId } = notificationDetails;
  const query = `INSERT INTO notifications (userId,targetId, message, type, order_id) VALUES (?, ?, ?, ?,?)`;
  db.query(query, [userId,targetId, message, type, orderId], (error, results) => {
    if (error) {
      console.error("Error saving message:", error);
      callback(error, null); // Pass the error to the callback
    } else {
      const insertedId = results.insertId; // Get the ID of the inserted row
      console.log("Inserted Id",insertedId);
      console.log("Message saved successfully! ID:", insertedId);
      callback(null, insertedId); // Pass the inserted ID to the callback
    }
  });
}


// Function to save the message in the database
function saveMessageToDB(data) {
  const { room, message, user_id } = data;

  const query = `INSERT INTO messages (chat_room_id, user_id, text) VALUES (?, ?, ?)`;
  db.query(query, [room, user_id, message], (error, results) => {
    if (error) {
      console.error("Error saving message:", error);
      // Handle the error if necessary
    } else {
      console.log("Message saved successfully!");
    }
  });
}

//Run schedulePendingRemovals every hour
setInterval(() => {UserServices.schedulePendingRemovals(db)},60 * 60 * 1000); 

// Listen for incoming connections on the same port for both Express app and Socket.IO
server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
