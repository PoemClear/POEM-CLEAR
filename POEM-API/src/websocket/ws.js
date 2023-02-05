//1、安装ws模块 npm install ws
//2、导入ws模块
const WebSocket = require('ws');
//3、创建WebSocket服务器
const server = new WebSocket.Server({port: process.env.SocketPORT});
const { getUserInfo } = require("./utils");
const ip = require("ip");
//4、监听open事件
server.on('open', () => {
    console.log('建立连接');
})
//5、绑定close事件
server.on('close', () => {
    console.log('关闭连接')
})
//6、绑定connection事件 ws参数表示客户端 req表示客户端的请求信息
server.on('connection', (ws, req) => {
    // console.log(req)
    //6.1获取客户端的ip port
    const ip = req.connection.remoteAddress;
    const port = req.connection.remotePort;
    // console.log(req.connection.remoteAddress)
    // let userinfo = getUserInfo()
    // console.log(userinfo)
    // console.log(userInfo[0])
    // console.log(ws)
    const clientName = ip + port;
    // console.log('%s is connect', clientName);
    //6.2向客户端发送消息
    ws.send('欢迎' + clientName);
    //监听 客户端 message 事件，转发给其他人
    ws.on('message', (msg) => {
        // console.log('消息：%s 来自于 %s', msg, clientName);
        //6.3把消息广播所有客户端：clients表示所有客户端
        server.clients.forEach(function (client) {
            //若某个客户端是打开的，就把消息广播给该客户
            if (client.readyState === WebSocket.OPEN) {
                if(msg!='ping'){
                    client.send(clientName + '---------' + msg);
                }

            }
        })
    })
    ws.on("disconnect", () => {
        // 用户掉线或离开,将用户从服务器用户列表删除
        // userLevelRoom(id);
        // // 给该房间内用户推送房前房间内所有用户列表
        // socket.leave(room);
        // io.in(room).emit("getusers", getRoomUser(room));
      });
})

