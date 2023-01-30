const router = require('express').Router()
/** 轮播图列表 创建轮播图 更新轮播图 删除轮播图 轮播图详情**/
const { createPost,updatePost, postList, postItem, delPost, upDatePostRecycle, updateCheckPost } = require('../../../../controller/admin/content/post')

// createPost,postItem,
router.post('/content/createPost', createPost)
router.post('/content/updatePost', updatePost)
router.get('/content/postItem', postItem)
router.get('/content/postList', postList)
router.post('/content/delPost', delPost)
router.post('/content/upDatePostRecycle', upDatePostRecycle)
router.post('/content/updateCheckPost', updateCheckPost)
module.exports = router