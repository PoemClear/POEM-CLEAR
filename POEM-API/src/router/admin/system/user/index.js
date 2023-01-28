const router = require('express').Router()
/** 用户列表**/
const {getAccountList,accountExist,createUser,updateUser,delUser} = require('../../../../controller/admin/system/user')


router.get('/system/getAccountList', getAccountList)
router.post('/system/accountExist', accountExist)
router.post('/system/createUser', createUser)
router.post('/system/updateUser', updateUser)
router.post('/system/delUser', delUser)
module.exports = router