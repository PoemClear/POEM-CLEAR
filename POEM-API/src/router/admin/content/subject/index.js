const router = require('express').Router()
/** 轮播图列表 创建轮播图 更新轮播图 删除轮播图 轮播图详情**/
const { createSubject, subjectList, subjectItem, updateCheckSubject, upDateSubjectRecycle, updateSubject } = require('../../../../controller/admin/content/subject')


router.get('/content/subjectList', subjectList)
router.post('/content/createSubject', createSubject)
router.get('/content/subjectItem', subjectItem)
router.post('/content/updateCheckSubject', updateCheckSubject)
router.post('/content/upDateSubjectRecycle', upDateSubjectRecycle)
router.post('/content/updateSubject', updateSubject)
module.exports = router