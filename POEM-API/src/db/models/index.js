const sy_users =
    `CREATE TABLE if not EXISTS sy_users(
    id int PRIMARY key auto_increment,
    username varchar(20) DEFAULT NULL,
    nickname varchar(20) DEFAULT NULL,
    realName varchar(20) DEFAULT NULL,
    phone varchar(11) DEFAULT NULL,
    password varchar(75) DEFAULT NULL,
    avatar varchar(225) DEFAULT NULL,
    email varchar(75) DEFAULT NULL,
    birthday datetime,
    age tinyint DEFAULT NULL,
    roleId  tinyint DEFAULT NULL,
    deptId  tinyint DEFAULT NULL,
    sex  tinyint DEFAULT NULL,
    remark varchar(55)  DEFAULT NULL,
    status tinyint DEFAULT 1,
    createTime datetime,
    updateTime datetime,
    lastLoginTime datetime)`;


const sy_bill =
    `CREATE TABLE if not EXISTS sy_bill(
  id int PRIMARY key auto_increment,
  name varchar(25)  NOT NULL,
  money varchar(255)  DEFAULT NULL,
  remark varchar(75)  DEFAULT NULL,
  createTime datetime,
  endTime datetime,
  expenseTime date,
  updateTime datetime)`;


const sy_bill_type =
    `CREATE TABLE if not EXISTS sy_bill_type(
  id int PRIMARY key auto_increment,
  name varchar(25)  NOT NULL,
  type varchar(25)  DEFAULT NULL,
  parentId varchar(25)  DEFAULT NULL,
  sort varchar(0)  DEFAULT NULL,
  remark varchar(75)  DEFAULT NULL,
  createTime datetime,
  updateTime datetime)`;

module.exports = {
    sy_users,
    sy_bill,
    sy_bill_type
}

