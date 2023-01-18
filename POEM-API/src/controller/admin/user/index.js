const {rTime, timestamp} = require("../../../utils/timeformat")
const DB = require("../../../db")
const md5 = require("md5");
const config = require("../../../config");
const jwt = require("jsonwebtoken");

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
    const {username, realName, avatar,nickname='', phone, remark = '', homePath = '', roleValue,deptId, email = ''} = req.body
    /**判断账号是否注册*/
    let isRegister = await DB(res, 'sy_users', 'find', '服务器错误', `username='${username}' and phone='${phone}' `)
    if (!isRegister[0]) {
        /**如果账号未注册 去注册*/
        const ret = await DB(res, 'sy_users', 'insert', '服务器错误', {
            avatar: avatar ? avatar : "https://sy0415-1300507222.cos.ap-beijing.myqcloud.com/.gif",
            account: username,
            email,
            username, phone, realName, avatar,nickname, remark, homePath, roleValue,deptId,
            password: md5(md5(phone) + config.md5Str),
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
            code: 200, message: "账号已注册"
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
    const {id,username, realName,nickname='', phone, remark, homePath='', roleValue,deptId, email = ''} = req.body
    const ret = await DB(res, 'sy_users', 'update', '服务器错误', `id='${id}'`, {
        username, realName,nickname, phone, remark, homePath, roleValue,deptId, email,
        updateTime: rTime(timestamp(new Date())),
    })

    if (ret.affectedRows == 1) {
        res.json({
            code: 200,
            message: "修改成功"
        })
    } else {
        res.json({
            code: 200,
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
            result:`${account} 已注册`,
            type: "success"
        })
    }else{
        res.json({
            code: 200,
            message: `${account} 可以注册`,
            result:`${account} 可以注册`,
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
            msg: "删除成功"
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
        deptId:req.query.deptId || "",
        status: req.query.status || "",
        page: req.query.currentPage || 1,
        pageSize: req.query.pageSize || 10
    }
    const roleInfo = await DB(res, 'sy_roles', 'find', '服务器错误', )
    let usersLen = await DB(res, 'sy_users', 'find', '服务器出错', `status like '%${params.status}%' and username like '%${params.username}%' and deptId like '%${params.deptId}%' `);
    let result = await DB(res, 'sy_users', 'find', '服务器出错', `status like '%${params.status}%' and username like '%${params.username}%' and deptId like '%${params.deptId}%'  order by id desc limit ${(params.page - 1) * params.pageSize},${params.pageSize}`);
    result.forEach((v) => {
        if (v.createTime) {
            v.createTime = rTime(timestamp(v.createTime))
        }
        if (v.updateTime) {
            v.updateTime = rTime(timestamp(v.updateTime))
        } else {
            delete v.updateTime
        }
        roleInfo.forEach((ele)=>{
            if(v.roleValue==ele.roleValue){
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