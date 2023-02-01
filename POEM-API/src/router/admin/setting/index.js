const router = require('express').Router()
/** 轮播图列表 创建轮播图 更新轮播图 删除轮播图 轮播图详情**/
const {updatePwd} = require('../../../controller/admin/setting/updatePwd')


router.post('/setting/updatePwd', updatePwd)

module.exports = router