const {Server} = require("socket.io");
const PORT = process.env.SERVER_PORT || 4500;
const ip = require('ip')
// var server = app.listen(PORT)

const io = new Server();
io.on("connection", (socket) => {
    console.log(`socket ${socket.id} connected`);
    // send an event to the client
    // socket.emit("foo", "bar");
    // socket.on("foobar", () => {
    //     // an event was received from the client
    // });
    // // upon disconnection
    // socket.on("disconnect", (reason) => {
    //     console.log(`socket ${socket.id} disconnected due to ${reason}`);
    // });
});
// 监听端口
io.listen(PORT, '0.0.0.0', () => {
    console.info(`Socket.io 启动成功，运行端口：${PORT} http://${ip.address()}:${PORT}`);
});
