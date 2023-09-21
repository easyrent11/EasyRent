const express = require("express");
const app = express();
const cors = require("cors");
const carRoutes = require("./routes/cars");
const userRoutes = require("./routes/users");
const adminRoutes = require("./routes/admin");
const http = require("http");
const { Server } = require("socket.io");
const db = require("./models/db");
// defining the server port.
const port = process.env.PORT || 3001;

// middleware.
app.use(cors());
app.use(express.json());


app.use("/images", express.static("images"));
app.use("/cars", carRoutes);
app.use("/user", userRoutes);
app.use("/admin",adminRoutes);


const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

// socket io setup for real time notifications and chat app messages
const usersToSockets = new Map();

io.on("connection", (socket) => {

  socket.on('authenticate', (userId) => {
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

  socket.on('notification', (notificationDetails) => {
    saveNotificationToDataBase(notificationDetails); // saving the notification in db.
    sendNotificationToUser(notificationDetails.userId, notificationDetails.message, notificationDetails.type); // send the notification to the reciever.
  });

  socket.on('disconnect', () => {
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
function sendNotificationToUser(userId, message, type) {
  const userSocket = usersToSockets.get(userId);
  if (userSocket) {
    userSocket.emit('notification', {message,type});
  }
}

function saveNotificationToDataBase(notificationDetails){
  const {userId,message,type, orderId} = notificationDetails;
  const query = `INSERT INTO notifications (userId,message,type, order_id) VALUES (? ,? ,?,?)`;
  db.query(query, [userId,message,type, orderId], (error, results) => {
    if (error) {
      console.error("Error saving message:", error);
    } else {
      console.log("Message saved successfully!");
    }
  });
}


// Function to save the message in the database
function saveMessageToDB(data) {
  const { room, message, user_id } = data;

  // You can use your database query method here to insert the message into the database
  // For example, using MySQL with the "mysql2" package:
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

// Listen for incoming connections on the same port for both Express app and Socket.IO
server.listen(port, () => {
 
  
  console.log(`Server listening on port ${port}`);
});
