const router = require('express').Router()
/** 轮播图列表 创建轮播图 更新轮播图 删除轮播图 轮播图详情**/
const {cateTreeList, cateList, updateCate, createCate, delCate} = require('../../../controller/admin/cate')
// createCate, updateBanner, delBanner, bannerInfo

router.post('/post/createCate', createCate)
// router.post('/updateBanner', updateBanner)
// router.post('/delBanner', delBanner)
router.get('/post/cateTreeList', cateTreeList)
router.post('/post/cateList', cateList)
router.post('/post/updateCate', updateCate)
router.post('/post/delCate', delCate)
module.exports = router