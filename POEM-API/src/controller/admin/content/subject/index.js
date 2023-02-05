const {rTime, timestamp} = require("../../../../utils/timeformat");
const DB = require("../../../../db");
const jwt = require("jsonwebtoken");
const config = require("../../../../config");
/**
 * 添加专栏
 * @param req
 * @param res
 * @returns {Promise<*>}
 */
exports.createSubject = async (req, res) => {
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
        userId,
        title,
        cover,
        description = "",
        postIds='',
        subjectCateId = "1",
        subjectlabelId = "2",
        isEnd,
        status,
        openComment,
        isTop,
        isRecycle = "1",
    } = req.body;
    const deptInfo = await DB(
        res,
        "xcx_blog_subject",
        "find",
        "服务器错误",
        `title='${title}'`
    );
    if (!deptInfo[0]) {
        const ret = await DB(res, "xcx_blog_subject", "insert", "服务器错误", {
            userId,
            title,
            cover,
            description,
            postIds,
            subjectCateId,
            subjectlabelId,
            isEnd,
            status,
            openComment,
            isTop,
            isRecycle,
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
            code: 200,
            message: "专题已存在",
        });
    }
};
/**
 * 更新专栏
 * @param req
 * @param res
 * @returns {Promise<*>}
 */
exports.updateSubject = async (req, res) => {
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
        title,
        cover,
        description = "",
        postIds='',
        isEnd,
        openComment,
        isTop,
        status,
    } = req.body;
    if (payload.accountId.roleValue == 'systemAdmin') {
        const ret = await DB(
            res,
            "xcx_blog_subject",
            "update",
            "服务器错误",
            `id='${id}'`,
            {
                title,
                cover,
                description,
                postIds,
                isEnd,
                status,
                openComment,
                isTop,
                updateTime: rTime(timestamp(new Date())),
            }
        );

        if (ret.affectedRows == 1) {
            res.json({
                code: 200,
                message: "编辑成功",
            });
        } else {
            res.json({
                code: 200,
                message: "专题已存在",
            });
        }
        return
    }
    const ret = await DB(
        res,
        "xcx_blog_subject",
        "update",
        "服务器错误",
        `userId=${payload.accountId.id} and id=${id}`,
        {
            title,
            cover,
            description,
            postIds,
            isEnd,
            openComment,
            isTop,
            status,
            updateTime: rTime(timestamp(new Date())),
        }
    );

    if (ret.affectedRows == 1) {
        res.json({
            code: 200,
            message: "编辑成功",
        });
    } else {
        res.json({
            code: 200,
            message: "专题已存在",
        });
    }
};
/**
 * 专栏列表
 * @param req
 * @param res
 * @returns {Promise<*>}
 */
exports.subjectList = async (req, res) => {
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
        status: req.query.status || "",
        isRecycle: req.query.isRecycle || "1",
        title: req.query.title || "",
        checkStatus: req.query.checkStatus || "",
        page: req.query.page || 1,
        pageSize: req.query.pageSize || 10,
    };
    let userList = await DB(
        res,
        "sy_users",
        "find",
        "服务器错误",
    );
    if (payload.accountId.roleValue == 'systemAdmin') {

        let result_num = await DB(
            res,
            "xcx_blog_subject",
            "find",
            "服务器错误",
            `title like '%${params.title}%' and isRecycle like '%${params.isRecycle}%' and status like '%${params.status}%' and checkStatus like '%${params.checkStatus}%'`
        );

        let result = await DB(
            res,
            "xcx_blog_subject",
            "find",
            "服务器错误",
            `title like '%${params.title}%' and isRecycle like '%${
                params.isRecycle
            }%' and status like '%${params.status}%' and  checkStatus like '%${
                params.checkStatus
            }%'  order by id desc  limit ${(params.page - 1) * params.pageSize},${
                params.pageSize
            }`
        );
        result.forEach((v, i) => {
            v.postIds =v.postIds? v.postIds.split(",").map(Number):[]
            v.subjectIds = v.subjectIds?v.subjectIds.split(",").map(Number):[]
            v.num = v.postIds.length;
            v.cover = [v.cover];
            userList.forEach((ele) => {
                if (v.userId == ele.id) {
                    v.author = {
                        username: ele.nickname,
                        avatar: ele.avatar
                    }
                }
            })
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
                    total: result_num.length,
                    page: Number(params.page),
                    pageSize: Number(params.pageSize),
                },
            });
        }
        return
    }
    let result_num = await DB(
        res,
        "xcx_blog_subject",
        "find",
        "服务器错误",
        ` userId=${payload.accountId.id} and title like '%${params.title}%' and isRecycle like '%${params.isRecycle}%' and status like '%${params.status}%' and checkStatus like '%${params.checkStatus}%'`
    );

    let result = await DB(
        res,
        "xcx_blog_subject",
        "find",
        "服务器错误",
        `userId=${payload.accountId.id} and  title like '%${params.title}%' and isRecycle like '%${
            params.isRecycle
        }%' and status like '%${params.status}%' and  checkStatus like '%${
            params.checkStatus
        }%'  order by id desc  limit ${(params.page - 1) * params.pageSize},${
            params.pageSize
        }`
    );
    result.forEach((v, i) => {
        v.postIds =v.postIds? v.postIds.split(",").map(Number):[]
        v.subjectIds =v.subjectIds? v.subjectIds.split(",").map(Number):[]
        v.num = v.postIds.length;
        v.cover = [v.cover];
        userList.forEach((ele) => {
            if (v.userId == ele.id) {
                v.author = {
                    username: ele.nickname,
                    avatar: ele.avatar
                }
            }
        })
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
                total: result_num.length,
                page: Number(params.page),
                pageSize: Number(params.pageSize),
            },
        });
    }
};
/**
 * 远程搜索专栏列表
 * @param req
 * @param res
 * @returns {Promise<*>}
 */
