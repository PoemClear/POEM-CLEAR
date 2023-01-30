const { rTime, timestamp } = require("../../../utils/timeformat");
const DB = require("../../../db");
const jwt = require("jsonwebtoken");
const config = require("../../../config");

/**
 * 创建轮播图
 * @param req
 * @param res
 */
exports.createNotice = async (req, res) => {
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
  const { title, type, switchTab, link_url, noticeStatus, orderNo, status } =
    req.body;
  let dictList = await DB(
    res,
    "sy_dict",
    "find",
    "服务器错误",
    `id=${type[1]}`
  );
  let notice = await DB(
    res,
    "sy_dict",
    "find",
    "服务器错误",
    `id=${noticeStatus[1]}`
  );
  const NoticeInfo = await DB(
    res,
    "xcx_notice",
    "find",
    "服务器错误",
    `link_url='${link_url}'`
  );
  if (!NoticeInfo[0]) {
    const ret = await DB(res, "xcx_notice", "insert", "服务器错误", {
      title,
      type,
      switchTab,
      noticeStatus,
      typeName: dictList[0].label,
      noticeStatusname: notice[0].label,
      link_url,
      status,
      orderNo,
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
      message: "链接已存在",
    });
  }
};

/**
 * 更新轮播图
 * @param req
 * @param res
 */
exports.updateNotice = async (req, res) => {
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
    title,
    type,
    switchTab,
    link_url,
    noticeStatus,
    orderNo,
    status,
  } = req.body;
  let dictList = await DB(
    res,
    "sy_dict",
    "find",
    "服务器错误",
    `id=${type[1]}`
  );
  let notice = await DB(
    res,
    "sy_dict",
    "find",
    "服务器错误",
    `id=${noticeStatus[1]}`
  );
  const ret = await DB(
    res,
    "xcx_notice",
    "update",
    "服务器错误",
    `id='${id}'`,
    {
      title,
      type,
      switchTab,
      noticeStatus,
      typeName: dictList[0].label,
      noticeStatusname: notice[0].label,
      link_url,
      status,
      orderNo,
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
exports.setNoticeStatus = async (req, res) => {
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
    "xcx_notice",
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
 * 删除轮播图
 * @param req
 * @param res
 */
exports.delNotice = async (req, res) => {
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
  const ret = await DB(res, "xcx_notice", "delete", "服务器错误", `id='${id}'`);
  if (ret.affectedRows == 1) {
    res.json({
      code: 200,
      message: "删除成功",
    });
  }
};

exports.multipleDelNotice = async (req, res) => {
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
    "xcx_notice",
    "sql",
    "服务器错误",
    `select *  from xcx_notice delete where id in ${ids}`
  );
  if (ret.affectedRows == 1) {
    res.json({
      code: 200,
      message: "删除成功",
    });
  }
};
/**
 * 轮播图详情
 * @param req
 * @param res
 */
exports.NoticeInfo = async (req, res) => {
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
  const NoticeInfo = await DB(
    res,
    "xcx_notice",
    "find",
    "服务器错误",
    `id='${id}'`
  );
  res.json({
    code: 200,
    data: { ...NoticeInfo[0] },
  });
};

/**
 * 轮播图列表
 * @param req
 * @param res
 */
exports.NoticeList = async (req, res) => {
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

  let NoticeLen = await DB(
    res,
    "xcx_notice",
    "find",
    "服务器出错",
    `title like '%${params.title}%' and status like '%${params.status}%' and type like '%${params.type}%' `
  );
  let result = await DB(
    res,
    "xcx_notice",
    "find",
    "服务器出错",
    `title like '%${params.title}%' and status like '%${
      params.status
    }%' and type like '%${params.type}%' order by orderNo desc limit ${
      (params.page - 1) * params.pageSize
    },${params.pageSize}`
  );

  result.forEach((v) => {
    v.type = v.type.split(",").map(Number);
    v.noticeStatus = v.noticeStatus.split(",").map(Number);
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
        total: NoticeLen.length,
        page: params.page,
        pageSize: params.pageSize,
      },
    });
  }
};
