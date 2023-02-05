const {rTime, timestamp} = require("../../../utils/timeformat");
const DB = require("../../../db");
const jwt = require("jsonwebtoken");
const config = require("../../../config");

/**
 * 创建轮播图
 * @param req
 * @param res
 */
exports.createNotice = async (req, res) => {
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
    const {title, type, switchTab, link_url, noticeStatus, orderNo, status} =
        req.body;
    const NoticeInfo = await DB(
        res,
        "xcx_notice",
        "find",
        "服务器错误",
        `link_url='${link_url}'`
    );
    const userList = await DB(
        res,
        "sy_users",
        "find",
        "服务器错误",
        `status='${1}'`
    );

    if (!NoticeInfo[0]) {
        const ret = await DB(res, "xcx_notice", "insert", "服务器错误", {
            title,
            type,
            switchTab,
            noticeStatus,
            link_url,
            status,
            orderNo,
            createTime: rTime(timestamp(new Date())),
        });

        if (ret.affectedRows == 1) {
            // userList.forEach(async (ele) => {
            for (let i = 0; i < userList.length; i++) {
                await DB(res, "sy_notice_users", "insert", "服务器错误", {
                    userId: userList[i].id,
                    noticeId: ret.insertId

                });
            }


            // })
            res.json({
                code: 200,
                message: "添加成功",
            });
        }
    } else {
        res.json({
            code: 200,
            message: "链接已存在",
        });
    }
};

/**
 * 更新轮播图
 * @param req
 * @param res
 */
exports.updateNotice = async (req, res) => {
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
        type,
        switchTab,
        link_url,
        noticeStatus,
        orderNo,
        status,
    } = req.body;
    const ret = await DB(
        res,
        "xcx_notice",
        "update",
        "服务器错误",
        `id='${id}'`,
        {
            title,
            type,
            switchTab,
            noticeStatus,
            link_url,
            status,
            orderNo,
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
            code: 403,
            message: "修改失败",
        });
    }
};
exports.setNoticeStatus = async (req, res) => {
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
    const {id, status} = req.body;

    const ret = await DB(
        res,
        "xcx_notice",
        "update",
        "服务器错误",
        `id='${id}'`,
        {
            status,
            updateTime: rTime(timestamp(new Date())),
        }
    );

    if (ret.affectedRows == 1) {
        res.json({
            code: 200,
            message: "修改成功",
            type: "success",
        });
    } else {
        res.json({
            code: 403,
            message: "修改失败",
            type: "success",
        });
    }
};
/**
 * 删除轮播图
 * @param req
 * @param res
 */
exports.delNotice = async (req, res) => {
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
    const ret = await DB(res, "xcx_notice", "delete", "服务器错误", `id='${id}'`);
    await DB(res, "sy_notice_users", "delete", "服务器错误", `noticeId='${id}'`);
    if (ret.affectedRows == 1) {
        res.json({
            code: 200,
            message: "删除成功",
        });
    }
};

exports.multipleDelNotice = async (req, res) => {
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
    let {ids} = req.body;
    let ret = await DB(
        res,
        "xcx_notice",
        "sql",
        "服务器错误",
        `select *  from xcx_notice delete where id in ${ids}`
    );
    if (ret.affectedRows == 1) {
        res.json({
            code: 200,
            message: "删除成功",
        });
    }
};
/**
 * 轮播图详情
 * @param req
 * @param res
 */
exports.NoticeInfo = async (req, res) => {
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
    const {id} = req.query;
    const NoticeInfo = await DB(
        res,
        "xcx_notice",
        "find",
        "服务器错误",
        `id='${id}'`
    );
    res.json({
        code: 200,
        data: {...NoticeInfo[0]},
    });
};

/**
 * 轮播图列表
 * @param req
 * @param res
 */
