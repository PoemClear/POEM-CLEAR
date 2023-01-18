const { rTime, timestamp } = require("../../../utils/timeformat")
const DB = require("../../../db")
const jwt = require("jsonwebtoken");
const config = require("../../../config");

/**
 * 创建轮播图
 * @param req
 * @param res
 */
exports.createBanner = async (req, res) => {
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
    const { type, image_url, link_url, orderNo, status, remark = '' } = req.body
    const bannerInfo = await DB(res, 'xcx_banner', 'find', '服务器错误', `link_url='${link_url}'`)
    if (!bannerInfo[0]) {
        const ret = await DB(res, 'xcx_banner', 'insert', '服务器错误', {
            type, image_url, link_url, status, orderNo, remark,
            createTime: rTime(timestamp(new Date())),
        })

        if (ret.affectedRows == 1) {
            res.json({
                code: 200,
                message: "添加成功"
            })
        }
    } else {
        res.json({
            code: 200,
            message: "链接已存在"
        })
    }
}

/**
 * 更新轮播图
 * @param req
 * @param res
 */
exports.updateBanner = async (req, res) => {
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
    const { id, type, image_url, link_url, orderNo, status, remark = '' } = req.body
    const ret = await DB(res, 'xcx_banner', 'update', '服务器错误', `id='${id}'`, {
        type, image_url, link_url, orderNo, status, remark,
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
exports.setBannerStatus = async (req, res) => {
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
    const { id, status } = req.body

    const ret = await DB(res, 'xcx_banner', 'update', '服务器错误', `id='${id}'`, {
        status,
        updateTime: rTime(timestamp(new Date())),
    })

    if (ret.affectedRows == 1) {
        res.json({
            code: 200,
            message: "修改成功",
            type: 'success'
        })
    } else {
        res.json({
            code: 400,
            message: "修改失败",
            type: 'success'
        })
    }
}
/**
 * 删除轮播图
 * @param req
 * @param res
 */
exports.delBanner = async (req, res) => {
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
    const { id } = req.body
    const ret = await DB(res, 'xcx_banner', 'delete', '服务器错误', `id='${id}'`)
    if (ret.affectedRows == 1) {
        res.json({
            code: 200,
            message: "删除成功"
        })
    }
}

exports.multipleDelBanner = async (req, res) => {
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
    let { ids } = req.body
    let ret = await DB(res, 'xcx_banner', 'sql', '服务器错误', `select *  from xcx_banner delete where id in ${ids}`);
    if (ret.affectedRows == 1) {
        res.json({
            code: 200,
            message: "删除成功"
        })
    }
}
/**
 * 轮播图详情
 * @param req
 * @param res
 */
exports.bannerInfo = async (req, res) => {
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
    const { id } = req.query
    const bannerInfo = await DB(res, 'xcx_banner', 'find', '服务器错误', `id='${id}'`)
    res.json({
        code: 200,
        data: { ...bannerInfo[0] }
    })
}


/**
 * 轮播图列表
 * @param req
 * @param res
 */
exports.bannerList = async (req, res) => {
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
        remark: req.query.remark || "",
        type: req.query.type || "",
        status: req.query.status || "",
        page: req.query.page || 1,
        pageSize: req.query.pageSize || 10
    }

    let bannerLen = await DB(res, 'xcx_banner', 'find', '服务器出错', `remark like '%${params.remark}%' and status like '%${params.status}%' and type like '%${params.type}%' `);
    let result = await DB(res, 'xcx_banner', 'find', '服务器出错', `remark like '%${params.remark}%' and status like '%${params.status}%' and type like '%${params.type}%' order by orderNo desc limit ${(params.page - 1) * params.pageSize},${params.pageSize}`);
    result.forEach((v) => {
        v.image_url = [v.image_url]
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
                total: bannerLen.length,
                page: params.page,
                pageSize: params.pageSize
            }

        })
    }
}