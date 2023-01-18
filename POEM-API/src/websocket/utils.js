let users = [];
function userInRoom(userObj) {
  users.push(userObj);
  return users;
}

function userLevelRoom(id) {
  // let index = users.findIndex(item => item.id === id);
  // if (index !== -1) {
  //   users.splice(index, 1);
  // }
  // return users;
  users = users.filter(item => item.id !== id);

  return users;
}

function getRoomUser(room) {
  return users.filter(item => item.room === room);
}

module.exports = {
  userInRoom,
  userLevelRoom,
  getRoomUser
};
