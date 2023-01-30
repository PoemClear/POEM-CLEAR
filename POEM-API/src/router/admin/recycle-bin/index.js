const router = require('express').Router()
/** 轮播图列表 创建轮播图 更新轮播图 删除轮播图 轮播图详情**/
const {recycleBinList} = require('../../../controller/admin/recycle-bin')


router.get('/recycleBin/recycleBinList', recycleBinList)
module.exports = router