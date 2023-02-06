const {rTime, timestamp} = require("../../../../utils/timeformat")
const DB = require("../../../../db")
const md5 = require("md5");
const config = require("../../../../config");
const jwt = require("jsonwebtoken");
var https = require('https');
/**
 * 创建用户
 * @param req
 * @param res
 */
exports.createUser = async (req, res) => {
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
    const {
        username,
        realName,
        pwd,
        avatar = '',
        nickname = '',
        phone,
        remark = '',
        homePath = '',
        roleValue,
        deptId,
        status,
        email = ''
    } = req.body
    /**判断账号是否注册*/
    let isRegister = await DB(res, 'sy_users', 'find', '服务器错误', `username='${username}' and phone='${phone}' `)
    if (!isRegister[0]) {
        /**如果账号未注册 去注册*/
        const ret = await DB(res, 'sy_users', 'insert', '服务器错误', {
            avatar,
            account: username,
            email,
            username, phone, realName, avatar, nickname, remark, homePath, roleValue, deptId, status,
            password: md5(md5(phone) + config.md5Str),
            pwd: md5(md5(pwd) + config.md5Str),
            createTime: rTime(timestamp(new Date())),
        })
        if (ret.affectedRows == 1) {
            res.json({
                code: 200, message: "已申请"
            })
        }

    } else {
        /**提示账号已注册*/
        res.json({
            code: 403, message: "账号已注册"
        })
    }
}

/**
 * 更新用户
 * @param req
 * @param res
 */
exports.updateUser = async (req, res) => {
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
    const {
        id,
        username,
        realName,
        nickname = '',
        avatar = '',
        phone,
        remark,
        homePath = '',
        roleValue,
        deptId,
        status,
        email = ''
    } = req.body
    const ret = await DB(res, 'sy_users', 'update', '服务器错误', `id='${id}'`, {
        username,
        realName,
        nickname,
        avatar,
        phone,
        remark,
        homePath,
        roleValue,
        deptId,
        email,
        account: username,
        status,
        updateTime: rTime(timestamp(new Date())),
    })

    if (ret.affectedRows == 1) {
        res.json({
            code: 200,
            message: "修改成功"
        })
    } else {
        res.json({
            code: 403,
            message: "修改失败"
        })
    }
}

exports.accountExist = async (req, res) => {
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
    const {account} = req.body
    const userInfo = await DB(res, 'sy_users', 'find', '服务器错误', `account='${account}'`)
    if (userInfo[0]) {
        res.json({
            code: 400,
            message: `${account} 已注册`,
            result: `${account} 已注册`,
            type: "success"
        })
    } else {
        res.json({
            code: 200,
            message: `${account} 可以注册`,
            result: `${account} 可以注册`,
            type: "success"
        })
    }
}
/**
 * 删除用户
 * @param req
 * @param res
 */
exports.delUser = async (req, res) => {
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
    const {id} = req.body
    const ret = await DB(res, 'sy_users', 'delete', '服务器错误', `id='${id}'`)
    if (ret.affectedRows == 1) {
        res.json({
            code: 200,
            message: "删除成功"
        })
    }
}

/**
 * 用户详情
 * @param req
 * @param res
 */
exports.userInfo = async (req, res) => {
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
    const {id} = req.query
    const bannerInfo = await DB(res, 'sy_users', 'find', '服务器错误', `ID='${id}'`)
    bannerInfo.forEach((ele) => {
        ele.base64 = 'data:image/png;base64,' + ele.base64
    })
    res.json({
        code: 200,
        data: {...bannerInfo[0]}
    })
}

/**
 * 用户列表
 * @param req
 * @param res
 */
exports.getAccountList = async (req, res) => {
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
        username: req.query.username || "",
        deptId: req.query.deptId || "",
        status: req.query.status || "",
        page: req.query.currentPage || 1,
        pageSize: req.query.pageSize || 10
    }
    const roleInfo = await DB(res, 'sy_roles', 'find', '服务器错误',)
    let usersLen = await DB(res, 'sy_users', 'find', '服务器出错', `status like '%${params.status}%' and username like '%${params.username}%' and deptId like '%${params.deptId}%' `);
    let result = await DB(res, 'sy_users', 'find', '服务器出错', `status like '%${params.status}%' and username like '%${params.username}%' and deptId like '%${params.deptId}%'  order by id desc limit ${(params.page - 1) * params.pageSize},${params.pageSize}`);
    result.forEach((v) => {
        v.avatar = v.avatar == '' ? null : [v.avatar]
        v.pwd = '***'
        if (v.createTime) {
            v.createTime = rTime(timestamp(v.createTime))
        }
        if (v.updateTime) {
            v.updateTime = rTime(timestamp(v.updateTime))
        } else {
            delete v.updateTime
        }
        if (v.lastLoginTime) {
            v.lastLoginTime = rTime(timestamp(v.lastLoginTime))
        } else {
            delete v.lastLoginTime
        }
        roleInfo.forEach((ele) => {
            if (v.roleValue == ele.roleValue) {
                v.role = ele.roleName
            }
        })
    })
    if (!result[0]) {
        res.json({
            code: 200,
            result: {
                items: result,
            }
        })
    } else {

        res.json({
            code: 200,
            result: {
                items: result,
                total: usersLen.length,
                page: params.page,
                pageSize: params.pageSize
            }

        })
    }
}

/***
 * 修改信息
 * @param req
 * @param res
 * @returns {Promise<*>}
 */
exports.updateUserInfo = async (req, res) => {
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

    const {
        nickname,
        avatar = payload.accountId.avatar,
        remark,
        email
    } = req.body


    let ret =    await DB(res, 'sy_users', 'update', '服务器错误', `id='${payload.accountId.id}'`, {
        nickname,
        avatar,
        remark,
        email
    })

    const reslut = await DB(res, 'sy_users', 'find', '服务器错误', `id='${payload.accountId.id}'`)
    https.get(reslut[0].avatar, function (res) {
        var chunks = []; //用于保存网络请求不断加载传输的缓冲数据
        var size = 0;　　 //保存缓冲数据的总长度
        res.on('data', function (chunk) {
            chunks.push(chunk);　 //在进行网络请求时，会不断接收到数据(数据不是一次性获取到的)，
            size += chunk.length;　　//累加缓冲数据的长度
        });

        res.on('end', async function (err) {
            var data = Buffer.concat(chunks, size);　　//Buffer.concat将chunks数组中的缓冲数据拼接起来，返回一个新的Buffer对象赋值给data
            // console.log(Buffer.isBuffer(data));　　　　//可通过Buffer.isBuffer()方法判断变量是否为一个Buffer对象
             base64Img = data.toString('base64');　　//将Buffer对象转换为字符串并以base64编码格式显示
            await DB(res, 'sy_users', 'update', '服务器错误', `id='${payload.accountId.id}'`, {
                base64: base64Img,
            })
        });

    });


    const rst = await DB(res, 'sy_users', 'find', '服务器错误', `id='${payload.accountId.id}'`)
    if (ret.affectedRows == 1) {

        res.json({
            code: 200,
            message: "更新成功",
            result: rst[0]
        })
    } else {
        res.json({
            code: 403,
            message: "修改失败"
        })
    }
}