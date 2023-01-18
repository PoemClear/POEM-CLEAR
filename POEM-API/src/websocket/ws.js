
const app = require("express")()
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const ip = require('ip')
const host = '127.0.0.1',
    port = 3500;

io.on('connection', socket => {
	console.log('恭喜你连接成功！')
	// socket.on("message",(msg)=>{
	// 	console.log(msg)  //你好 后台
	// 	//注意 ： 这里的 io.emit() 是默认转发给全部客户端信息，所有客户端都可以收到
	// 	io.emit("allMsg","广播 : 欢迎来到聊天室")
	// })
});
server.listen(port, host, () => {
    console.info(`Socket.io 启动成功，运行端口：${port} http://${ip.address()}:${port}`);
});

