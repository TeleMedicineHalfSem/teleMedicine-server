const rooms = {};

// Checking if user is already in room...
const userAlreadyInRoom = (name) => {
  for (let room in rooms) {
    if (rooms[room].find((user) => user.name === name)) {
      return true;
    }
  }
  return false;
};

// Checking if room already exists...
const roomAlreadyExists = (room) => {
  for (let roomName in rooms) {
    if (roomName === room) {
      return true;
    }
  }
  return false;
};

// Filter the msg...
const filterMsg = (msg) => {
  // Filter the msg and check if it is not a malicious text...
  if (msg === null || msg === undefined || msg === "") {
    return false;
  }
  return msg.trim().toLowerCase();
};

// Adding users in room...
const addUser = ({ id, name, room }) => {
  name = name.trim().toLowerCase();
  room = room.trim().toLowerCase();

  // Checking if the room or user is null...
  const nameOrRoom =
    name === null || name === "" || room === null || room === "";

  if (nameOrRoom) {
    return { error: "User or Room field is empty" };
  }

  // Checking if the user is already in a room...
  if (userAlreadyInRoom(name)) {
    return { error: "User is already in a room" };
  }

  // Checking if there is already a room...
  if (!roomAlreadyExists(room)) {
    rooms[room] = [];
  }

  // Checking if already two users are in the room...
  const userCount = rooms[room].length;
  if (userCount >= 2) {
    return { error: "Already two users in the room." };
  }

  // Adding user to the room...
  rooms[room].push({ name, id });

  return { success: "Join a room", roomName: room };
};

// Removing the user from the room...
const removeUser = (name) => {
  name = name.trim().toLowerCase();

  // Checking if the user is already doesn't exist in the room...
  if (!userAlreadyInRoom(name)) {
    return { error: "User is not in the Room" };
  }

  // Searching for the user in rooms...
  let index = null;
  let roomName = null;
  for (let room in rooms) {
    index = rooms[room].findIndex((user) => user.name === name);
    if (index !== -1) {
      roomName = room;
      break;
    }
  }
  // Removing user from the room...
  rooms[roomName].splice(index, 1)[0];

  // Deleting the room if it is empty...
  if (rooms[roomName].length === 0) {
    delete rooms[roomName];
  }

  return { success: `${name} is removed`, roomName };
};

// Get all the users in the room...
const getUsers = () => rooms;

// Get user name from id...
const getUserById = (id) => {
  for (let room in rooms) {
    const index = rooms[room].findIndex((user) => user.id === id);
    if (index !== -1) {
      return rooms[room][index]["name"];
    }
  }
  return false;
};

// getting all users except the current user from the room by their usernames...
const getUsersByName = (name) => {
  const usernames = [];
  let roomName = null;

  // Checking if the user is not in the room...
  if (!userAlreadyInRoom(name)) {
    return false;
  }

  // Getting room name for the user...
  for (let room in rooms) {
    const userInRoom = rooms[room].find((user) => user.name === name);
    if (userInRoom) {
      roomName = room;
    }
  }

  // Filling usernames array...
  for (let i = 0; i < rooms[roomName].length; i++) {
    const username = rooms[roomName][i]["name"];
    if (username !== name) usernames.push(username);
  }

  return usernames;
};

module.exports = {
  addUser,
  removeUser,
  getUsers,
  roomAlreadyExists,
  filterMsg,
  getUserById,
  getUsersByName,
};
