const users = [];

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
  const userAlreadyInRoom = users.find((user) => user.name === name);

  if (userAlreadyInRoom) {
    return { error: "User is already in a room" };
  }

  //TODO: Have to implement more error cases here...

  // Adding user to the user array...
  const user = { name, room };
  users.push(user);

  return { success: "Join a room", user };
};

const removeUser = (name) => {
  const index = users.findIndex((user) => user.name === name);

  // Removing user from the array...
  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
};

const getUser = (name) => users.find((user) => user.name === name);

const getUsers = () => users;

const getUsersInRoom = (room) => users.filter((user) => user.room === room);

module.exports = { addUser, removeUser, getUser, getUsersInRoom, getUsers };
