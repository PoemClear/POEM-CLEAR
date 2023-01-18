const router = require('express').Router()
/** 轮播图列表 创建轮播图 更新轮播图 删除轮播图 轮播图详情**/
const {createBanner,bannerList,updateBanner,delBanner,multipleDelBanner,setBannerStatus} = require('../../../controller/admin/banner')
// createBanner, updateBanner, delBanner, bannerInfo

router.post('/createBanner', createBanner)
router.post('/updateBanner', updateBanner)
router.post('/delBanner', delBanner)
router.post('/multipleDelBanner', multipleDelBanner)
router.post('/setBannerStatus', setBannerStatus)
// router.get('/bannerInfo', bannerInfo)
router.get('/bannerList', bannerList)
module.exports = router