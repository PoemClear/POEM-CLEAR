const app = require('express')()
const server = require('http').createServer(app)
const bodyParser = require("body-parser")
const cors = require('cors')
const config = require('./config')
const router = require('./router')
/**使用socket.io*/
//新建websocket文件，将写好的 socket 通过require引入到启动文件
require('./websocket/ws');
// require('./websocket/index');
/**使用中间件*/
app.use(cors())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}))
app.use(router)



/**监听端口号*/
server.listen(config.port, () => {
    console.info(`Server    启动成功，运行端口：${config.port}`);
}).on("error", (err) => {
    console.log(err)
    process.exit(1);
});