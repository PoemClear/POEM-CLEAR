const router = require('express').Router()
/** 轮播图列表 创建轮播图 更新轮播图 删除轮播图 轮播图详情**/
const { createSubject, subjectList, subjectItem, updateCheckSubject, upDateSubjectRecycle, updateSubject,delSubjectPost } = require('../../../../controller/admin/content/subject')
const {delPost} = require("../../../../controller/admin/content/post");


router.get('/content/subjectList', subjectList)
router.post('/content/createSubject', createSubject)
router.get('/content/subjectItem', subjectItem)
router.post('/content/updateCheckSubject', updateCheckSubject)
router.post('/content/upDateSubjectRecycle', upDateSubjectRecycle)
router.post('/content/updateSubject', updateSubject)
router.post('/content/delSubjectPost', delSubjectPost)
module.exports = router