const router = require('express').Router()
/** 轮播图列表 创建轮播图 更新轮播图 删除轮播图 轮播图详情**/
const {labelTreeList, labelList, updateLabel, createLabel, delLabel} = require('../../../controller/admin/label')
// createLabel, updateBanner, delBanner, bannerInfo

router.post('/post/createLabel', createLabel)
// router.post('/updateBanner', updateBanner)
// router.post('/delBanner', delBanner)
router.get('/post/LabelTreeList', labelTreeList)
router.post('/post/LabelList', labelList)
router.post('/post/updateLabel', updateLabel)
router.post('/post/delLabel', delLabel)
module.exports = router