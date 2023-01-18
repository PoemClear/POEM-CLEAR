const router = require('express').Router()
/** 轮播图列表 创建轮播图 更新轮播图 删除轮播图 轮播图详情**/
const {postList,postItem,delPost,upDatePostRecycle,updateCheckPost} = require('../../../controller/admin/post')

// createPost,postItem,
// router.post('/createPost', createPost)
router.get('/postItem', postItem)
router.get('/postList', postList)
router.post('/delPost', delPost)
router.post('/upDatePostRecycle', upDatePostRecycle)
router.post('/updateCheckPost', updateCheckPost)
module.exports = router