const router = require('express').Router()
/** 轮播图列表 创建轮播图 更新轮播图 删除轮播图 轮播图详情**/
const { labelTreeList, labelList, updateLabel, createLabel, delLabel } = require('../../../../controller/admin/content/label')
// createLabel, updateBanner, delBanner, bannerInfo

router.post('/content/createLabel', createLabel)
// router.post('/updateBanner', updateBanner)
// router.post('/delBanner', delBanner)
router.get('/content/LabelTreeList', labelTreeList)
router.post('/content/LabelList', labelList)
router.post('/content/updateLabel', updateLabel)
router.post('/content/delLabel', delLabel)
module.exports = router