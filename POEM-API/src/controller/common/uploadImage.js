const fs = require('fs')
const COS = require('cos-nodejs-sdk-v5')
const config = require("../../config")
const jwt = require("jsonwebtoken");
const DB = require("../../db");
const cos = new COS(config.qcloud.cos);
const TengXunCos = config.qcloud.tengxunCos
const {rTime, timestamp,fileSuffixTypeUtil} = require("../../utils/timeformat")
exports.UploadImage = async(req, res) => {
    let payload = null;
    try {
        const authorizationHeader = req.get("Authorization");
        const accessToken = authorizationHeader
        payload = jwt.verify(accessToken, config.jwtSecret);
    } catch (error) {
        return res.status(401).json({
            code: 401, message: "TOKEN 已过期"
        });
    }
    const originalname = req.file.originalname
    const rst = await DB(res, 'sy_users', 'find', '服务器错误', `id='${payload.accountId.id}'`)
    if(!rst[0]) return
    // 文件路径
    let filePath = './' + req.file.path;
    fs.rename(filePath, originalname, (err) => {
        if (err) {
            res.json({code: 500, message: '文件写入失败'});
        } else {
            let localFile = './' + originalname;
            let key = originalname;

            // 腾讯云 文件上传
            let params = {
                Bucket: TengXunCos.Bucket,                         /* 必须 */
                Region: TengXunCos.Region,                         /* 必须 */
                Key: key,                                           /* 必须 */
                FilePath: localFile,                                /* 必须 */
                SliceSize:  1000 * 1024 * 1024,
                onHashProgress: function (progressData) {
                    console.log("校验中", JSON.stringify(progressData));
                },
                onProgress: function (data) {
                    var percent = parseInt(data.percent * 10000) / 100;
                    var speed = parseInt(data.speed / 1024 / 1024 * 100) / 100;
                    console.log('进度：' + percent + '%; 速度：' + speed + 'Mb/s;');
                },
            }
            cos.sliceUploadFile(params, async function (err, data) {
                if (err) {
                    fs.unlinkSync(localFile);
                    res.json({code: 400, message: '上传失败'});
                } else {
                    fs.unlinkSync(localFile);
                    // console.log(data)
                    let url = 'https://sy0415-1300507222.cos.ap-beijing.myqcloud.com/' + data.Key;
                    await DB(res, 'sy_files', 'insert', '服务器错误', {
                      url,
                        type:fileSuffixTypeUtil(url.substring(url.lastIndexOf('.') + 1)),
                        userId:payload.accountId.id,
                        originalname:originalname,
                        createTime:rTime(timestamp(new Date())),
                    })
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
                }
            });
        }
    });

}
