/**
 * @description 存储配置
 * @author 夜枫林
 */

const { isPro } = require('../utils/env')

// 本地 mysql 配置
let MYSQL_CONF = {
    host: 'localhost',
    user: 'root',
    password: '',
    port: '3306',
    database: 'full_stack_db'
}

if (isPro) {
    // 线上 mysql 配置
    MYSQL_CONF = {

    }
}


module.exports = {
    MYSQL_CONF
}