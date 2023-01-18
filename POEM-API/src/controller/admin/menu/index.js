const {rTime, timestamp, listToTree, listMockToTree, uniqueNumber} = require("../../../utils/timeformat")
const DB = require("../../../db")
const jwt = require("jsonwebtoken");
const config = require("../../../config");
/**
 * 创建菜单
 * @param req
 * @param res
 */
exports.createMenu = async (req, res) => {
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
    const {
        type,
        menuName,
        parentMenu = 0,
        orderNo,
        icon = '',
        routePath = '',
        status,
        isExt = '0',
        isShow = '0',
        keepalive = 1,
        permission = '',
        component = 'LAYOUT'
    } = req.body
    const info = await DB(res, 'sy_menus', 'find', '服务器错误', `menuName='${menuName}'`)
    if (!info[0]) {
        const ret = await DB(res, 'sy_menus', 'insert', '服务器错误', {
            type,
            menuName,
            parentMenu,
            orderNo,
            icon,
            routePath,
            status,
            isExt,
            isShow,
            keepalive,
            permission,
            component,
            createTime: rTime(timestamp(new Date())),
        })

        if (ret.affectedRows == 1) {
            res.json({
                code: 200,
                msg: "添加成功"
            })
        }
    } else {
        res.json({
            code: 200,
            msg: "菜单已存在"
        })
    }
}

/**
 * 更新菜单
 * @param req
 * @param res
 */
exports.updateMenu = async (req, res) => {
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
    const {
        id,
        type,
        menuName,
        parentMenu = 0,
        orderNo,
        icon = '',
        routePath = '',
        status,
        isExt = '0',
        isShow = '0',
        keepalive = 1,
        permission = '',
        component = 'LAYOUT'
    } = req.body
    const ret = await DB(res, 'sy_menus', 'update', '服务器错误', `id='${id}'`, {
        type, menuName, parentMenu, orderNo, icon, routePath, status, isExt, isShow, keepalive, permission, component,
        updateTime: rTime(timestamp(new Date())),
    })

    if (ret.affectedRows == 1) {
        res.json({
            code: 200,
            msg: "修改成功"
        })
    } else {
        res.json({
            code: 200,
            msg: "修改失败"
        })
    }
}

/**
 * 删除菜单
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
    const {id} = req.body
    const ret = await DB(res, 'sy_menus', 'delete', '服务器错误', `ID='${id}'`)
    if (ret.affectedRows == 1) {
        res.json({
            code: 200,
            msg: "删除成功"
        })
    }
}



/**
 * 菜单列表
 * @param req
 * @param res
 */
exports.getMenuList = async (req, res) => {

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
        menuName: req.query.menuName || "",
        status: req.query.status || "",
    }
    let result = await DB(res, 'sy_menus', 'find', '服务器出错', `status like '%${params.status}%' and menuName like '%${params.menuName}%' order by orderNo desc`);
    result.forEach((v) => {
        v.id = v.id + ''
        if (v.createTime) {
            v.createTime = rTime(timestamp(v.createTime))
        }
        if (v.updateTime) {
            v.updateTime = rTime(timestamp(v.updateTime))
        } else {
            delete v.updateTime
        }
        v.show = v.isShow
    })
    if (!result[0]) {
        res.json({
            code: 200,
            result

        })
    } else {

        res.json({
            code: 200,
            message: "ok",
            type: "success",
            result: listToTree(result, 'parentMenu')
        })
    }
}

/***
 * 用户菜单权限
 * @param req
 * @param res
 */
exports.getAsyncMenuList = async (req, res) => {
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

    let userInfo = await DB(res, 'sy_users', 'find', '服务器错误', `id='${payload.accountId.id}'`)
    let roleInfo = await DB(res, 'sy_roles', 'find', '服务器错误', `roleValue='${userInfo[0].roleValue}'`)
    let permissionMenuInfo = await DB(res, 'sy_permission_menu', 'find', '服务器错误', `roleValue='${roleInfo[0].roleValue}'`)
    let result = await DB(res, 'sy_menus', 'find', '服务器出错', `status='1' order by orderNo desc`);
    let permissionMenuIds = permissionMenuInfo[0].menu.split(',').map(Number)
    let parentIds = [] // permissionMenuInfo[0].parent.split(',').map(Number)
    let parentIdsAndPermissionMenuIds = uniqueNumber([...permissionMenuIds, ...parentIds])

    let list = result.filter(item => parentIdsAndPermissionMenuIds.includes(item.id))
    list.forEach((v) => {
        v.id = v.id + ''
        if (v.createTime) {
            v.createTime = rTime(timestamp(v.createTime))
        }
        if (v.updateTime) {
            v.updateTime = rTime(timestamp(v.updateTime))
        } else {
            delete v.updateTime
        }
        v.show = v.isShow
    })
    let data = listMockToTree(list, 'parentMenu')
    if (!data[0]) {
        res.json({
            code: 200,
            result: data

        })
    } else {

        res.json({
            code: 200,
            message: "ok",
            type: "success",
            result: data
        })
    }
}