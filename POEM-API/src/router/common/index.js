const express = require('express')
const router = express.Router()
const {UploadImage} = require('../../controller/common/uploadImage')
const {uploadVideo} = require('../../controller/common/uploadVideo')
const {upload_single,upload_already,upload_chunk,upload_merge,upload_single_base64,upload_single_name} = require('../../controller/common/upload')
const multer = require('multer');
// 上传图片
const uploadImg = multer({dest: 'images/'});
const uploadVideoFile = multer({dest: 'images/'});
router.post('/upload', uploadImg.single('file'), UploadImage)

router.post('/uploadVideo', uploadVideoFile.single('file'), uploadVideo)

router.post('/upload_single', upload_single)
router.post('/upload_already', upload_already)
router.post('/upload_chunk', upload_chunk)
router.post('/upload_merge', upload_merge)
router.post('/upload_single_base64', upload_single_base64)
router.post('/upload_single_name', upload_single_name)
module.exports = router