const rooms = {};

// Checking if user is already in room...
const userAlreadyInRoom = (name) => {
  for (let room in rooms) {
    if (rooms[room].indexOf(name) !== -1) {
      return true;
    }
  }
  return false;
};

// Checking if room already exists...
const roomAlreadyExists = (room) => {
  for (let r in rooms) {
    if (r === room) {
      return true;
    }
  }
  return false;
};

// Filter the msg...
const filterMsg = (msg) => {
  // Filter the msg and check if it is not a malicious text...
  return msg.trim().toLowerCase();
};

// Adding users in room...
const addUser = ({ name, room }) => {
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

  // Adding user to the room...
  rooms[room].push(name);

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
    index = rooms[room].indexOf(name);
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

module.exports = {
  addUser,
  removeUser,
  getUsers,
  roomAlreadyExists,
  filterMsg,
};
