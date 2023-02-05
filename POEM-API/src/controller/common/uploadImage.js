const fs = require('fs')
const COS = require('cos-nodejs-sdk-v5')
const config = require("../../config")
const cos = new COS(config.qcloud.cos);
const TengXunCos = config.qcloud.tengxunCos
// const DB = require("../../db")
// const {message, code} = require("../../utils/message")
exports.UploadImage = (req, res) => {
    // 文件路径
    let filePath = './' + req.file.path;
    // 文件类型
    let temp = req.file.originalname.split('.');
    let fileType = temp[temp.length - 1];
    let lastName = '.' + fileType;
    // 构建图片名
    let fileName = Date.now() + lastName;
    // 图片重命名
    fs.rename(filePath, fileName, (err) => {
        if (err) {
            res.json({code: 500, message: '文件写入失败'});
        } else {
            let localFile = './' + fileName;
            let key = fileName;

            // 腾讯云 文件上传
            let params = {
                Bucket: TengXunCos.Bucket,                         /* 必须 */
                Region: TengXunCos.Region,                         /* 必须 */
                Key: key,                                           /* 必须 */
                FilePath: localFile,                                /* 必须 */
                SliceSize: (1024 * 1024) / 2,
                onHashProgress: function (progressData) {
                    console.log("校验中", JSON.stringify(progressData));
                },
                onProgress: function (data) {
                    var percent = parseInt(data.percent * 10000) / 100;
                    var speed = parseInt(data.speed / 1024 / 1024 * 100) / 100;
                    console.log('进度：' + percent + '%; 速度：' + speed + 'Mb/s;');
                },
            }
            cos.sliceUploadFile(params, function (err, data) {
                if (err) {
                    fs.unlinkSync(localFile);
                    res.json({code: 400, message: '上传失败'});
                } else {
                    fs.unlinkSync(localFile);
                    console.log(data)
                    let url = 'https://sy0415-1300507222.cos.ap-beijing.myqcloud.com/' + data.Key;
                    // await DB(res, 'sy_image_material', 'insert', message[0], {
                    //     image_url:imageSrc
                    // })
                    let succMap = {}

                    succMap[ data.Key] = url
                    res.json({
                        code: 0,
                        msg: "上传成功",
                        url,
                        data : {
                            errFiles: [],
                            succMap
                        }

                    })
                    // res.json({
                    //     code: 200,
                    //     type: 'success',
                    //     result: imageUrl
                    //
                    // })
                }
            });
        }
    });

}
