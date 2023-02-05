require('dotenv').config({path: '.env'})

process.env.NODE_ENV = process.env.NODE_ENV || "development";
console.log(process)
const dev = {
    host: "152.136.141.57",
    password: "sy2022&0415",
}
const prod = {
    host: "152.136.141.57",
    password: "sy2022&0415",
}


module.exports = {
    port: process.env.PORT,
    jwtSecret: process.env.JWT_SECRET,
    md5Str: process.env.MD5_STR,
    mysql: {
        hp: process.env.NODE_ENV === 'development' ? dev : prod,
        charset: "utf8mb4_general_ci",
        user: "root",
        port: "3306",
        database: process.env.DATA_BASE
    },
    api: {
        prefix: "/api",
    },
    qcloud: {
        cos: {
            AppId: '1300507222',
            SecretId: 'AKIDoU1WtUwDGxXyFHn9JJD8tPiqnVyJT6NZ',
            SecretKey: 'A9wUt7CB1h8QZhp3CD2rxxq63bcWHHD1',

        },
        tengxunCos: {
            Bucket: 'sy0415-1300507222',
            Region: 'ap-beijing',
        }

    },
    thirdparyApi: {
        vvhan: "https://api.vvhan.com/api/",
        WALLPAPER_API: "http://service.picasso.adesk.com/v1/vertical/",
        KAMMANAPI: "https://m.kanman.com/api/",
        PCWEBAPI: "https://pcweb.api.mgtv.com/",
        OPENAPI: "http://poetry.apiopen.top/",
        kuaiKan: "https://www.kuaikanmanhua.com/",
        ppgjx: "https://ppgjx.com",
        gaoDe: "https://restapi.amap.com",
    },
    weChat: {
        url: "https://api.weixin.qq.com/",
        appid: "wx601d987cc7c0f354",
        secert: "600eaf8b88b5235caf45d80c2c10f183",
        gzhappid: "wxe5cab18377b87708",
        gzhsecert: "ab3da95fcd37e8525059e9ef5691a4cb"
    }

}