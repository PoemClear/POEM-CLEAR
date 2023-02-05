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
/** 系统管理 --------------------------------------------------START*/
/** APP管理*/
router.use(require('./admin/app/loading'))
/** APP管理 --------------------------------------------------END*/
/** 轮播图列表 创建轮播图 更新轮播图 删除轮播图 轮播图详情**/
router.use(require('./admin/app/banner'))

/** 内容管理 --------------------------------------------------START*/
/** 专题管理*/
router.use(require('./admin/content/subject'))
/** 文章管理*/
router.use(require('./admin/content/post'))
/** 圈子 | 专栏*/
router.use(require('./admin/content/column'))
/** 文章分类管理*/
router.use(require('./admin/content/cate'))
/** 文章标签管理*/
router.use(require('./admin/content/label'))

/** 内容管理 --------------------------------------------------END/
/** 金刚区|分类管理*/
// router.use(require('./admin/cate'))
/** 评论管理*/
router.use(require('./admin/comment'))
/** 金刚区管理*/
router.use(require('./admin/app/appCate'))
/** 公告管理*/
router.use(require('./admin/notice'))

/** 回收站管理*/
router.use(require('./admin/recycle-bin'))

/** 个人设置*/
router.use(require('./admin/setting'))
/** 文章 评论 。。 统计*/
router.use(require('./admin/data'))
module.exports = router