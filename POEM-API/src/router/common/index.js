const express = require('express')
const router = express.Router()
const {UploadImage} = require('../../controller/common/uploadImage')
const {uploadVideo} = require('../../controller/common/uploadVideo')
const multer = require('multer');
// 上传图片
const uploadImg = multer({dest: 'images/'});
const uploadVideoFile = multer({dest: 'images/'});
router.post('/upload', uploadImg.single('file'), UploadImage)

router.post('/uploadVideo', uploadVideoFile.single('file'), uploadVideo)


module.exports = router