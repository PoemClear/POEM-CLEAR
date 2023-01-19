const { rTime, timestamp } = require("../../../utils/timeformat");
const DB = require("../../../db");
const jwt = require("jsonwebtoken");
const config = require("../../../config");

exports.createSubject = async (req, res) => {
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
    userId = 1,
    title,
    cover,
    description = "",
    orderNo,
    postIds,
    subjectCateId = "1",
    subjectlabelId = "2",
    isEnd,
    status,
    checkStatus,
    isRecycle = "1",
  } = req.body;
  const deptInfo = await DB(
    res,
    "xcx_blog_subject",
    "find",
    "服务器错误",
    `title='${title}'`
  );
  if (!deptInfo[0]) {
    const ret = await DB(res, "xcx_blog_subject", "insert", "服务器错误", {
      userId,
      title,
      cover,
      description,
      orderNo,
      postIds,
      subjectCateId,
      subjectlabelId,
      isEnd,
      status,
      checkStatus,
      isRecycle,
      createTime: rTime(timestamp(new Date())),
    });

    if (ret.affectedRows == 1) {
      res.json({
        code: 200,
        msg: "添加成功",
      });
    }
  } else {
    res.json({
      code: 200,
      msg: "专题已存在",
    });
  }
};
exports.updateSubject = async (req, res) => {
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
    userId = 1,
    title,
    cover,
    description = "",
    orderNo,
    postIds,
    isEnd,
    status,
  } = req.body;

  const ret = await DB(
    res,
    "xcx_blog_subject",
    "update",
    "服务器错误",
    `id='${id}'`,
    {
      userId,
      title,
      cover,
      description,
      orderNo,
      postIds,
      isEnd,
      status,
      updateTime: rTime(timestamp(new Date())),
    }
  );

  if (ret.affectedRows == 1) {
    res.json({
      code: 200,
      msg: "编辑成功",
    });
  } else {
    res.json({
      code: 200,
      msg: "专题已存在",
    });
  }
};

exports.subjectList = async (req, res) => {
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
    status: req.query.status || "",
    isRecycle: req.query.isRecycle || "1",
    title: req.query.title || "",
    checkStatus: req.query.checkStatus || "",
    page: req.query.page || 1,
    pageSize: req.query.pageSize || 10,
  };
  let result_num = await DB(
    res,
    "xcx_blog_subject",
    "find",
    "服务器错误",
    `title like '%${params.title}%' and isRecycle like '%${params.isRecycle}%' and status like '%${params.status}%' and checkStatus like '%${params.checkStatus}%'`
  );

  let result = await DB(
    res,
    "xcx_blog_subject",
    "find",
    "服务器错误",
    `title like '%${params.title}%' and isRecycle like '%${
      params.isRecycle
    }%' and status like '%${params.status}%' and  checkStatus like '%${
      params.checkStatus
    }%'  order by orderNo desc  limit ${(params.page - 1) * params.pageSize},${
      params.pageSize
    }`
  );
  result.forEach((v, i) => {
    v.postIds = v.postIds.split(",").map(Number);
    v.num = v.postIds.length;
    v.cover = [v.cover];
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
        total: result_num.length,
        page: Number(params.page),
        pageSize: Number(params.pageSize),
      },
    });
  }
};

/**
 * 文章详情
 * @param req
 * @param res
 * @returns {Promise<*>}
 */
exports.subjectItem = async (req, res) => {
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
  let { id } = req.query;

  let result = await DB(
    res,
    "xcx_blog_subject",
    "find",
    "服务器错误",
    `id='${id}'`
  );

  let postList = await DB(res, "xcx_blog_post", "find", "服务器错误");
  let checkedIds = result[0].postIds.split(",").map(Number);
  let arr = postList.filter((item) => checkedIds.includes(item.id));
  result.forEach((v) => {
    v.postIds = v.postIds.split(",").map(Number);
    v.children = arr;
    v.num = arr.length;
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
      message: "ok",
      type: "success",
      result: {
        items: {},
      },
    });
  } else {
    res.json({
      code: 200,
      type: "success",
      message: "ok",
      result: {
        items: result[0],
      },
    });
  }
};

/**
 * 文章放入回收站
 * @param req
 * @param res
 */
exports.upDateSubjectRecycle = async (req, res) => {
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
  const { id, isRecycle } = req.body;
  const ret = await DB(
    res,
    "xcx_blog_subject",
    "update",
    "服务器错误",
    `id='${id}'`,
    {
      isRecycle,
      updateTime: rTime(timestamp(new Date())),
    }
  );

  if (ret.affectedRows == 1) {
    res.json({
      code: 200,
      message: "删除成功",
    });
  } else {
    res.json({
      code: 200,
      message: "修改失败",
    });
  }
};

/**
 * 审核文章 0 审核中 1 审核失败 2 审核成功
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
exports.updateCheckSubject = async (req, res) => {
  const { id, checkStatus } = req.body;
  const ret = await DB(
    res,
    "xcx_blog_subject",
    "update",
    "服务器错误",
    `id='${id}'`,
    {
      checkStatus,
    }
  );
  if (ret.affectedRows == 1) {
    res.json({
      code: 200,
      message: "审核成功",
    });
  } else {
    res.json({
      code: 200,
      message: "审核失败",
    });
  }
};

/**
 * 删除文章
 * @param req
 * @param res
 * @returns {Promise<*>}
 */
exports.delPost = async (req, res) => {
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
  const ret = await DB(
    res,
    "xcx_blog_subject",
    "delete",
    "服务器错误",
    `id='${id}'`
  );

  if (ret.affectedRows == 1) {
    res.json({
      code: 200,
      message: "删除成功",
    });
  } else {
    res.json({
      code: 200,
      message: "修改失败",
    });
  }
};
