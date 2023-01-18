const router = require('express').Router()
/** 角色列表 创建角色 更新角色 删除据说 角色详情**/
const {getRoleListByPage,getAllRoleList, createRole, updateRole, delRole, roleInfo,setRoleStatus} = require('../../../controller/admin/role')


router.get('/system/getRoleListByPage', getRoleListByPage)
router.get('/system/getAllRoleList', getAllRoleList)
router.post('/system/createRole', createRole)
router.post('/system/updateRole', updateRole)
router.post('/system/setRoleStatus', setRoleStatus)
router.post('/system/delRole', delRole)
router.get('/roleInfo', roleInfo)
module.exports = router