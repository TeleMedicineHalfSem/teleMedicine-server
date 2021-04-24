const express = require("express");
const socketio = require("socket.io");
const cors = require("cors");
const http = require("http");

const {
  addUser,
  removeUser,
  roomAlreadyExists,
  filterMsg,
  getUserById,
  getUsersByName,
} = require("./userActions");

const {
  JOIN_ROOM,
  CONNECTION_ACK,
  LEAVE_ROOM,
  SEND_MSG,
  RCV_MSG,
  LEFT_ROOM,
  CONNECT_CALL,
} = require("./constants");

const PORT = 2500;
const ENDPOINT = "https://easy-care.herokuapp.com/";

const router = require("./router");

const app = express();
//app.use(cors());
const server = http.createServer(app);
const io = socketio(server, {
  handlePreflightRequest: (req, res) => {
    const headers = {
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
      "Access-Control-Allow-Origin": ENDPOINT,
      "Access-Control-Allow-Credentials": true,
    };
    res.writeHead(200, headers);
    res.end();
  },
});

// Connecting socket io...
io.on("connection", (socket) => {
  console.log("User connected");

  // Emitting if user is connected...
  socket.emit(CONNECTION_ACK, {});

  // Joining users into a room...
  socket.on(JOIN_ROOM, ({ name, room }, callback) => {
    const data = addUser({ id: socket.id, name, room });

    if (data.error) {
      return callback(data);
    }

    if (data.roomName && data.success) {
      socket.join(data.roomName);
    }
    return callback(data);
  });

  // Removing user from room...
  socket.on(LEAVE_ROOM, ({ name }, callback) => {
    const data = removeUser(name);

    if (data.error) {
      return callback(data);
    }

    if (data.roomName && data.success) {
      socket.leave(data.roomName);
    }

    socket.broadcast.to(data.roomName).emit(LEFT_ROOM, { name });

    return callback(data);
  });

  // On getting chat messages...
  socket.on(SEND_MSG, ({ msg, room }, callback) => {
    // Filtering the msg...
    msg = filterMsg(msg);
    room = room.trim().toLowerCase();

    // checking if msg is well formatted..
    if (!msg) {
      const error = "Message is not well formatted";
      return callback({ error });
    }

    // Checking if the room exists...
    if (!roomAlreadyExists(room)) {
      const error = "Room does not exists";
      return callback({ error });
    }

    socket.broadcast.to(room).emit(RCV_MSG, { msg });

    const success = "Message sent";
    return callback({ success });
  });

  // On getting connection call for video chat...
  socket.on(CONNECT_CALL, ({ id }, callback) => {
    const usernames = getUsersByName(id);
    if (!usernames) {
      return callback({ error: "Name not is room..." });
    }

    return callback({ usernames });
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

      socket.broadcast.to(roomName).emit(LEFT_ROOM, { name });
    } else {
      console.log("user left without joining a room...");
    }
  });
});

app.use(router);

// make the server running...
server.listen(PORT, () => console.log(`Server is running on port: ${PORT}`));
