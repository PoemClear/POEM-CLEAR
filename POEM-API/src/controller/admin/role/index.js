const {rTime, timestamp, listToTree, unique} = require("../../../utils/timeformat")
const DB = require("../../../db")
const jwt = require("jsonwebtoken");
const config = require("../../../config");

/**
 * 创建角色
 * @param req
 * @param res
 */
exports.createRole = async (req, res) => {
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
    const {roleName, roleValue, status, remark = '', orderNo = 1, menu = ''} = req.body
    const roleInfo = await DB(res, 'sy_roles', 'find', '服务器错误', `roleValue='${roleValue}'`)
    if (!roleInfo[0]) {
        const ret = await DB(res, 'sy_roles', 'insert', '服务器错误', {
            roleName, roleValue, status, remark, orderNo,
            createTime: rTime(timestamp(new Date())),
        })
        let permission = []
        if (menu.length) {
            let permissionMenuIds = menu.map(Number)

            let menuList = await DB(res, 'sy_menus', 'find', '服务器错误')
            let data = menuList.filter(item => permissionMenuIds.includes(item.id))
            data.forEach((ele) => {
                permission.push(ele.permission)
            })
            // permission.toString()
        }


        if (ret.affectedRows == 1) {
            await DB(res, 'sy_permission_menu', 'insert', '服务器错误', {
                roleValue, menu, permission,
                createTime: rTime(timestamp(new Date())),
            })
            res.json({
                code: 200,
                msg: "添加成功"
            })
        }
    } else {
        res.json({
            code: 200,
            msg: "角色已存在"
        })
    }
}

/**
 * 更新角色
 * @param req
 * @param res
 */
