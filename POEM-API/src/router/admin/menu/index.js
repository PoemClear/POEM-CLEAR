const router = require('express').Router()
/** 角色列表 创建角色 更新角色 删除据说 角色详情**/
const {getMenuList,getAsyncMenuList, delMenu, createMenu, updateMenu} = require('../../../controller/admin/menu')


router.get('/system/getMenuList', getMenuList)
router.post('/system/createMenu', createMenu)
router.post('/system/updateMenu', updateMenu)
router.post('/system/delMenu', delMenu)
router.get('/getMenuList', getAsyncMenuList)


module.exports = router