exports.NoticeList = async (req, res) => {
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
        title: req.query.title || "",
        type: req.query.type || "",
        status: req.query.status || "",
        page: req.query.page || 1,
        pageSize: req.query.pageSize || 10,
    };

    /***/
    let typeList = await DB(res, "sy_dict", "find", "服务器出错", `value='noticeType' and parentId=0`);
    let type = []
    if (typeList[0]) {
        type = await DB(res, "sy_dict", "find", "服务器出错", `parentId=${typeList[0].id}`);
    }

    let noticeStatusList = await DB(res, "sy_dict", "find", "服务器出错", `value='noticeStatus' and parentId=0`);
    let noticeStatus = []
    if (typeList[0]) {
        noticeStatus = await DB(res, "sy_dict", "find", "服务器出错", `parentId=${noticeStatusList[0].id}`);
    }

    let NoticeLen = await DB(
        res,
        "xcx_notice",
        "find",
        "服务器出错",
        `title like '%${params.title}%' and status like '%${params.status}%' and type like '%${params.type}%' `
    );
    let result = await DB(
        res,
        "xcx_notice",
        "find",
        "服务器出错",
        `title like '%${params.title}%' and status like '%${params.status
        }%' and type like '%${params.type}%' order by orderNo desc limit ${(params.page - 1) * params.pageSize
        },${params.pageSize}`
    );

    result.forEach((v) => {
        // let type = v.type.split(",").map(Number);
        // v.type = Number(v.type)
        // v.noticeStatus = Number(v.noticeStatus)
        if (type[0]) {
            type.forEach((ele) => {
                if (ele.value == v.type) {
                    v.typeName = ele.label
                }
            })
        } else {
            v.typeName = ''
        }
        if (noticeStatus[0]) {
            noticeStatus.forEach((ele) => {
                if (ele.value == v.noticeStatus) {
                    v.noticeStatusName = ele.label
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
                total: NoticeLen.length,
                page: params.page,
                pageSize: params.pageSize,
            },
        });
    }
};


/**
 * 通知列表
 */
exports.NoticeMessageList = async (req, res) => {
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

    let noticeUserList = await DB(res, "sy_notice_users", "find", "服务器出错", `userId=${payload.accountId.id} and status=1`);
    let noticeList = await DB(res, "xcx_notice", "find", "服务器出错", `status=1`);
    let noticeUserIds = []
    noticeUserList.forEach((v) => {
        noticeUserIds.push(v.noticeId)
    })
    let typeList = await DB(res, "sy_dict", "find", "服务器出错", `value='noticeType' and parentId=0`);
    let type = []
    if (typeList[0]) {
        type = await DB(res, "sy_dict", "find", "服务器出错", `parentId=${typeList[0].id}`);
    }

    let noticeStatusList = await DB(res, "sy_dict", "find", "服务器出错", `value='noticeStatus' and parentId=0`);
    let noticeStatus = []
    if (typeList[0]) {
        noticeStatus = await DB(res, "sy_dict", "find", "服务器出错", `parentId=${noticeStatusList[0].id}`);
    }

    let list = noticeUserIds.map(
        item => noticeList.filter(i => i?.id == item)[0]
    );

    list.forEach((v) => {
        // let type = v.type.split(",").map(Number);
        // v.type = Number(v.type)
        // v.noticeStatus = Number(v.noticeStatus)
        if (type[0]) {
            type.forEach((ele) => {
                if (ele.value == v.type) {
                    v.typeName = ele.label
                }
            })
        } else {
            v.typeName = ''
        }
        v.avatar = 'https://gw.alipayobjects.com/zos/rmsportal/ThXAXghbEsBCCSDihZxY.png'
        v.titleDelete = false
        v.read = v.status
        if(v.noticeStatus == 10){
            v.color = 'green'
        }
        if(v.noticeStatus == 20){
            v.color = 'warning'
        }
        if(v.noticeStatus == 30){
            v.color = 'error'
        }

        if (noticeStatus[0]) {
            noticeStatus.forEach((ele) => {
                if (ele.value == v.noticeStatus) {
                    v.noticeStatusName = ele.label
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
    // let tempArr = []
    // let Data = [];
    // for (let i = 0; i < list.length; i++) {
    //     if (tempArr.indexOf(list[i].type) === -1) {
    //         Data.push({
    //             key: list[i].type / 10,
    //             name:list[i].typeName,
    //             list: [list[i]]
    //         });
    //         tempArr.push(list[i].type);
    //     } else {
    //         for (let j = 0; j < Data.length; j++) {
    //             if (Data[j].key == list[i].type/10) {
    //                 Data[j].list.push(list[i]);
    //                 break;
    //             }
    //         }
    //     }
    // }
    // let data = [
    //     {type:1,name:'通知'},
    //     {type:2,name:'消息'},
    //     {type:3,name:'代办'},
    // ]
    let tz = []
    let xi = []
    let db = []
    list.forEach((ele) => {
        if (ele.type == 10) {
            tz.push(ele)
        }
        if (ele.type == 20) {
            xi.push(ele)
        }
        if (ele.type == 30) {
            db.push(ele)
        }
    })

    res.json({
        code: 200,
        result: {
            items: [
                {
                    key: 1,
                    name: '通知',
                    list: tz.length ? tz : []
                },
                // {
                //     key:2,
                //     name:'消息',
                //     list:xi.length?xi:[]
                // },
                // {
                //     key:3,
                //     name:'代办',
                //     list:db.length?db:[]
                // }
            ],
            count: tz.length
        }
    });

};


exports.NoticeRead = async (req, res) => {
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
    let {noticeId} = req.query
    // let noticeUserList = await DB(res, "sy_notice_users", "find", "服务器出错", `userId=${payload.accountId.id} and status=1`);
    let ret = await DB(res, "sy_notice_users", "update", "服务器出错", `userId=${payload.accountId.id} and noticeId=${noticeId}`, {
        status: 0
    });
    if (ret.affectedRows == 1) {
        res.json({
            code: 200,
            message: "消息已读",
            type: "success",
        });
    } else {
        res.json({
            code: 403,
            message: "",
            type: "success",
        });
    }
}