exports.updateRole = async (req, res) => {
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
    const {id, roleName, roleValue, status, remark, orderNo = 1, menu} = req.body


    const ret = await DB(res, 'sy_roles', 'update', '服务器错误', `id='${id}'`, {
        roleName, roleValue, status, remark, orderNo,
        updateTime: rTime(timestamp(new Date())),
    })
    let permission = []
    if (menu.length) {
        let permissionMenuIds = menu.map(Number)

        let menuList = await DB(res, 'sy_menus', 'find', '服务器错误')
        let data = menuList.filter(item => permissionMenuIds.includes(item.id))

        data.forEach((ele) => {
            if (ele.permission !== '') {
                permission.push(ele.permission)
            }


        })
    }
    if (ret.affectedRows == 1) {
        await DB(res, 'sy_permission_menu', 'update', '服务器错误', `roleValue='${roleValue}'`, {
            roleValue, menu, permission,
            updateTime: rTime(timestamp(new Date())),
        })
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
 * 更新角色状态
 * @param req
 * @param res
 */
exports.setRoleStatus = async (req, res) => {
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
    const {id, status} = req.body
    /** 查询当前角色的roleValue*/
    const roleInfo = await DB(res, 'sy_roles', 'find', '服务器错误', `id='${id}'`)
    const userIsExitRole = await DB(res, 'sy_users', 'find', '服务器错误', `roleValue='${roleInfo[0].roleValue}'`)
    if (userIsExitRole[0]) {
        res.json({
            code: 400,
            message: `角色【${roleInfo[0].roleValue}】已绑定用户，谨慎禁用`
        })
        return
    } else {
        const ret = await DB(res, 'sy_roles', 'update', '服务器错误', `id='${id}'`, {
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

}

/**
 * 删除角色
 * @param req
 * @param res
 */
exports.delRole = async (req, res) => {
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
    const roleInfo = await DB(res, 'sy_roles', 'find', '服务器错误', `id='${id}'`)
    /** 查询当前roleValue 是否有绑定的用户*/
    const userIsExitRole = await DB(res, 'sy_users', 'find', '服务器错误', `roleValue='${roleInfo[0].roleValue}'`)
    let user = []
    userIsExitRole.filter((ele) => {
        user.push(ele.username)
    })
    if (userIsExitRole[0]) {
        res.json({
            code: 400,
            message: `角色【${roleInfo[0].roleValue}】已绑定【${user}】用户，不能删除。请联系已绑用户解绑`
        })
        return
    }


    /** 查询当前roleValue 是否有绑定的菜单*/
    const menuIsExitRole = await DB(res, 'sy_permission_menu', 'find', '服务器错误', `roleValue='${roleInfo[0].roleValue}'`)
    if (menuIsExitRole[0].menu !== '') {
        res.json({
            code: 400,
            message: `角色【${roleInfo[0].roleValue}】已绑定菜单，不能删除。请清空当前角色绑定的菜单`
        })
        return
    }

    const ret = await DB(res, 'sy_roles', 'delete', '服务器错误', `id='${id}'`)
    await DB(res, 'sy_permission_menu', 'delete', '服务器错误', `roleValue='${roleInfo[0].roleValue}'`)
    if (ret.affectedRows == 1) {
        res.json({
            code: 200,
            msg: "删除成功"
        })
    }
}

/**
 * 角色详情
 * @param req
 * @param res
 */
exports.roleInfo = async (req, res) => {
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
    const {id} = req.query
    const result = await DB(res, 'sy_roles', 'find', '服务器错误', `id='${id}'`)
    const permissionMenu = await DB(res, 'sy_permission_menu', 'find', '服务器错误')
    result.forEach((v) => {

        permissionMenu.forEach((ele) => {
            if (v.roleValue == ele.roleValue) {

                v.menu = ele.menu.split(',')
            } else {
                v.menu = []
            }
        })
        if (v.createTime) {
            v.createTime = rTime(timestamp(v.createTime))
        }
        if (v.updateTime) {
            v.updateTime = rTime(timestamp(v.updateTime))
        } else {
            delete v.updateTime
        }
    })
    res.json({
        code: 200,
        data: {...result[0]}
    })
}


/**
 * 角色列表
 * @param req
 * @param res
 */
exports.getRoleListByPage = async (req, res) => {
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
        roleName: req.query.roleName || "",
        status: req.query.status || "",
        page: req.query.currentPage || 1,
        pageSize: req.query.pageSize || 10
    }
    let roleLen = await DB(res, 'sy_roles', 'find', '服务器出错', `status like '%${params.status}%' and roleName like '%${params.roleName}%'  `);
    let result = await DB(res, 'sy_roles', 'find', '服务器出错', `status like '%${params.status}%' and roleName like '%${params.roleName}%'  limit ${(params.page - 1) * params.pageSize},${params.pageSize}`);
    const permissionMenu = await DB(res, 'sy_permission_menu', 'find', '服务器错误')
    const menuList = await DB(res, 'sy_menus', 'find', '服务器错误', `status=1`)
    let treeMenuList = listToTree(menuList, 'parentMenu')
    let list = [result[2]]
    let datas = [permissionMenu[2]]
    list.forEach((v) => {

        if (v.createTime) {
            v.createTime = rTime(timestamp(v.createTime))
        }
        if (v.updateTime) {
            v.updateTime = rTime(timestamp(v.updateTime))
        } else {
            delete v.updateTime
        }
        datas.forEach((ele) => {
            if (v.roleValue == ele.roleValue) {


                v.menu = ele.menu.split(',')
            } else {
                // v.menu = []
            }
        })
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
            message: "ok",
            type: "success",
            result: {
                items: result,
                total: roleLen.length,
                page: params.page,
                pageSize: params.pageSize
            }

        })
    }
}
// getAllRoleList

/**
 * 角色列表
 * @param req
 * @param res
 */
exports.getAllRoleList = async (req, res) => {
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
        roleName: req.query.roleName || "",
        status: req.query.status || "",
        page: req.query.currentPage || 1,
        pageSize: req.query.pageSize || 10
    }

    let result = await DB(res, 'sy_roles', 'find', '服务器出错', `status like '%${params.status}%' and roleName like '%${params.roleName}%'  limit ${(params.page - 1) * params.pageSize},${params.pageSize}`);
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
            result: {
                items: []
            }
        })
    } else {

        res.json({
            code: 200,
            message: "ok",
            type: "success",
            result

        })
    }
}