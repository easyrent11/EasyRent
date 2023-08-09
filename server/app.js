const express = require("express");
const app = express();
const cors = require("cors");
const carRoutes = require("./routes/cars");
const userRoutes = require("./routes/users");
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

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

// the socket.io server for chat app.

io.on("connection", (socket) => {
  console.log(`⚡: ${socket.id} user just connected`);

  socket.on("join_notifications_room", (notificationsRoomId) => {
    socket.join(notificationsRoomId);
  });

  socket.on("send_notification", (data) => {
    saveNotificationToDB(data);
    io.to(data.room).emit(
      "receive_notification",
      data
    );
  });

  socket.on("join_room", (data) => {
    socket.join(data);
  });
  socket.on("send_message", (data) => {
    // Save the message in the database
    saveMessageToDB(data);
    console.log("data we got", data);

    // Emit the received message to all users in the chat room
    io.to(data.room).emit("receive_message", data);
  });
});

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
