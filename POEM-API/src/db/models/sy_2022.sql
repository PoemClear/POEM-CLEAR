/*
Navicat MySQL Data Transfer

Source Server         : localhost_3306
Source Server Version : 80030
Source Host           : localhost:3306
Source Database       : sy_2022

Target Server Type    : MYSQL
Target Server Version : 80030
File Encoding         : 65001

Date: 2022-09-15 07:12:58
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for sy_bill
-- ----------------------------
DROP TABLE IF EXISTS `sy_bill`;
CREATE TABLE `sy_bill` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(25) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `money` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `remark` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `createTime` datetime DEFAULT NULL,
  `endTime` datetime DEFAULT NULL,
  `updateTime` datetime DEFAULT NULL,
  `userId` int NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_bin;

-- ----------------------------
-- Records of sy_bill
-- ----------------------------
INSERT INTO `sy_bill` VALUES ('1', '工资', '11453.17', '发工资了，好高兴', '2022-09-13 21:36:42', null, null, '1');
INSERT INTO `sy_bill` VALUES ('2', '发红包', '-300', '还杨寒300大洋', '2022-09-13 21:46:04', null, null, '1');
INSERT INTO `sy_bill` VALUES ('4', '餐饮', '-9', '下午买了烤冷面', '2022-09-13 23:26:52', null, null, '1');
INSERT INTO `sy_bill` VALUES ('5', '餐饮', '-14', '晚上下班回来买了一大袋酸奶', '2022-09-13 23:27:24', null, null, '1');
INSERT INTO `sy_bill` VALUES ('6', '餐饮', '-8.5', '早上我买了早餐', '2022-09-13 23:31:43', null, null, '1');
INSERT INTO `sy_bill` VALUES ('7', '理财', '0', '测试', '2022-09-14 00:05:03', null, null, '1');
INSERT INTO `sy_bill` VALUES ('8', '理财', '-2', '玩儿', '2022-09-14 00:06:07', null, null, '1');
INSERT INTO `sy_bill` VALUES ('9', '餐饮', '12', '2', '2022-09-15 05:32:24', null, null, '2');

-- ----------------------------
-- Table structure for sy_bill_type
-- ----------------------------
DROP TABLE IF EXISTS `sy_bill_type`;
CREATE TABLE `sy_bill_type` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(25) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `type` varchar(25) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `parentId` varchar(25) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `sort` varchar(0) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `remark` varchar(55) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_bin DEFAULT NULL,
  `createTime` datetime DEFAULT NULL,
  `updateTime` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_bin ROW_FORMAT=DYNAMIC;

-- ----------------------------
-- Records of sy_bill_type
-- ----------------------------
INSERT INTO `sy_bill_type` VALUES ('1', '支出', '2', '0', null, null, null, null);
INSERT INTO `sy_bill_type` VALUES ('2', '餐饮', '3', '1', null, null, null, null);
INSERT INTO `sy_bill_type` VALUES ('3', '交通', '3', '1', null, null, null, null);
INSERT INTO `sy_bill_type` VALUES ('4', '入账', '2', '0', null, null, null, null);
INSERT INTO `sy_bill_type` VALUES ('5', '工资', '3', '4', null, null, null, null);
INSERT INTO `sy_bill_type` VALUES ('6', '不计入收支', '2', '0', null, null, null, null);
INSERT INTO `sy_bill_type` VALUES ('7', '理财', '3', '6', null, null, null, null);
INSERT INTO `sy_bill_type` VALUES ('8', '借还款', '3', '6', null, null, null, null);
INSERT INTO `sy_bill_type` VALUES ('9', '其他', '3', '6', null, null, null, null);
INSERT INTO `sy_bill_type` VALUES ('10', '发红包', '3', '1', null, null, null, null);
INSERT INTO `sy_bill_type` VALUES ('11', '交公', '3', '1', null, null, null, null);

-- ----------------------------
-- Table structure for sy_users
-- ----------------------------
DROP TABLE IF EXISTS `sy_users`;
CREATE TABLE `sy_users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `nickname` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `realName` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `phone` varchar(11) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `password` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `avatar` varchar(225) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `email` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `birthday` datetime DEFAULT NULL,
  `age` tinyint DEFAULT NULL,
  `roleId` tinyint DEFAULT NULL,
  `deptId` tinyint DEFAULT NULL,
  `sex` tinyint DEFAULT NULL,
  `remark` varchar(55) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `status` tinyint DEFAULT '1',
  `createTime` datetime DEFAULT NULL,
  `updateTime` datetime DEFAULT NULL,
  `lastLoginTime` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_bin;

-- ----------------------------
-- Records of sy_users
-- ----------------------------
INSERT INTO `sy_users` VALUES ('1', 'super', '十年九夏', 'SY-SUPER-ADMIN', '19525492954', '316c866dd34edcdbcf65df9bb101ed21', 'https://vkceyugu.cdn.bspapp.com/VKCEYUGU-26b0e382-11f9-41c9-b312-53cc542848e4/7a11c35d-89fc-40e5-a395-5439dac2b10d.jpg', 'sy202204151343@163.com', null, null, '1', '1', '2', '我是超级管理员', '1', '2022-09-12 20:14:13', '2022-09-12 21:52:13', '2022-09-15 06:01:32');
INSERT INTO `sy_users` VALUES ('2', 'test', '宝儿姐', 'SY-TEST', '13000000000', '330119231885c13962f4358bed351a4b', 'https://vkceyugu.cdn.bspapp.com/VKCEYUGU-26b0e382-11f9-41c9-b312-53cc542848e4/7a11c35d-89fc-40e5-a395-5439dac2b10d.jpg', '13000000000@163.com', null, null, '3', '1', '1', '我是打工人', '1', '2022-09-12 21:06:09', '2022-09-12 21:35:00', '2022-09-15 05:26:16');
INSERT INTO `sy_users` VALUES ('3', 'admin', 'fluorescence', 'SY-ADMIN', '19900000000', '330119231885c13962f4358bed351a4b', 'https://vkceyugu.cdn.bspapp.com/VKCEYUGU-26b0e382-11f9-41c9-b312-53cc542848e4/7a11c35d-89fc-40e5-a395-5439dac2b10d.jpg', '2426822452@qq.com', null, null, '2', '1', '2', '我是管理员', '1', '2022-09-12 21:39:03', '2022-09-12 21:52:00', '2022-09-15 04:53:40');
