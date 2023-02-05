const router = require('express').Router()
/** 轮播图列表 创建轮播图 更新轮播图 删除轮播图 轮播图详情**/
const {createBanner,bannerList,updateBanner,delBanner,multipleDelBanner,setBannerStatus} = require('../../../../controller/admin/app/banner')
// createBanner, updateBanner, delBanner, bannerInfo

router.post('/app/createBanner', createBanner)
router.post('/app/updateBanner', updateBanner)
router.post('/app/delBanner', delBanner)
router.post('/app/multipleDelBanner', multipleDelBanner)
router.post('/app/setBannerStatus', setBannerStatus)
// router.get('/bannerInfo', bannerInfo)
router.get('/app/bannerList', bannerList)
module.exports = router