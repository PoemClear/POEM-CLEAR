const {rTime, timestamp} = require("../../../../utils/timeformat");
const DB = require("../../../../db");
const jwt = require("jsonwebtoken");
const config = require("../../../../config");

/**
 * 创建轮播图
 * @param req
 * @param res
 */
exports.createLoading = async (req, res) => {
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
    const {type, image_url, orderNo, status, remark = ""} = req.body;

    const bannerInfo = await DB(
        res,
        "xcx_loading",
        "find",
        "服务器错误",
        `type='${type}'`
    );
    if (!bannerInfo[0]) {
        const ret = await DB(res, "xcx_loading", "insert", "服务器错误", {
            type,
            image_url,

            status,
            orderNo,
            remark,
            createTime: rTime(timestamp(new Date())),
        });

        if (ret.affectedRows == 1) {
            res.json({
                code: 200,
                message: "添加成功",
            });
        }
    } else {
        res.json({
            code: 403,
            message: "当前位置已添加，不可重复添加",
        });
    }
};

/**
 * 更新轮播图
 * @param req
 * @param res
 */
exports.updateLoading = async (req, res) => {
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
        id,
        type,
        image_url,
        orderNo,
        status,
        remark = "",
    } = req.body;
    const ret = await DB(
        res,
        "xcx_loading",
        "update",
        "服务器错误",
        `id='${id}'`,
        {
            type,
            image_url,
            orderNo,
            status,
            remark,
            updateTime: rTime(timestamp(new Date())),
        }
    );

    if (ret.affectedRows == 1) {
        console.log(ret.affectedRows)
        res.json({
            code: 200,
            message: "修改成功",
        });
    } else {
        res.json({
            code: 403,
            message: "修改失败",
        });
    }
};

/**
 * 删除轮播图
 * @param req
 * @param res
 */
exports.delLoading = async (req, res) => {
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
    const {id} = req.body;
    const ret = await DB(res, "xcx_loading", "delete", "服务器错误", `id='${id}'`);
    if (ret.affectedRows == 1) {
        res.json({
            code: 200,
            message: "删除成功",
        });
    }
};

/**
 * 轮播图列表
 * @param req
 * @param res
 */
exports.loadingList = async (req, res) => {
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
    let params = {
        remark: req.query.remark || "",
        type: req.query.type || "",
        status: req.query.status || "",
        page: req.query.page || 1,
        pageSize: req.query.pageSize || 10,
    };
    let list = await DB(res, "sy_dict", "find", "服务器出错", `value='loadingPosition' and parentId=0`);
    let cateList = []
    if (list[0]) {
        cateList = await DB(res, "sy_dict", "find", "服务器出错", `parentId=${list[0].id}`);
    }
    let bannerLen = await DB(
        res,
        "xcx_loading",
        "find",
        "服务器出错",
        ` status like '%${params.status}%' and type like '%${params.type}%' `
    );
    let result = await DB(
        res,
        "xcx_loading",
        "find",
        "服务器出错",
        ` status like '%${
            params.status
        }%' and type like '%${params.type}%' order by orderNo desc limit ${
            (params.page - 1) * params.pageSize
        },${params.pageSize}`
    );

    result.forEach((v) => {
        v.image_url = v.image_url?[v.image_url]:[]
        if (cateList[0]) {
            cateList.forEach((ele) => {
                if (ele.value == v.type) {
                    v.typeName = ele.label
                }
            })
        } else {
            v.typeName = ''
        }
        if (v.createTime) {
            v.createTime = rTime(timestamp(v.createTime));
        }
        if (v.updateTime) {
            v.updateTime = rTime(timestamp(v.updateTime));
        } else {
            delete v.updateTime;
        }
    });
    if (!result[0]) {
        res.json({
            code: 200,
            result: {
                items: [],
            },
        });
    } else {
        res.json({
            code: 200,
            result: {
                items: result,
                total: bannerLen.length,
                page: params.page,
                pageSize: params.pageSize,
            },
        });
    }
};
