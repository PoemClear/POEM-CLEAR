const { rTime, timestamp } = require("../../../utils/timeformat")
const DB = require("../../../db")
const jwt = require("jsonwebtoken")
const config = require("../../../config");



exports.postList = async (req, res) => {
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
        status: req.query.status || "",
        isRecycle:req.query.isRecycle || "1",
        title: req.query.title || "",
        page: req.query.page || 1,
        pageSize: req.query.pageSize || 10
    }

    let result_num = await DB(res, 'xcx_blog_post', 'find', '服务器错误', `title like '%${params.title}%' and isRecycle like '%${params.isRecycle}%' and status like '%${params.status}%'`);


    let result = await DB(res, 'xcx_blog_post', 'find', '服务器错误', `title like '%${params.title}%' and isRecycle like '%${params.isRecycle}%' and status like '%${params.status}%'   order by orderNo desc  limit ${(params.page - 1) * params.pageSize},${params.pageSize}`);
    result.forEach((v, i) => {
        if (v.createTime) {
            v.createTime = rTime(timestamp(v.createTime))
        }
        if (v.updateTime) {
            v.updateTime = rTime(timestamp(v.updateTime))
        } else {
            delete v.updateTime
        }
    })

    if (!result[0]) {
        res.json({
            code: 200,
            result: {
                items: []
            }
        })
    } else {
        res.json({
            code: 200,
            result: {
                items: result,
                total: result_num.length,
                page: Number(params.page),
                pageSize: Number(params.pageSize)
            }

        })
    }
}



exports.postItem = async (req, res) => {
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
    let { id } = req.query

    let result = await DB(res, 'xcx_blog_post', 'find', '服务器错误', `id='${id}'`);


    result.forEach((v) => {
        if (v.createTime) {
            v.createTime = rTime(timestamp(v.createTime))
        }
        if (v.updateTime) {
            v.updateTime = rTime(timestamp(v.updateTime))
        } else {
            delete v.updateTime
        }

    })
    if (!result[0]) {
        res.json({
            code: 200,
            message: 'ok',
            type:"success",
            result: {
                items: {}
            }
        })
    } else {
        res.json({
            code: 200,
            type:"success",
            message: 'ok',
            result: {
                items: result[0],
            }

        })
    }
}


/**
 * 删除分类
 * @param req
 * @param res
 */
exports.upDatePostRecycle = async (req, res) => {
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
    const {id,isRecycle} = req.body
    const ret = await DB(res, 'xcx_blog_post', 'update', '服务器错误', `id='${id}'`, {
        isRecycle,
        updateTime: rTime(timestamp(new Date())),
    })

    if (ret.affectedRows == 1) {
        res.json({
            code: 200,
            message: "删除成功"
        })
    } else {
        res.json({
            code: 200,
            message: "修改失败"
        })
    }
}

exports.delPost = async (req, res) => {
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
    const ret = await DB(res, 'xcx_blog_post', 'delete', '服务器错误', `id='${id}'`)

    if (ret.affectedRows == 1) {
        res.json({
            code: 200,
            message: "删除成功"
        })
    } else {
        res.json({
            code: 200,
            message: "修改失败"
        })
    }
}