exports.subjectSelectList = async (req, res) => {
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
        status: req.query.status || "",
        isRecycle: req.query.isRecycle || "1",
        title: req.query.title || "",
        page: req.query.page || 1,
        pageSize: req.query.pageSize || 10000,
    };

    let result_num = await DB(
        res,
        "xcx_blog_subject",
        "find",
        "服务器错误",
        `userId=${payload.accountId.id}   and title like '%${params.title}%' and isRecycle like '%${params.isRecycle}%' and status like '%${params.status}%' `
    );

    let result = await DB(
        res,
        "xcx_blog_subject",
        "find",
        "服务器错误",
        `userId=${payload.accountId.id}  and title like '%${params.title}%' and isRecycle like '%${params.isRecycle
        }%' and status like '%${params.status}%'  order by orderNo desc  limit ${(params.page - 1) * params.pageSize},${params.pageSize
        }`
    );

    result.forEach((v, i) => {
        v.cover = v.cover ? [v.cover] : '';
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
                total: result_num.length,
                page: Number(params.page),
                pageSize: Number(params.pageSize),
            },
        });
    }
};
/**
 * 专栏详情
 * @param req
 * @param res
 * @returns {Promise<*>}
 */
exports.subjectItem = async (req, res) => {
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
    let {id} = req.query;

    let result = await DB(
        res,
        "xcx_blog_subject",
        "find",
        "服务器错误",
        `id='${id}'`
    );
    let userList = await DB(
        res,
        "sy_users",
        "find",
        "服务器错误",
    );
    let postList = await DB(res, "xcx_blog_post", "find", "服务器错误",`isRecycle=1`);
    let checkedIds = result[0].postIds.split(",").map(Number);
    let arr = postList.filter((item) => checkedIds.includes(item.id));
    if(arr[0]){
        arr.forEach((v)=>{
            v.label_title = v.label_title ? v.label_title.split(',') : [];

            v.cateId = v.cateId? v.cateId.split(',').map(Number):[]
        })
    }

    arr.sort((a, b) => b.orderNo - a.orderNo)
    result.forEach((v) => {
        console.log(v.postIds)
        if(v.postIds){
            v.postIds = v.postIds.split(",").map(Number);
            v.children = arr;
        }else{
            v.postIds = []
        }


        v.num = arr.length;
        if (v.createTime) {
            v.createTime = rTime(timestamp(v.createTime));
        }
        if (v.updateTime) {
            v.updateTime = rTime(timestamp(v.updateTime));
        } else {
            delete v.updateTime;
        }
        userList.forEach((ele) => {
            if (v.userId == ele.id) {
                v.author = ele.nickname
                v.avatar = ele.avatar

            }
        })
    });
    if (!result[0]) {
        res.json({
            code: 200,
            message: "ok",
            type: "success",
            result: {
                items: {},
            },
        });
    } else {
        res.json({
            code: 200,
            type: "success",
            message: "ok",
            result: {
                items: result[0],
            },
        });
    }
};

/**
 * 专栏放入回收站 恢复
 * @param req
 * @param res
 */
exports.upDateSubjectRecycle = async (req, res) => {
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
    const {id, isRecycle} = req.body;
    const ret = await DB(
        res,
        "xcx_blog_subject",
        "update",
        "服务器错误",
        `id='${id}'`,
        {
            isRecycle,
            updateTime: rTime(timestamp(new Date())),
        }
    );

    if (ret.affectedRows == 1) {
        res.json({
            code: 200,
            message:isRecycle==1? "已还原":'已删除',
        });
    } else {
        res.json({
            code: 403,
            message: "修改失败",
        });
    }
};

/**
 * 审核专栏 0 审核中 1 审核失败 2 审核成功 【弃用】
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
exports.updateCheckSubject = async (req, res) => {
    const {id, checkStatus} = req.body;
    const ret = await DB(
        res,
        "xcx_blog_subject",
        "update",
        "服务器错误",
        `id='${id}'`,
        {
            checkStatus,
        }
    );
    if (ret.affectedRows == 1) {
        res.json({
            code: 200,
            message: "审核成功",
        });
    } else {
        res.json({
            code: 200,
            message: "审核失败",
        });
    }
};

/**
 * 删除专栏
 * @param req
 * @param res
 * @returns {Promise<*>}
 */
exports.delSubjectPost = async (req, res) => {
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
    const ret = await DB(
        res,
        "xcx_blog_subject",
        "delete",
        "服务器错误",
        `id='${id}'`
    );

    if (ret.affectedRows == 1) {
        res.json({
            code: 200,
            message: "删除成功",
        });
    } else {
        res.json({
            code: 200,
            message: "修改失败",
        });
    }
};
