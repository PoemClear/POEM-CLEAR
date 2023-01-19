const router = require('express').Router()
/** 轮播图列表 创建轮播图 更新轮播图 删除轮播图 轮播图详情**/
const {createSubject,subjectList,subjectItem,updateCheckSubject,upDateSubjectRecycle,updateSubject} = require('../../../controller/admin/subject')


router.get('/subject/list', subjectList)
router.post('/subject/create', createSubject)
router.get('/subject/item', subjectItem)
router.post('/updateCheckSubject', updateCheckSubject)
router.post('/upDateSubjectRecycle', upDateSubjectRecycle)
router.post('/subject/update', updateSubject)
module.exports = router