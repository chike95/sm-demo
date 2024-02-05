/**
 * @description sequelize 实例
 * @author 夜枫林
 */

const Sequelize = require('sequelize')
const { MYSQL_CONF } = require('../conf/db')
const { host, user, password, database } = MYSQL_CONF

const conf = {
    host,
    dialect: 'mysql'
}

const seq = new Sequelize(database, user, password, conf)

module.exports = seq