const express = require('express')
const router = express.Router()
const {UploadImage} = require('../../controller/common/uploadImage')
const multer = require('multer');
// 上传图片
const uploadImg = multer({dest: 'images/'});
router.post('/upload', uploadImg.single('file'), UploadImage)


module.exports = router