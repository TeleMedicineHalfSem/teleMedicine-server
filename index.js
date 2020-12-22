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

  // Disconnecting socket..
  socket.on("disconnect", () => {
    console.log("user left");
  });
});

app.use(router);

// make the server running...
server.listen(PORT, () => console.log(`Server is running on port: ${PORT}`));
