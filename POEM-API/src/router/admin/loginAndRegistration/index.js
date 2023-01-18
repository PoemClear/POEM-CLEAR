const router = require('express').Router()
/**注册|申请 登录 用户信息**/
const {register, login, userInfo,logout,getPermCode} = require('../../../controller/admin/loginAndRegistration')

router.post('/register', register)
router.post('/login', login)
router.get('/userInfo', userInfo)
router.get('/logout', logout)
router.get('/getPermCode', getPermCode)
module.exports = router