const router = require('express').Router()
/** 轮播图列表 创建轮播图 更新轮播图 删除轮播图 轮播图详情**/
const { cateTreeList, cateList, updateCate, createCate, delCate } = require('../../../../controller/admin/content/cate')
// createCate, updateBanner, delBanner, bannerInfo

router.post('/content/createCate', createCate)
// router.post('/updateBanner', updateBanner)
// router.post('/delBanner', delBanner)
router.get('/content/cateTreeList', cateTreeList)
router.post('/content/cateList', cateList)
router.post('/content/updateCate', updateCate)
router.post('/content/delCate', delCate)
module.exports = router