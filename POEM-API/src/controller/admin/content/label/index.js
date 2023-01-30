const { rTime, timestamp, listToTree } = require("../../../../utils/timeformat");
const DB = require("../../../../db");
const jwt = require("jsonwebtoken");
const config = require("../../../../config");

/**
 * 创建标签
 * @param req
 * @param res
 */
exports.createLabel = async (req, res) => {
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
    title,
    orderNo,
    cover,
    type,
    parentId = 0,
    image_url,
    remark = "",
    status,
  } = req.body;

  /**如果当前标签跳转链接不存在 就去新增*/
  const ret = await DB(res, "sy_blog_label", "insert", "服务器错误", {
    title,
    orderNo,
    cover,
    type,
    parentId,
    image_url,
    remark,
    status,
    createTime: rTime(timestamp(new Date())),
  });

  if (ret.affectedRows == 1) {
    res.json({
      code: 200,
      message: "添加成功",
    });
  }
};

/**
 * 更新标签
 * @param req
 * @param res
 */
exports.updateLabel = async (req, res) => {
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
    orderNo,
    cover,
    type,
    parentId = 0,
    image_url,
    remark = "",
    status,
  } = req.body;
  const ret = await DB(
    res,
    "sy_blog_label",
    "update",
    "服务器错误",
    `id='${id}'`,
    {
      title,
      orderNo,
      cover,
      type,
      parentId,
      image_url,
      remark,
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
 * 删除标签
 * @param req
 * @param res
 */
exports.delLabel = async (req, res) => {
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
  const LabelList = await DB(
    res,
    "sy_blog_label",
    "find",
    "服务器错误",
    `parentId=${id}`
  );
  let Label = [];
  LabelList.filter((ele) => {
    Label.push(ele.title);
  });

  if (LabelList[0]) {
    res.json({
      code: 403,
      message: `当前标签下存在【${Label}】，不能删除`,
      type: "success",
    });
    return;
  }
  const ret = await DB(
    res,
    "sy_blog_label",
    "delete",
    "服务器错误",
    `id='${id}'`
  );
  if (ret.affectedRows == 1) {
    res.json({
      code: 200,
      message: "删除成功",
      type: "success",
    });
  }
};

/**
 * 标签详情
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
    "sy_Label",
    "find",
    "服务器错误",
    `ID='${id}'`
  );
  res.json({
    code: 200,
    data: { ...bannerInfo[0] },
  });
};

/**
 * 标签列表 【tree】
 * @param req
 * @param res
 */
exports.labelTreeList = async (req, res) => {
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
    json: req.query.json,
    title: req.query.title || "",
    status: req.query.status || "",
    page: req.query.currentPage || 1,
    pageSize: req.query.pageSize || 10,
  };

  let bannerLen = await DB(
    res,
    "sy_blog_label",
    "find",
    "服务器出错",
    `status like '%${params.status}%' and title like '%${params.title}%' order by orderNo desc  `
  );
  let result = await DB(
    res,
    "sy_blog_label",
    "find",
    "服务器出错",
    `status=0 and title like '%${
      params.title
    }%'   order by orderNo desc limit ${(params.page - 1) * params.pageSize},${
      params.pageSize
    }`
  );
  result.forEach((v) => {
    v.value = v.id;
    v.label = v.title;
    v.image_url = [v.image_url];
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
  bannerLen.forEach((v) => {
    v.image_url = [v.image_url];
    v.cover = [v.cover];
    v.value = v.id + "";
    v.label = v.title;
    if (v.createTime) {
      v.createTime = rTime(timestamp(v.createTime));
    }
    if (v.updateTime) {
      v.updateTime = rTime(timestamp(v.updateTime));
    } else {
      delete v.updateTime;
    }
  });
  if (params.json == "tree") {
    res.json({
      code: 200,
      result: listToTree(bannerLen, "parentId"),
    });
  } else {
    res.json({
      code: 200,
      result: params.title == "" ? listToTree(bannerLen, "parentId") : result,
    });
  }
};

exports.labelList = async (req, res) => {
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
    parentCode: req.body.parentCode || "",
    status: 0,
  };

  let bannerLen = await DB(
    res,
    "sy_blog_label",
    "find",
    "服务器出错",
    `status=1  and parentId='${params.parentCode}' `
  );

  bannerLen.forEach((v) => {
    v.value = v.id + "";
    v.label = v.title;
    if (v.createTime) {
      v.createTime = rTime(timestamp(v.createTime));
    }
    if (v.updateTime) {
      v.updateTime = rTime(timestamp(v.updateTime));
    } else {
      delete v.updateTime;
    }
  });

  res.json({
    code: 200,
    result: bannerLen,
  });
};
