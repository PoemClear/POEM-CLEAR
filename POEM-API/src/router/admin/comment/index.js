const router = require('express').Router()
/** 轮播图列表 创建轮播图 更新轮播图 删除轮播图 轮播图详情**/
const {createComment,postCommentList} = require('../../../controller/admin/comment')


router.post('/createComment', createComment)
router.get('/postCommentList', postCommentList)
module.exports = router