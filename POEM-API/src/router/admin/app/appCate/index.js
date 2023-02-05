const router = require('express').Router()
/** 轮播图列表 创建轮播图 更新轮播图 删除轮播图 轮播图详情**/
const {createAppCate,appCateList,updateAppCate,delAppCate,cateLocation} = require('../../../../controller/admin/app/appCate')
// createBanner, updateBanner, delBanner, bannerInfo

router.post('/app/createAppCate', createAppCate)
router.post('/app/updateAppCate', updateAppCate)
router.post('/app/delAppCate', delAppCate)
// router.post('/multipleDelBanner', multipleDelBanner)
// router.post('/setBannerStatus', setBannerStatus)
router.get('/app/appCateLocation', cateLocation)
router.get('/app/appCateList', appCateList)
module.exports = router