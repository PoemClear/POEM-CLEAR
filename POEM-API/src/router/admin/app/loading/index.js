const router = require('express').Router()
/** 轮播图列表 创建轮播图 更新轮播图 删除轮播图 轮播图详情**/
const {loadingList,createLoading,updateLoading,delLoading} = require('../../../../controller/admin/app/loading')
// createBanner, updateBanner, delBanner, bannerInfo

router.post('/app/createLoading', createLoading)
router.post('/app/updateLoading', updateLoading)
router.post('/app/delLoading', delLoading)
router.get('/app/loadingList', loadingList)
module.exports = router