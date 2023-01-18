const router = require('express').Router()
/** 角色列表 创建角色 更新角色 删除据说 角色详情**/
const {getMenuList,getAsyncMenuList, delDept, createMenu, updateMenu} = require('../../../controller/admin/menu')


router.get('/system/getMenuList', getMenuList)
router.post('/system/createMenu', createMenu)
router.post('/system/updateMenu', updateMenu)
router.post('/delDept', delDept)
router.get('/getMenuList', getAsyncMenuList)


module.exports = router