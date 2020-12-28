const express = require("express");
const socketio = require("socket.io");
const http = require("http");

const {
  addUser,
  removeUser,
  roomAlreadyExists,
  filterMsg,
  getUserById,
} = require("./userActions");

const {
  JOIN_ROOM,
  CONNECTION_ACK,
  LEAVE_ROOM,
  SEND_MSG,
  RCV_MSG,
} = require("./constants");

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
  socket.emit(CONNECTION_ACK, {});

  // Joining users into a room...
  socket.on(JOIN_ROOM, ({ name, room }, callback) => {
    const { error, success, roomName } = addUser({ id: socket.id, name, room });

    if (error) {
      return callback(error);
    }

    if (roomName && success) {
      socket.join(roomName);
    }
    return callback(success);
  });

  // Removing user from room...
  socket.on(LEAVE_ROOM, ({ name }, callback) => {
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
  socket.on(SEND_MSG, ({ msg, room }, callback) => {
    // Filtering the msg...
    msg = filterMsg(msg);

    // checking if msg is well formatted..
    if (!msg) {
      const error = "Message is not well formatted";
      return callback(error);
    }

    // Checking if the room exists...
    if (!roomAlreadyExists(room)) {
      const error = "Room does not exists";
      return callback(error);
    }

    socket.broadcast.to(room).emit(RCV_MSG, { msg });

    const success = "Message sent";
    return callback(success);
  });

  // Disconnecting socket..
  socket.on("disconnect", () => {
    // Removing user from the room...
    const name = getUserById(socket.id);
    if (name) {
      const { error, success, roomName } = removeUser(name);
      if (success && roomName) {
        socket.leave(roomName);
        console.log(name, " left");
      }

      if (error) {
        console.log(error);
      }
    } else {
      console.log("user left");
    }
  });
});

app.use(router);

// make the server running...
server.listen(PORT, () => console.log(`Server is running on port: ${PORT}`));
