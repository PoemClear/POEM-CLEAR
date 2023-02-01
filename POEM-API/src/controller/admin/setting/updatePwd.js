const { rTime, timestamp } = require("../../../utils/timeformat");
const DB = require("../../../db");
const jwt = require("jsonwebtoken");
const config = require("../../../config");
const md5 = require("md5");



/**
 * 修改密码
 * @param req
 * @param res
 */
exports.updatePwd = async (req, res) => {
    let payload = null;
    try {
        const authorizationHeader = req.get("Authorization");
        const accessToken = authorizationHeader;
        payload = jwt.verify(accessToken, config.jwtSecret);
    } catch (error) {
        return res.status(401).json({
            code: 401,
            message: "TOKEN 已过期",
        });
    }
    const {
        passwordOld, passwordNew
    } = req.body;
    let userList = await DB(res, "sy_users", "find", "服务器错误",`id=${payload.accountId.id}`)
    if(md5(md5(passwordOld) + config.md5Str) == userList[0].pwd){
        const ret = await DB(
            res,
            "sy_users",
            "update",
            "服务器错误",
            `id='${payload.accountId.id}'`,
            {
                pwd: md5(md5(passwordNew) + config.md5Str),
                updateTime: rTime(timestamp(new Date())),
            }
        );

        if (ret.affectedRows == 1) {
            res.json({
                code: 200,
                message: "修改成功",
            });
        } else {
            res.json({
                code: 200,
                message: "修改失败",
            });
        }

    }else{
          res.json({
            code:403,
            message:"原密码输入有误"
        })
    }

};