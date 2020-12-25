const express = require("express");
const router = express.Router();
const { getUsers } = require("./userActions");

router.get("/", (req, res) => {
  res.send("Server is up and running");
});

router.get("/rooms", (req, res) => {
  const rooms = getUsers();

  res.send("Rooms are: <br/>" + JSON.stringify(rooms));
});

module.exports = router;
