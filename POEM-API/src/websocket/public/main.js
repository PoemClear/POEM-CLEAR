// 写上这一句话,客户端就已经连上服务器了,验证:http://127.0.0.1:3000/room.html,查看network,已经发送了一个ws请求了
const socket = io();

const inputContent = document.getElementById("inputContent");
const submitBtn = document.getElementById("submitBtn");
const msgContainer = document.getElementById("msg-container");
const msgContent = document.getElementById("msgContent");
const inlineD = document.getElementById("inlineCount");
const userListD = document.getElementById("userList");
const roomNameD = document.getElementById("roomName");
const outPageD = document.getElementById("outPage");

// 获取URL里面的姓名和房间
let queryString = window.location.search;
queryString = queryString.slice(1);
let obj = queryString.split("&").reduce((pre, cur) => {
  let [key, value] = cur.split("=");
  pre[key] = decodeURI(value);
  return pre;
}, {});

// 进入房间前将姓名和房间号发给服务器
socket.emit("inRoom", obj);

// 监听服务器返回的用户列表
socket.on("getusers", (users) => {
  inlineD.innerHTML = users.length || 0;
  renderUserList(users);
});

// 监听系统消息: xxx进入房间
socket.on("systemMsg", (user) => {
  roomNameD.innerText = user.room;
  let welcomeD = document.querySelector(".welcome");
  welcomeD.innerHTML = `欢迎【${user.name}】加入房间`;
  welcomeD.style.display = "block";
  setTimeout(() => {
    welcomeD.style.display = "none";
  }, 600);
});

socket.on("ownInfo", (own) => {
  window.sessionStorage.setItem("userId", own.id);
});

// 接收用户消息
socket.on("chatMsg", (msg) => {
  renderMsg(msg);
});

// 发消息
submitBtn.addEventListener("click", sendMsg);

inputContent.addEventListener("keyup", (e) => {
  var event = e || window.event;
  if (event.key === "Enter" || event.Code === "Enter" || event.keyCode === 13) {
    sendMsg();
  }
});

function sendMsg() {
  let msg = inputContent.value;
  if (!msg.trim()) {
    alert("请输入内容");
    return;
  }
  // 发消息
  const { name, room } = obj;
  let id = window.sessionStorage.getItem("userId");
  socket.emit("chatMsg", { id, name, room, msg, time: Date.now() });
  inputContent.value = "";
}

// 渲染消息message
function renderMsg(message) {
  let userid = window.sessionStorage.getItem("userId");
  const { id, name, room, msg, time } = message;
  if (userid === id) {
    // 我自己
    msgContent.innerHTML += `
    <li class="news-item d-flex flex-column align-items-end">
        <div class="w-75">
            <div class="time pt-1 ml-1 text-end mx-2">
                <span class="d-inline-block mx-2">${moment(time).format(
                  "YYYY-MM-DD HH:mm:ss"
                )}</span><span class="text-danger">我</span>
            </div>
            <p class="text-end">
                <span
                    class="text-start mx-2 bg-body mt-2 text-break shadow-lg d-inline-block p-2 rounded"
                    style="background-color:#9eea6a!important;">
                    ${msg}
                </span>
            </p>
        </div>
    </li>
    `;
  } else {
    // 别人
    msgContent.innerHTML += `
    <li class="news-item">
        <div class="w-75">
            <div class="time pt-1 ml-1 mx-2">
                <span class="d-inline-block me-2"><span class="text-danger">${name}</span></span></span><span>${moment(
      time
    ).format("YYYY-MM-DD HH:mm:ss")}</span>
            </div>
            <p class="bg-body mt-2 mx-2 shadow-lg text-break d-inline-block p-2 rounded">${msg}</p>
        </div>
    </li>
    `;
  }
  msgContainer.scrollTo(0, msgContent.scrollHeight);
}

// 渲染用户列表
function renderUserList(users) {
  let str = "";
  users.forEach((item) => (str += `<li class="p-1">${item.name}</li>`));
  userListD.innerHTML = str;
}

// 用户退出
outPageD.addEventListener("click", (e) => {
  e.preventDefault();
  window.location.replace("/index.html", "_self");
});
