const { rTime, timestamp } = require("../../../utils/timeformat");
const DB = require("../../../db");
const jwt = require("jsonwebtoken");
const config = require("../../../config");

/**
 * 创建金刚区
 * @param req
 * @param res
 */
exports.createAppCate = async (req, res) => {
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
  const { type, image_url, link_url, orderNo, status } = req.body;
  let dictList = await DB(res, "sy_dict", "find", "服务器错误",`id=${type[1]}`)

  const bannerInfo = await DB(
    res,
    "xcx_cate",
    "find",
    "服务器错误",
    `link_url='${link_url}'`
  );
  if (!bannerInfo[0]) {
    const ret = await DB(res, "xcx_cate", "insert", "服务器错误", {
      typeName:dictList[0].label,
      type, image_url, link_url, orderNo, status,
      createTime: rTime(timestamp(new Date())),
    });

    if (ret.affectedRows == 1) {
      res.json({
        code: 200,
        message: "添加成功",
      });
    }
  } else {
    res.json({
      code: 200,
      message: "金刚区已存在",
    });
  }
};

/**
 * 更新金刚区
 * @param req
 * @param res
 */
exports.updateAppCate = async (req, res) => {
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
  const {
    id,
    type,
    image_url,
    link_url,
    orderNo,
    status
  } = req.body;
  let dictList = await DB(res, "sy_dict", "find", "服务器错误",`id=${type[1]}`)
  const ret = await DB(
    res,
    "xcx_cate",
    "update",
    "服务器错误",
    `id='${id}'`,
    {
      type,
      image_url,
      link_url,
      typeName:dictList[0].label,
      orderNo,
      status,
      updateTime: rTime(timestamp(new Date())),
    }
  );

  if (ret.affectedRows == 1) {
    res.json({
      code: 200,
      message: "修改成功",
    });
  } else {
    res.json({
      code: 200,
      message: "修改失败",
    });
  }
};
/**
 * 修改金刚区状态
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
exports.setBannerStatus = async (req, res) => {
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
  const { id, status } = req.body;

  const ret = await DB(
    res,
    "xcx_cate",
    "update",
    "服务器错误",
    `id='${id}'`,
    {
      status,
      updateTime: rTime(timestamp(new Date())),
    }
  );

  if (ret.affectedRows == 1) {
    res.json({
      code: 200,
      message: "修改成功",
      type: "success",
    });
  } else {
    res.json({
      code: 400,
      message: "修改失败",
      type: "success",
    });
  }
};
/**
 * 删除金刚区
 * @param req
 * @param res
 */
exports.delAppCate = async (req, res) => {
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
  const { id } = req.body;
  const ret = await DB(res, "xcx_cate", "delete", "服务器错误", `id='${id}'`);
  if (ret.affectedRows == 1) {
    res.json({
      code: 200,
      message: "删除成功",
    });
  }
};

exports.multipleDelBanner = async (req, res) => {
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
  let { ids } = req.body;
  let ret = await DB(
    res,
    "xcx_cate",
    "sql",
    "服务器错误",
    `select *  from xcx_cate delete where id in ${ids}`
  );
  if (ret.affectedRows == 1) {
    res.json({
      code: 200,
      message: "删除成功",
    });
  }
};
/**
 * 金刚区详情
 * @param req
 * @param res
 */
exports.bannerInfo = async (req, res) => {
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
  const { id } = req.query;
  const bannerInfo = await DB(
    res,
    "xcx_cate",
    "find",
    "服务器错误",
    `id='${id}'`
  );
  res.json({
    code: 200,
    data: { ...bannerInfo[0] },
  });
};

/**
 * 金刚区列表
 * @param req
 * @param res
 */
exports.appCateList = async (req, res) => {
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
    title: req.query.title || "",
    type: req.query.type || "",
    status: req.query.status || "",
    page: req.query.page || 1,
    pageSize: req.query.pageSize || 10,
  };

  let bannerLen = await DB(
    res,
    "xcx_cate",
    "find",
    "服务器出错",
    `title like '%${params.title}%' and status like '%${params.status}%' and type like '%${params.type}%' `
  );
  let result = await DB(
    res,
    "xcx_cate",
    "find",
    "服务器出错",
    `title like '%${params.title}%' and status like '%${
      params.status
    }%' and type like '%${params.type}%' order by orderNo desc limit ${
      (params.page - 1) * params.pageSize
    },${params.pageSize}`
  );

  result.forEach(async(v) => {
    v.image_url = [v.image_url];
    v.type = v.type.split(",").map(Number);
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
};
