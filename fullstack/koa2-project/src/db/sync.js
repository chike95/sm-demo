/**
 * @description sequelize 同步数据库
 * @author 夜枫林
 */

const seq = require('./seq')

// sequelize 连接测试
seq.authenticate().then(() => {
    console.log('mysql 数据库连接成功');
}).catch(() => {
    console.log('mysql 数据库连接成功');
})

// 执行同步
seq.sync({ force: true }).then(() => {
    console.log('mysql 数据库同步成功');
    process.exit()
}) 