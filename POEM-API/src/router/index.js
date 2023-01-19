const router = require('express').Router()
/** 上传图片*/
router.use(require('./common'))
/** 登录注册用户信息*/
router.use(require('./admin/loginAndRegistration'))
/** 轮播图列表 创建轮播图 更新轮播图 删除轮播图 轮播图详情**/
router.use(require('./admin/banner'))
/** 菜单管理*/
router.use(require('./admin/menu'))
/** 角色管理*/
router.use(require('./admin/role'))
/** 部门管理*/
router.use(require('./admin/dept'))
/** 用户管理*/
router.use(require('./admin/user'))
/** 金刚区|分类管理*/
// router.use(require('./admin/cate'))
/** 评论管理*/
router.use(require('./admin/comment'))
/** 专题管理*/
router.use(require('./admin/subject'))
/** 文章管理*/
router.use(require('./admin/post'))
/** 圈子 | 专栏*/
router.use(require('./admin/column'))
/** 文章分类管理*/
router.use(require('./admin/cate'))
module.exports = router