// let users = [];
// function userInRoom(userObj) {
//   users.push(userObj);
//   return users;
// }
//
// function userLevelRoom(id) {
//   // let index = users.findIndex(item => item.id === id);
//   // if (index !== -1) {
//   //   users.splice(index, 1);
//   // }
//   // return users;
//   users = users.filter(item => item.id !== id);
//
//   return users;
// }
//
// function getRoomUser(room) {
//   return users.filter(item => item.room === room);
// }
//
// module.exports = {
//   userInRoom,
//   userLevelRoom,
//   getRoomUser
// };

const DB = require("../db");
const jwt = require("jsonwebtoken");
const config = require("../config");

async function getUserInfo(req, res){
  let payload = null;
  try {
    const authorizationHeader = req.get("Authorization");
    const accessToken = authorizationHeader;
    payload = jwt.verify(accessToken, config.jwtSecret);
  } catch (error) {
    return res.status(401).json({
      code: 401,
      message: "TOKEN 已过期",
    });
  }
  let userInfo = await DB(
      req,
      "sy_users",
      "find",
      "服务器错误",
      `id='${payload.accountId.id}'`
  );
  console.log(userInfo)
}
module.exports = {
  getUserInfo,
};
