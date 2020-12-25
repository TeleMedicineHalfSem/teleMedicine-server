const express = require("express");
const router = express.Router();
const { getUsers } = require("./userActions");

router.get("/", (req, res) => {
  res.send("Server is up and running");
});

router.get("/rooms", (req, res) => {
  const rooms = getUsers();
  res.header("Content-Type", "application/json");
  res.send(`Rooms are: \n${JSON.stringify(rooms, null, 4)}`);
});

module.exports = router;
