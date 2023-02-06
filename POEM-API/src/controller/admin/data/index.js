const DB = require("../../../db");
const jwt = require("jsonwebtoken");
const config = require("../../../config");

exports.dataPost = async (req, res) => {
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
    const postList = await DB(
        res,
        "xcx_blog_post",
        "find",
        "服务器错误",
        `userId=${payload.accountId.id} `
    );
    const subjectList = await DB(
        res,
        "xcx_blog_subject",
        "find",
        "服务器错误",
        `userId=${payload.accountId.id} `
    );
    const draftsList = await DB(
        res,
        "xcx_blog_post",
        "find",
        "服务器错误",
        `userId=${payload.accountId.id} and drafts=1`
    );
    // drafts='${params.drafts}'
    console.log(postList.length)
    res.json({
        code: 200,
        result: {
            postNum: postList.length,
            subjectListNum:subjectList.length,
            commentNum: 0,
            attentionNum: 0,
            fansNum: 0
        }
    })
}