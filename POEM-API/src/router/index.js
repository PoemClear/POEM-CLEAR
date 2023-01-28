const router = require('express').Router()



/** 公共接口*/
router.use(require('./common'))
/** 登录注册用户信息*/
router.use(require('./admin/loginAndRegistration'))
/** 系统管理 --------------------------------------------------START*/
/** 菜单管理*/
router.use(require('./admin/system/menu'))
/** 角色管理*/
router.use(require('./admin/system/role'))
/** 部门管理*/
router.use(require('./admin/system/dept'))
/** 用户管理*/
router.use(require('./admin/system/user'))
/** 字典管理*/
router.use(require('./admin/system/dict'))
/** 系统管理 --------------------------------------------------END*/

/** 轮播图列表 创建轮播图 更新轮播图 删除轮播图 轮播图详情**/
router.use(require('./admin/banner'))

/** 内容管理 --------------------------------------------------START*/

/** 内容管理 --------------------------------------------------END/
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
/** 文章标签管理*/
router.use(require('./admin/label'))
/** 金刚区管理*/
router.use(require('./admin/appCate'))
/** 公告管理*/
router.use(require('./admin/notice'))


module.exports = router