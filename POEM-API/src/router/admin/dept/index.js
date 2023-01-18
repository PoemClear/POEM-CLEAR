const router = require('express').Router()
/** 角色列表 创建角色 更新角色 删除据说 角色详情**/
const {getDeptList, delDept, deptInfo, createDept, updateDept,getSelectDeptList} = require('../../../controller/admin/dept')


router.get('/system/getDeptList', getDeptList)
router.get('/system/getSelectDeptList', getSelectDeptList)
router.post('/system/createDept', createDept)
router.post('/system/updateDept', updateDept)
router.post('/system/delDept', delDept)
router.get('/deptInfo', deptInfo)
module.exports = router