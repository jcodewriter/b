const users = [];

const addUser = ({ id, name, room }) => {
  name = name.trim().toLowerCase();
  room = room.trim().toLowerCase();

  const existingUser = users.find(
    user => user.room === room && user.name === name
  );

  if (!name || !room) return { error: 'Username and room are required.' };
  if (existingUser) {
    const usersInRoom = getUsersInRoom(room)
    const index = usersInRoom.findIndex(user => user.name === name);
    usersInRoom[index].id = id;
    return { error: 'Username already exists.', user: usersInRoom };
  } 

  const user = { id, name, room };

  users.push(user);

  return { user };
};

const removeUser = id => {
  const index = users.findIndex(user => user.id === id);

  if (index !== -1) return users.splice(index, 1)[0];
};

const getUser = id => users.find(user => user.id === id);

const getPaddleUser = id => users.find(user => user.id !== id);

const getUsersInRoom = room => users.filter(user => user.room === room);

const getRooms = () => {
  const rooms = [];
  users.map((user) => {
    const data = {name : '', users: [], num: 0};
    const index = rooms.findIndex(room => room.name === user.room);
    if (index !== -1) {
      rooms[index].users.push(user.id);
      rooms[index].num = rooms[index].users.length;
    } else {
      data.name = user.room;
      data.users.push(user.id);
      data.num = data.users.length;
      rooms.push(data);
    }
  })
  return rooms;
};

module.exports = { addUser, removeUser, getUser, getPaddleUser, getUsersInRoom, getRooms };