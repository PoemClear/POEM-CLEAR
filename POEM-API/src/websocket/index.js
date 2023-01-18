const express = require("express");
const { Server } = require("socket.io");
const ip = require('ip')
const path = require("path");
const http = require("http");
const { userInRoom, userLevelRoom, getRoomUser } = require("./utils");
const cors = require('cors')
console.log('WebSocket')

// 实例化express应用
const app = express();
app.use(cors())
// 声明一个端口
const PORT = process.env.SERVER_PORT || 3500;

// 托管静态资源
app.use(express.static(path.join(__dirname, "public")));

// 要将socket.io挂载到服务器，需要用到原生http模块创建服务，并将请求交给express处理
const server = http.createServer(app);

// 初始化scoket.io, 这句话写上,socketio就已经把客户端挂在到服务器,
// 验证: 访问http://127.0.0.1:3000/socket.io/socket.io.js
const io = new Server(server, {});

//1. 监听连接
io.on("connection", socket => {
  console.log('是否链接')
  /* 
    进到这个回调函数,说明连接已经建立了
    并且，没个连接进来的客户端，都会有一个唯一的客户端标识ID,用来区分同名的用户，获取这个ID只需 socket.id 即可获取
  */

  var id = socket.id; // 每一个连接唯一标识

  // 2. 监听用户加入房间
  socket.on("inRoom", ({ name, room }) => {
    // 3. 将用户加入房间
    socket.join(room);
    // 4. 将加入进来的用户存起来
    userInRoom({ id, name, room });
    // 5. 广播 将该房间内用户列表推送给当前房间内所有人,注意to(room)就限了只会给当前房间内的用户推送消息
    // 这里用的是全局的io对象 io.emit而不是socket.emit来发送消息,因为socket只会发送给某个人
    io.in(room).emit("getusers", getRoomUser(room));
    // 广播 欢迎xxx进入房间
    io.in(room).emit("systemMsg", { name, room });
    // 将进入房间的用户的Id返回给用户自己
    socket.emit("ownInfo", { id, name, room });
    // 监听客户端发来的消息
    socket.on("chatMsg", msg => {
      // 将用户发来的消息广播出去(广播给房间内所有用户)
      io.in(room).emit("chatMsg", msg);
    });
    // 断开连接时候会触发（比如：客服端离开）
    socket.on("disconnect", () => {
      // 用户掉线或离开,将用户从服务器用户列表删除
      userLevelRoom(id);
      // 给该房间内用户推送房前房间内所有用户列表
      socket.leave(room);
      io.in(room).emit("getusers", getRoomUser(room));
    });
  });
});

// 监听端口
server.listen(PORT, "0.0.0.0", () => {
  console.info(`Socket.io 启动成功，运行端口：${PORT} http://${ip.address()}:${PORT}`);
});
