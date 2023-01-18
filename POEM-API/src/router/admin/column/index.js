const router = require('express').Router()
/** 轮播图列表 创建轮播图 更新轮播图 删除轮播图 轮播图详情**/
const {createColumn,columnList} = require('../../../controller/admin/column')


router.post('/createColumn', createColumn)
router.get('/columnList', columnList)
module.exports = router