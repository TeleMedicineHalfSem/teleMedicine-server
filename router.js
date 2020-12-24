const express = require("express");
const router = express.Router();
const { getUsers } = require("./users");

router.get("/", (req, res) => {
  res.send("Server is up and running");
});

router.get("/users", (req, res) => {
  const users = getUsers();

  res.send("Users are: <br/>" + JSON.stringify(users));
});

module.exports = router;
