const { rTime, timestamp, listToTree } = require("../../../../utils/timeformat")
const DB = require("../../../../db")
const jwt = require("jsonwebtoken");
const config = require("../../../../config");

/**
 * 创建部门
 * @param req
 * @param res
 */
exports.createDept = async (req, res) => {
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
    const { deptName, parentDept = 0, orderNo, status, remark = '' } = req.body
    const deptInfo = await DB(res, 'sy_depts', 'find', '服务器错误', `deptName='${deptName}'`)
    if (!deptInfo[0]) {
        const ret = await DB(res, 'sy_depts', 'insert', '服务器错误', {
            deptName, parentDept, orderNo, status,
            remark,
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
            message: "部门已存在"
        })
    }
}

/**
 * 更新部门
 * @param req
 * @param res
 */
exports.updateDept = async (req, res) => {
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
    const { id, deptName, parentDept = 0, orderNo, status, remark } = req.body
    const userList = await DB(res, 'sy_users', 'find', '服务器错误', `deptId='${id}'`)
    if (userList[0] && status == 0) {
        res.json({
            code: 403,
            message: `当前部门下已绑定用户，不能禁用`,
            type: "success"
        })
        return
    }
    /**如果当前轮播图跳转链接不存在 就去新增*/
    const ret = await DB(res, 'sy_depts', 'update', '服务器错误', `id='${id}'`, {
        deptName, parentDept, orderNo, status, remark,
        updateTime: rTime(timestamp(new Date())),
    })

    if (ret.affectedRows == 1) {
        res.json({
            code: 200,
            message: "修改成功"
        })
    } else {
        /**提示轮播图 已存在相同链接*/
        res.json({
            code: 200,
            message: "修改失败"
        })
    }
}

/**
 * 删除部门
 * @param req
 * @param res
 */
exports.delDept = async (req, res) => {
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
    const userList = await DB(res, 'sy_users', 'find', '服务器错误', `deptId='${id}'`)
    let user = []
    userList.filter((ele) => {
        user.push(ele.username)
    })

    if (userList[0]) {
        res.json({
            code: 403,
            message: `当前部门下已绑定【${user}】，不能删除`,
            type: "success"
        })
        return
    }
    const ret = await DB(res, 'sy_depts', 'delete', '服务器错误', `ID='${id}'`)
    if (ret.affectedRows == 1) {
        res.json({
            code: 200,
            message: "删除成功"
        })
    }
}

/**
 * 部门详情
 * @param req
 * @param res
 */
exports.deptInfo = async (req, res) => {
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
    const bannerInfo = await DB(res, 'sy_depts', 'find', '服务器错误', `ID='${id}'`)
    res.json({
        code: 200,
        data: { ...bannerInfo[0] }
    })
}


/**
 * 部门列表 【tree】
 * @param req
 * @param res
 */
exports.getDeptList = async (req, res) => {
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
        title: req.query.title || "",
        status: req.query.status || "",
    }
    let result = await DB(res, 'sy_depts', 'find', '服务器出错', `status like '%${params.status}%' and deptName like '%${params.title}%' order by orderNo desc`);
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
            result

        })
    } else {
        res.json({
            code: 200, type: "success", message: 'ok',
            result: listToTree(result, 'parentDept')
        })
    }
}

/**
 * 部门列表 【Not tree】
 * @param req
 * @param res
 */
exports.getSelectDeptList = async (req, res) => {
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
    let { title, status } = req.query
    let result = await DB(res, 'sy_depts', 'find', '服务器出错', `deptName like '%${title}%' or status like '%${status}%'`);
    let data = result.filter((v) => {

        if (v.createTime) {
            v.createTime = rTime(timestamp(v.createTime))
        }
        if (v.updateTime) {
            v.updateTime = rTime(timestamp(v.updateTime))
        } else {
            delete v.updateTime

        }
        if (v.parentDept > 0 && v.status == 1) {
            return v
        }
    })
    if (!result[0]) {
        res.json({
            code: 200,
            result: data

        })
    } else {

        res.json({
            code: 200, type: "success", message: 'ok',
            result: data
        })
    }
}