const express = require("express");
const socketio = require("socket.io");
const http = require("http");

const {
  addUser,
  removeUser,
  roomAlreadyExists,
  filterMsg,
} = require("./userActions");

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
    const { error, success, roomName } = addUser({ name, room });

    if (error) {
      return callback(error);
    }

    if (roomName && success) {
      socket.join(roomName);
    }
    return callback(success);
  });

  // Removing user from room...
  socket.on("LEAVE_ROOM", ({ name }, callback) => {
    const { error, success, roomName } = removeUser(name);

    if (error) {
      return callback(error);
    }

    if (roomName && success) {
      socket.leave(roomName);
    }

    return callback(success);
  });

  // On getting chat messages...
  socket.on("SEND_MSG", ({ msg, room }, callback) => {
    // Filtering the msg...
    msg = filterMsg(msg);

    // Checking if the room exists...
    if (!roomAlreadyExists(room)) {
      const error = "Room does not exists";
      return callback(error);
    }

    socket.broadcast.to(room).emit("RCV_MSG", { msg });

    const success = "Message sent";
    return callback(success);
  });

  // Disconnecting socket..
  socket.on("disconnect", () => {
    // Later we have to remove user from the room if user disconnects...
    console.log("user left");
  });
});

app.use(router);

// make the server running...
server.listen(PORT, () => console.log(`Server is running on port: ${PORT}`));
