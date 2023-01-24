const { rTime, timestamp, listToTree } = require("../../../utils/timeformat");
const DB = require("../../../db");
const jwt = require("jsonwebtoken");
const config = require("../../../config");

/**
 * 创建标签
 * @param req
 * @param res
 */
exports.createDict = async (req, res) => {
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
  const { label, orderNo, value = "", parentId = 0, status } = req.body;
  /**如果当前标签跳转链接不存在 就去新增*/
  let type = 1
  if (parentId == '0') {
    type = 1;
  } else {
    type = 2;
  }
  const ret = await DB(res, "sy_dict", "insert", "服务器错误", {
    label,
    value,
    type,
    orderNo,
    status,
    parentId,
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
exports.updateDict = async (req, res) => {
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
    label,
    orderNo,
    value = "",
    type,
    parentId = 0,
    status,
  } = req.body;
  if (parentId == 0) {
    type = 1;
  } else {
    type = 2;
  }
  const ret = await DB(res, "sy_dict", "update", "服务器错误", `id='${id}'`, {
    label,
    orderNo,
    type,
    value,
    orderNo,
    parentId,
    status,
    updateTime: rTime(timestamp(new Date())),
  });

  if (ret.affectedRows == 1) {
    res.json({
      code: 200,
      message: "修改成功",
    });
  } else {
    res.json({
      code: 403,
      message: "修改失败",
    });
  }
};

/**
 * 删除标签
 * @param req
 * @param res
 */
exports.delDict = async (req, res) => {
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
    "sy_dict",
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
  const ret = await DB(res, "sy_dict", "delete", "服务器错误", `id='${id}'`);
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
exports.dictTreeList = async (req, res) => {
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
    value: req.query.value || "",
    label: req.query.label || "",
    status: req.query.status || "",
    page: req.query.currentPage || 1,
    pageSize: req.query.pageSize || 10,
  };

  let bannerLen = await DB(
    res,
    "sy_dict",
    "find",
    "服务器出错",
    `status like '%${params.status}%' and label like '%${params.label}%' and value like '%${params.value}%' order by orderNo desc  `
  );
  let result = await DB(
    res,
    "sy_dict",
    "find",
    "服务器出错",
    `status like '%${params.status}%' and label like '%${
      params.label
    }%'  and value like '%${params.value}%'  order by orderNo desc limit ${
      (params.page - 1) * params.pageSize
    },${params.pageSize}`
  );

  result.forEach((v) => {
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
      result: params.label == "" ? listToTree(bannerLen, "parentId") : result,
    });
  }
};

exports.dictList = async (req, res) => {
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
    value: req.body.value || "",
  };

  let bannerLen = await DB(
    res,
    "sy_dict",
    "find",
    "服务器出错",
    `status=1 and value='${params.value}'  or parentId='${params.parentCode}' `
  );

  bannerLen.forEach((v) => {
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
