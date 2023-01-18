const db = require("./nodejs-orm")
// const chalk = require("chalk");
// let errlog = (message) => console.log(chalk.red(`${message}`));

async function HandleDB(res, tableName, methodName, errMsg, n1, n2){

    let Model = db.model(tableName);
    let result
    try{
        result = await new Promise((resolve, reject)=>{
            if(!n1){
                // 表示n1n2参数也没有传
                Model[methodName]((err, data)=>{
                    if(err)reject(err);
                    resolve(data);
                })
                return
            }

            // 程序能够执行到这里，说明n1已经有了
            if(!n2){
                // 没有传递n2
                Model[methodName](n1, (err, data)=>{
                    if(err)reject(err);
                    resolve(data);
                })
                return
            }

            // 程序能够执行这里， 说明n1, n2都传了
            Model[methodName](n1,n2, (err, data)=>{
                if(err)reject(err);
                resolve(data);
            })


        })
    }catch(err){
        console.log(err.sqlMessage);
        res.json({code:500,message:errMsg})  // 通知前端出现异常
        return
    }


    return result


}


module.exports = HandleDB