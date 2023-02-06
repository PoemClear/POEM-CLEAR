const { rTime, timestamp } = require("../../../utils/timeformat");
const DB = require("../../../db");
const jwt = require("jsonwebtoken");
const config = require("../../../config");


/**
 * 文件列表
 * @param req
 * @param res
 */
exports.fileList = async (req, res) => {
  let payload = null;
  try {
    const authorizationHeader = req.get("Authorization");
    const accessToken = authorizationHeader;
    payload = jwt.verify(accessToken, config.jwtSecret);
  } catch (error) {
    return res.status(401).json({
      code: 401,
      message: "TOKEN 已过期",
    });
  }
  let params = {
    type: req.query.type || "",
    page: req.query.page || 1,
    pageSize: req.query.pageSize || 10,
  };


  if (payload.accountId.roleValue == 'systemAdmin') {
    let bannerLen = await DB(
        res,
        "sy_files",
        "find",
        "服务器出错",
        `type like '%${params.type}%' `
    );
    let result =  await DB(
        res,
        "sy_files",
        "find",
        "服务器出错",
        `type like '%${params.type}%' order by id desc limit ${(params.page - 1) * params.pageSize
        },${params.pageSize}`
    );
    let userList = await DB(
        res,
        "sy_users",
        "find",
        "服务器错误",
    );
    result.forEach(async (v) => {
      userList.forEach((ele) => {
        if (v.userId == ele.id) {
          v.author = {
            username: ele.nickname,
            avatar: ele.avatar
          }
        }
      })
      if (v.createTime) {
        v.createTime = rTime(timestamp(v.createTime));
      }
      if (v.updateTime) {
        v.updateTime = rTime(timestamp(v.updateTime));
      } else {
        delete v.updateTime;
      }
    });
    if (!result[0]) {
      res.json({
        code: 200,
        result: {
          items: [],
        },
      });
    } else {
      res.json({
        code: 200,
        result: {
          items: result,
          total: bannerLen.length,
          page: params.page,
          pageSize: params.pageSize,
        },
      });
    }
  }else{
    let bannerLen = await DB(
        res,
        "sy_files",
        "find",
        "服务器出错",
        `userId = ${payload.accountId.id} and type like '%${params.type}%' `
    );
    let result =  await DB(
        res,
        "sy_files",
        "find",
        "服务器出错",
        `userId = ${payload.accountId.id} and  type like '%${params.type}%' order by id desc limit ${(params.page - 1) * params.pageSize
        },${params.pageSize}`
    );
    let userList = await DB(
        res,
        "sy_users",
        "find",
        "服务器错误",
    );
    result.forEach(async (v) => {
      userList.forEach((ele) => {
        if (v.userId == ele.id) {
          v.author = {
            username: ele.nickname,
            avatar: ele.avatar
          }
        }
      })
      if (v.createTime) {
        v.createTime = rTime(timestamp(v.createTime));
      }
      if (v.updateTime) {
        v.updateTime = rTime(timestamp(v.updateTime));
      } else {
        delete v.updateTime;
      }
    });
    if (!result[0]) {
      res.json({
        code: 200,
        result: {
          items: [],
        },
      });
    } else {
      res.json({
        code: 200,
        result: {
          items: result,
          total: bannerLen.length,
          page: params.page,
          pageSize: params.pageSize,
        },
      });
    }
  }

};

