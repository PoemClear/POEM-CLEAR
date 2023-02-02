const md5 = require("md5");
const config = require("../../../config");
const {
    rTime,
    timestamp,
    listMockToTree,
} = require("../../../utils/timeformat");
const DB = require("../../../db");
const jwt = require("jsonwebtoken");
const uuid = require("node-uuid");
/** 过期时间 单位：毫秒 默认 1分钟过期，方便演示 */
let expiresIn = 6000000;
/***
 * 注册|申请
 * @param req
 * @param res
 */
exports.register = async (req, res) => {
    const {
        username,
        realName,
        avatar,
        nickname = "",
        phone,
        remark = "",
        homePath = "",
        roleValue = "",
        deptId = "",
        email = "",
        pwd,
    } = req.body;
    /**判断账号是否注册*/
    let isRegister = await DB(
        res,
        "sy_users",
        "find",
        "服务器错误",
        `username='${username}' and phone='${phone}' `
    );
    if (!isRegister[0]) {
        /**如果账号未注册 去注册*/
        const ret = await DB(res, "sy_users", "insert", "服务器错误", {
            avatar: avatar
                ? avatar
                : "https://sy0415-1300507222.cos.ap-beijing.myqcloud.com/.gif",
            account: username,
            email,
            username,
            phone,
            realName,
            avatar,
            pwd: md5(md5(pwd) + config.md5Str),
            nickname,
            remark,
            homePath,
            roleValue,
            deptId,
            password: md5(md5(phone) + config.md5Str),
            createTime: rTime(timestamp(new Date())),
        });
        if (ret.affectedRows == 1) {
            res.json({
                code: 200,
                message: "已申请",
            });
        }
    } else {
        /**提示账号已注册*/
        res.json({
            code: 403,
            message: "账号已注册",
        });
    }
};

/**
 * 登录
 * @param req
 * @param res
 * @returns {Promise<*>}
 */
exports.login = async (req, res) => {
    const {username, account, password} = req.body;

    let userInfo = await DB(
        res,
        "sy_users",
        "find",
        "服务器错误",
        `username='${username}'  or account='${account}' `
    );
    // let roleInfo = await DB(res, 'sy_roles', 'find', '服务器错误', )
    if (!userInfo[0]) {
        return res.json({
            code: 403,
            message: "账号不存在",
        });
    }
    /** 首先判断用户pwd为空 如果为空的话 就用手机号作为密码登录*/
    if (!userInfo[0].pwd) {
        if (md5(md5(password) + config.md5Str) != userInfo[0].password) {
            return res.json({code: 403, message: "密码输入有误"});
        }
    } else {
        if (md5(md5(password) + config.md5Str) != userInfo[0].pwd) {
            return res.json({code: 403, message: "密码输入有误"});
        }
    }


    if (userInfo[0].status == 0) {
        res.json({
            success: false,
            code: 403,
            message: "账号未激活",
        });
        return;
    }
    const token = jwt.sign(
        {
            accountId: userInfo[0],
        },
        config.jwtSecret,
        {expiresIn: expiresIn}
    );
    await DB(
        res,
        "sy_users",
        "update",
        "服务器错误",
        `username='${username}'  or account='${username}' `,
        {
            lastLoginTime: timestamp(new Date()),
        }
    );
    res.json({
        code: 200,
        message: "登录成功",
        result: {
            token,
            userId: userInfo[0].id,
            username: userInfo[0].username,
            avatar: userInfo[0].avatar, // 这里模拟角色，根据自己需求修改
            roles: userInfo[0].roles, // 这里模拟刷新token，根据自己需求修改
        },
    });
};

/**
 * 用户信息
 * @param req
 * @param res
 * @returns {Promise<*>}
 */
exports.userInfo = async (req, res) => {
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
    let roleList = await DB(res, "sy_roles", "find", "服务器错误");
    let userInfo = await DB(
        res,
        "sy_users",
        "find",
        "服务器错误",
        `id='${payload.accountId.id}'`
    );
    let deptList = await DB(res, "sy_depts", "find", "服务器错误");
    userInfo.forEach((v) => {
        v.phone =  v.phone.substr(0,3) + "****" + v.phone.substr(7)
        delete v.password;
        if (v.createTime) {
            v.createTime = rTime(timestamp(v.createTime));
        }
        if (v.updateTime) {
            v.updateTime = rTime(timestamp(v.updateTime));
        } else {
            delete v.updateTime;
        }
        if (v.lastLoginTime) {
            v.lastLoginTime = rTime(timestamp(v.lastLoginTime));
        }
        // delete v.roleValue;
        roleList.forEach((ele) => {
            if (v.roleValue == ele.roleValue) {
                v.roleName = ele.roleName;
            }
        });
        deptList.forEach((ele) => {
            if (v.deptId == ele.id) {
                v.deptName = ele.deptName;
            }
        });
        v.userId = v.id;
        v.token = req.get("Authorization");
    });
    res.json({
        code: 200,
        type: "success",
        message: "ok",
        result: userInfo[0],
    });
};

/**
 * 退出登录
 * @param req
 * @param res
 */
exports.logout = (req, res) => {
    res.json({
        code: 200,
        type: "success",
        message: "ok",
    });
};
/***
 * 权限标识
 * @param req
 * @param res
 */
exports.getPermCode = async (req, res) => {
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
    let userInfo = await DB(
        res,
        "sy_users",
        "find",
        "服务器错误",
        `id='${payload.accountId.id}'`
    );
    let roleInfo = await DB(
        res,
        "sy_roles",
        "find",
        "服务器错误",
        `roleValue='${userInfo[0].roleValue}'`
    );
    let permissionMenuInfo = await DB(
        res,
        "sy_permission_menu",
        "find",
        "服务器错误",
        `roleValue='${roleInfo[0].roleValue}'`
    );
    let result = await DB(
        res,
        "sy_menus",
        "find",
        "服务器出错",
        `status='1'  order by orderNo desc`
    );
    let permission = permissionMenuInfo[0].permission;
    let list = result.filter((item) => permission.includes(item.permission));
    let data = [];
    list.forEach((v) => {
        if (v.permission) {
            data.push(v.permission);
        }
    });

    if (!data[0]) {
        res.json({
            code: 200,
            result: data,
        });
    } else {
        res.json({
            code: 200,
            message: "ok",
            type: "success",
            result: data,
        });
    }
};
