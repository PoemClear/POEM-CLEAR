const express = require('express')
const router = express.Router()
const {UploadImage} = require('../../controller/common/uploadImage')

const multer  = require('multer');
// 临时上传目录
const uploadImg = multer({ dest: 'images/' });
router.post('/file/upload/image',uploadImg.single('file'), UploadImage)

module.exports = router