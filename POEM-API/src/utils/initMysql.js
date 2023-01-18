const mysql = require('mysql2');
const config = require("../config")
let mysqlConfig = {
    host: config.mysql.hp.host,
    charset: config.mysql.charset,
    user: config.mysql.user,
    password: config.mysql.hp.password,
}
const connection = mysql.createConnection(
    Object.assign({database: config.mysql.database}, mysqlConfig)
);


function queryTable(s) {
    connection.query(s, (err) => {
        // ${s}
        err ? console.log(err) : "";
    });
}

module.exports = {
    queryTable
}