const router = require('express').Router()
/** 轮播图列表 创建轮播图 更新轮播图 删除轮播图 轮播图详情**/
const {postList,postItem,delPost,upDatePostRecycle} = require('../../../controller/admin/post')

// createPost,postItem,
// router.post('/createPost', createPost)
router.get('/postItem', postItem)
router.get('/postList', postList)
router.post('/delPost', delPost)
router.post('/upDatePostRecycle', upDatePostRecycle)
module.exports = router