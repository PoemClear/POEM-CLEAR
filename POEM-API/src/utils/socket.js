// 引入nodejs-websocket
const ws = require('nodejs-websocket');
const ip = require('ip')
// 定义监听的host地址跟port端口
const host = '127.0.0.1',
    port = 3500;

var userList = new Map();
var connList = new Map();
// 创建ws服务
ws.createServer((conn) => {
    // const data = ['日照香炉生紫烟，遥看瀑布挂前川。飞流直下三千尺，疑是银河落九天。', '清明时节雨纷纷，路上行人欲断魂。借问酒家何处有？牧童遥指杏花村。', '春种一粒粟，秋收万颗子。四海无闲田，农夫犹饿死。'];
  
    // socket.on('text', function (userId) {
    //     socket.sendText(data[0]);
    // });
    console.log("New connection")
    conn.on("binary", function (inStream) {
        // Empty buffer for collecting binary data
        var data = Buffer.alloc(0)
        // Read chunks of binary data and add to the buffer
        inStream.on("readable", function () {
            var newData = inStream.read()
            if (newData)
                data = Buffer.concat([data, newData], data.length+newData.length)
        })
        inStream.on("end", function () {
            console.log("Received " + data.length + " bytes of binary data")
            process_my_data(data)
        })
    })
    conn.on("close", function (code, reason) {
        console.log("Connection closed")
    })
}).listen(port, host, () => {
    console.info(`Socket.io 启动成功，运行端口：${port} http://${ip.address()}:${port}`);
});
