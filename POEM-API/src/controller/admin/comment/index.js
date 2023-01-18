const {rTime, timestamp, listToTree, getFormatMsgTime} = require("../../../utils/timeformat")
const DB = require("../../../db")
const jwt = require("jsonwebtoken");
const config = require("../../../config");

/**
 * 添加评论
 * @param req
 * @param res
 * workId：来源ID/文章  fromId：用户id  toId：被评论id   commentId：评论ID
 */
exports.createComment = async (req, res) => {
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
    let {workId, fromId, toId, parentId, content, status, commentId} = req.body

    if (!commentId) {
        parentId = 0
    } else {
        parentId = commentId
    }
    const ret = await DB(res, 'xcx_comment', 'insert', '服务器错误', {
        WORK_ID: workId,
        FROM_ID: fromId,
        TO_ID: toId,
        CONTENT: content,
        PARENT_ID: parentId,
        STATUS: status,
        CREATE_TIME: rTime(timestamp(new Date())),
    })

    if (ret.affectedRows == 1) {
        /** 评论成功后 文章评论+1*/
        const postInfo = await DB(res, 'sy_post', 'find', '服务器错误', `ID='${workId}'`)
        await DB(res, 'sy_post', 'update', '服务器错误', {
            COMMENT_COUNT: postInfo[0].COMMENT_COUNT += 1
        })

        res.json({
            code: 200,
            msg: "评论成功"
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
exports.postCommentList = async (req, res) => {
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
    let {id, userId} = req.query
    let result = await DB(res, 'xcx_comment', 'find', '服务器错误', `WORK_ID=${id} and status=${1}`)
    // let syPostResult = await DB(res, 'sy_post', 'find', '服务器错误',`ID=${id}`)
    let syUserResult = await DB(res, 'sy_users', 'find', '服务器错误')
    if (!result[0]) {
        res.json({
            code: 200,
            data: []
        })

    } else {
        result.forEach((v) => {
            if (v.CREATE_TIME) {
                v.CREATE_TIME = rTime(timestamp(v.CREATE_TIME))
                v.TIME = getFormatMsgTime(v.CREATE_TIME)
            }
            if (v.UPDATE_TIME) {
                v.UPDATE_TIME = rTime(timestamp(v.UPDATE_TIME))
            } else {
                delete v.UPDATE_TIME
            }

            syUserResult.forEach((ele) => {
                if (v.FROM_ID == ele.ID) {
                    v.AUTHOR = {
                        USER_ID: ele.ID,
                        NICKNAME: ele.NICKNAME || ele.U_ID,
                        AVATAR: ele.AVATAR
                    }
                }
            })
            // syPostResult.forEach((ele) => {
            //     if (v.WORK_ID == ele.ID) {
            //         v.AUTHOR = {
            //             USER_ID: ele.ID,
            //             NICKNAME: ele.NICKNAME || ele.U_ID,
            //             AVATAR: ele.AVATAR
            //         }
            //     }
            // })
        })

        res.json({
            code: 200,
            data: listToTree(result)
        })
    }


}
