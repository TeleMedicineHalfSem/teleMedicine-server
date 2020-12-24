const express = require("express");
const socketio = require("socket.io");
const http = require("http");

const { addUser, removeUser, getUser, getUsersInRoom } = require("./users");

const PORT = process.env.PORT || 2500;
const ENDPOINT = process.env.ENDPOINT || "http://localhost:3000";

const router = require("./router");

const app = express();
const server = http.createServer(app);
const io = socketio(server, {
  cors: {
    origin: ENDPOINT,
    methods: ["GET", "POST"],
  },
});

// Connecting socket io...
io.on("connection", (socket) => {
  console.log("User connected");

  // Emitting if user is connected...
  socket.emit("CONNECTION_ACK", {});

  // Joining users into a room...
  socket.on("JOIN_ROOM", ({ name, room }, callback) => {
    const { error, success, user } = addUser({ name, room });

    if (error) {
      return callback(error);
    }

    if (user && success) {
      socket.join(user.room);
    }
    return callback(success);
  });

  // On getting chat messages...
  socket.on("SEND_MSG", ({ msg, room }) => {
    const users = getUsersInRoom(room);
    if (users) {
      socket.broadcast.to(room).emit("RCV_MSG", msg);
    }
  });

  // Disconnecting socket..
  socket.on("disconnect", () => {
    console.log("user left");
  });
});

app.use(router);

// make the server running...
server.listen(PORT, () => console.log(`Server is running on port: ${PORT}`));
