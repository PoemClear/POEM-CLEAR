const router = require('express').Router()
/** 轮播图列表 创建轮播图 更新轮播图 删除轮播图 轮播图详情**/
const {createAppCate,appCateList,updateAppCate,delAppCate} = require('../../../controller/admin/appCate')
// createBanner, updateBanner, delBanner, bannerInfo

router.post('/createAppCate', createAppCate)
router.post('/updateAppCate', updateAppCate)
router.post('/delAppCate', delAppCate)
// router.post('/multipleDelBanner', multipleDelBanner)
// router.post('/setBannerStatus', setBannerStatus)
// // router.get('/bannerInfo', bannerInfo)
router.get('/appCateList', appCateList)
module.exports = router