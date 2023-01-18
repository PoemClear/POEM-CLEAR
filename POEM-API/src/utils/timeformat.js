/**
 *
 * @param {*} s
 * @returns 数字补0
 */
function timeP(s) {
    return s < 10 ? '0' + s : s
}

/**
 *
 * @param {string} standardTime
 * @returns 标准时间转 年月日 时分秒
 */
function timestamp(standardTime) {
    let date = new Date(standardTime)
    const Y = date.getFullYear() + '-';
    const M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
    const D = date.getDate() < 10 ? '0' + date.getDate() + ' ' : date.getDate();
    const h = date.getHours() < 10 ? '0' + date.getHours() : date.getHours();
    const m = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()
    const s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds(); // 秒
    return Y + M + D + ' ' + h + ':' + m + ':' + s;

}

function rTime(date) {
    var json_date = new Date(date).toJSON();
    return new Date(+new Date(json_date) + 8 * 3600 * 1000).toISOString().replace(/T/g, '  ').replace(/\.[\d]{3}Z/, '')
}

function getDateString(timestamp) {
    let a = new Date(timestamp).getTime();
    const date = new Date(a);
    const Y = date.getFullYear() + '-';
    const M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
    const D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + '  ';
    const h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
    const m = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':';
    const s = (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()); // 秒
    const dateString = Y + M + D + h + m + s;
    // console.log('dateString', dateString); // > dateString 2021-07-06 14:23
    return dateString;
}

function getFormatMsgTime(stringTime) {
    let minute = 1000 * 60;
    let hour = minute * 60;
    let day = hour * 24;
    let week = day * 7;
    let month = day * 30;
    let year = month * 12;
    // 当前的时间戳
    let time1 = new Date().getTime();
    if (stringTime == null) {
        return;
    }
    // 如果是nui-app在手机端的话，时间格式是yyyy/MM/ss  所有需要替换一下
    stringTime = stringTime.replace(/-/g, '/');
    // 指定时间的时间戳
    let time2 = Date.parse(new Date(stringTime));
    let time = time1 - time2;
    let result = null;
    if (time < 0) {
        // 时间不能早于当前时间
        alert("-1");
    } else if (time / year >= 1) {
        result = parseInt(time / year) + "年前";
    } else if (time / month >= 1) {
        result = parseInt(time / month) + "月前";
    } else if (time / week >= 1) {
        result = parseInt(time / week) + "周前";
    } else if (time / day >= 1) {
        result = parseInt(time / day) + "天前";
    } else if (time / hour >= 1) {
        result = parseInt(time / hour) + "小时前";
    } else if (time / minute >= 1) {
        result = parseInt(time / minute) + "分钟前";
    } else {
        result = "刚刚发布！";
    }
    return result;
}

function formatToTree(ary, pid) {
    return ary
        .filter((item) =>
            // 如果没有父id（第一次递归的时候）将所有父级查询出来
            // 这里认为 item.parentId === 0 就是最顶层 需要根据业务调整
            pid === undefined ? item.parentDept === 0 : item.parentDept == pid
        )
        .map((item) => {
            // 通过父节点ID查询所有子节点
            item.children = formatToTree(ary, item.id);
            return item;
        });
}

function listToTree(data,pid) {
    let array = []
    data.forEach(item => { // 遍历对象数组
        item.children = data.filter(info => info[pid] == item.id)
        if(!item.children.length){
            delete item.children
        }
        // 找到每个对象的子节点
        if (item[pid] == 0) {
            array.push(item) // 将一层节点放入新数组中
        }
    })
    return array //循环结束，返回结果
}

function unique(arr) {
    let obj = {};
    arr = arr.reduce((newArr, next) => {
        obj[next.openid] ? "" : (obj[next.openid] = true && newArr.push(next));
        return newArr;
    }, []);
    return arr;
}
function uniqueNumber(arr) {
    if (!Array.isArray(arr)) {
        console.log('type error!')
        return
    }
    return Array.prototype.filter.call(arr, function(item, index){
        return arr.indexOf(item) === index;
    });
}
function listMockToTree(data,pid) {
    let array = []
    data.forEach(item => { // 遍历对象数组
        item.children = data.filter(info => info[pid] == item.id) // 找到每个对象的子节点
        if(!item.children.length){
            delete item.children
        }
        if(item.type==0&&item.isShow>0){
            if(item.children[0]){
                item.path=item.routePath
                item.name= item.menuName
                item.redirect=item.routePath +'/'+ item.children[0].routePath
                item.meta =  {title:item.name, icon:item.icon,orderNo:item.orderNo,hideChildrenInMenu:item.isShow==0?true:false}
            }else{
                item.path=item.routePath
                item.name= item.menuName
                item.redirect=item.routePath +'/index'
                item.meta =  {title:item.name, icon:item.icon,orderNo:item.orderNo,hideChildrenInMenu:item.isShow==0?true:false}
            }

        }if(item.type==1){
            item.path=item.routePath
            item.name= item.menuName
            item.component= item.component
            item.meta =  {title:item.name, icon:item.icon,hideMenu:item.isShow==0?true:false,ignoreKeepAlive:item.keepalive==1?true:false,orderNo:item.orderNo}
        }



        if (item[pid] === 0) {
            array.push(item) // 将一层节点放入新数组中
        }
    })
    return array //循环结束，返回结果
}

module.exports = {
    timeP,
    timestamp,
    getDateString,
    formatToTree, rTime,
    unique, listToTree, getFormatMsgTime,listMockToTree,uniqueNumber
}