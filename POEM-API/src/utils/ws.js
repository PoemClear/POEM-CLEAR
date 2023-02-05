module.exports = function (io){
    var socketList ={};
    var member = 0;
    io.sockets.on('connection',function (){
        console.log('链接成功')
    })
}