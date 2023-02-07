var STS = require('qcloud-cos-sts');
const config = require("../../config")
const TengXunCos = config.qcloud.tengxunCos
const cos = config.qcloud.cos
console.log(cos)
// 配置参数
var STSconfig = {
    secretId: cos.SecretId,   //修改
    secretKey: cos.SecretId,
    appid:cos.AppId,
    proxy: '',
    durationSeconds: 1800,
    // 放行判断相关参数
    bucket: TengXunCos.Bucket,
    region: TengXunCos.Region,
    allowPrefix: '*', // 这里改成允许的路径前缀，可以根据自己网站的用户登录态判断允许上传的具体路径，例子： a.jpg 或者 a/* 或者 * (使用通配符*存在重大安全风险, 请谨慎评估使用)
    // 简单上传和分片，需要以下的权限，其他权限列表请看 https://cloud.tencent.com/document/product/436/31923
    allowActions: [
        // 简单上传
        'name/cos:PutObject',
        'name/cos:PostObject',
        // 分片上传
        'name/cos:InitiateMultipartUpload',
        'name/cos:ListMultipartUploads',
        'name/cos:ListParts',
        'name/cos:UploadPart',
        'name/cos:CompleteMultipartUpload'
    ],
};

// 支持跨域访问

// 临时密钥接口
exports.uploadVideo = (req, res, next) => {

    // TODO 这里根据自己业务需要做好放行判断
    console.log(req.file)
    // 获取临时密钥
    var shortBucketName = STSconfig.bucket.substr(0, STSconfig.bucket.lastIndexOf('-'));
    var appId = STSconfig.bucket.substr(1 + STSconfig.bucket.lastIndexOf('-'));

    var policy = {
        'version': '2.0',
        'statement': [{
            'action': STSconfig.allowActions,
            'effect': 'allow',
            'principal': {'qcs': ['*']},
            'resource': [
                'qcs::cos:' + STSconfig.region + ':uid/' + STSconfig.appid + ':prefix//' + appId + '/' + shortBucketName + '/' + STSconfig.allowPrefix,
            ],
        }],
    };
    STS.getCredential({
        secretId: STSconfig.secretId,
        secretKey: STSconfig.secretKey,
        proxy: STSconfig.proxy,
        durationSeconds: STSconfig.durationSeconds,
        policy: policy,
    }, function (err, tempKeys) {
        var result = JSON.stringify(err || tempKeys) || '';
        console.log(JSON.parse(result))
        res.send({
            url:JSON.parse(result)
        });
    });
}
