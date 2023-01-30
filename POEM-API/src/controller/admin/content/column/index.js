const {rTime, timestamp, formatToTree} = require("../../../../utils/timeformat")
const DB = require("../../../../db")
const jwt = require("jsonwebtoken");
const config = require("../../../../config");

/**
 * 添加专栏 |圈子
 * @param req
 * @param res
 * workId：来源ID/文章  fromId：用户id  toId：被评论id   commentId：评论ID
 */
exports.createColumn = async (req, res) => {
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
    let {userId, title, cover, imageUrl, description, parentId, status, sort} = req.body
    const columnResult = await DB(res, 'sy_column', 'find', '服务器错误', `TITLE=${title}`)
    const userResult = await DB(res, 'sy_users', 'find', '服务器错误', `ID=${userId}`)
    if (!userResult[0]) {
        res.json({
            code: 403,
            msg: "用户不存在"
        })
        return
    }
    if (columnResult[0]) {
        res.json({
            code: 403,
            msg: "已存在"
        })
        return
    }
    const ret = await DB(res, 'sy_column', 'insert', '服务器错误', {
        USER_ID: userId,
        TITLE: title,
        COVER: cover,
        IMAGE_URL: imageUrl,
        DESCRIPTION: description,
        PARENT_ID: parentId,
        STATUS: status,
        SORT: sort,
        CREATE_TIME: rTime(timestamp(new Date())),
    })

    if (ret.affectedRows == 1) {
        /** 评论成功后 文章评论+1*/
        // const postInfo = await DB(res, 'sy_post', 'find', '服务器错误', `ID='${workId}'`)
        // await DB(res, 'sy_post', 'update', '服务器错误', {
        //     COMMENT_COUNT: postInfo[0].COMMENT_COUNT += 1
        // })

        res.json({
            code: 200,
            msg: "添加成功"
        })
    }
}

/**
 * 文章评论列表
 * @param req
 * @param res
 * @returns {Promise<void>}
 * id:文章id userId 用户id
 */
exports.columnList = async (req, res) => {
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
    let columnResult = await DB(res, 'sy_column', 'sql', '服务器错误', `select * from sy_column  order by SORT desc`);
    let userResult = await DB(res, 'sy_users', 'find', '服务器错误');
    // let postResult = await DB(res, 'sy_post', 'find', '服务器错误');
    columnResult.forEach((ele) => {
        // if(ele.PARENT_ID==0){
        //     let len = []
        userResult.forEach((v) => {
            if (v.ID == ele.USER_ID) {
                ele.AUTHOR = {
                    USER_ID: v.ID,
                    NICKNAME: v.NICKNAME || v.U_ID,
                    AVATAR: v.AVATAR
                }
            }
        })
        // }
    })
    let result = formatToTree(columnResult, 0)
    if (!result[0]) {
        res.json({
            code: 200,
            data: {
                list: []
            }
        })
    } else {
        res.json({
            code: 200,
            data: {
                list: result,
            }
        })
    }
}
