
const {rTime, timestamp} = require("../../../utils/timeformat")
const DB = require("../../../db")
const {message, code} = require("../../../utils/message")
const jwt = require("jsonwebtoken");
const config = require("../../../config");

exports.list = async (req, res) => {
    let payload = null;
    try {
        const authorizationHeader = req.get("Authorization");
        const accessToken = authorizationHeader
        payload = jwt.verify(accessToken, config.jwtSecret);
    } catch (error) {
        return res.status(401).json({
            code: 401, message: "TOKEN 已过期"
        });
    }

    let params = {
        // type: req.query.type ? req.query.type + "" : "",
        status: req.query.status ? req.query.status  : 1,
        page: req.query.currentPage ? Number(req.query.currentPage) : 1,
        pageSize: req.query.pageSize ? Number(req.query.pageSize) : 10
    }

    let result = await DB(res, 'xcx_banner', 'find', message[0],`status=${params.status}`);
    // let result = await DB(res, 'xcx_banner', 'find',  message[0], `status like '%${params.status}%' limit ${(params.page - 1) * params.pageSize},${params.pageSize}`);
    // result.forEach((v, i) => {
    //     if(!v.updateTime){
    //        delete v.updateTime
    //     }else{
    //         v.updateTime = rTime(timestamp(v.updateTime))
    //     }
    //     if(v.createTime){
    //         v.createTime = rTime(timestamp(v.createTime))
    //     }
    // })
    let data = Object.values(result.reduce((res, item) => {
        if (!item.updateTime) {
            delete item.updateTime
        } else {
            item.updateTime = rTime(timestamp(item.updateTime))
        }
        if (item.createTime) {
            item.createTime = rTime(timestamp(item.createTime))
        }
        res[item.type] ? res[item.type].push(item) : res[item.type] = [item];

        return res

    }, {}));
    if (!data[0]) {
        res.json({
            code: code[0],
            data: {
                list: []
            }
        })
    } else {

        res.json({
            code: code[0],
            data: {
                list: data
            }

        })
    }

}