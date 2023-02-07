
const { createServer } = require("http");
const { Server } = require("socket.io");

const httpServer = createServer(require("express")());

const io = new Server(httpServer, {
    cors: {                 //解决跨域问题
        origin: "*",
        methods: ["GET", "POST"]
    }
});
io.on("connection", (socket) => {
    console.log(socket)
});

httpServer.listen(process.env.SocketPORT, () => {
    console.log(`${process.env.SocketPORT}`)
});