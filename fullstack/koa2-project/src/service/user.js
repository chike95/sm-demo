/**
 * @description user service
 * @author 夜枫林
 */

const { User } = require('../db/models/index')

/**
 * 
 * @param {string} userName 用户名
 * @param {string} password 密码
 * @param {number} gender 性别
 */
async function createUser({ username, password, gender = 3, nickname }) {
    // 创建用户
    const result = await User.create({
        username,
        password,
        gender,
        nickname: nickname ? nickname : username
    })

    return result.dataValues
}


/**
 * 获取用户信息
 * @param {string} username 用户名
 * @param {string} password 密码
 */
async function getUserInfo(username, password) {
    // 查询条件
    let whereOpt = {
        username
    }
    if (password) {
        Object.assign(whereOpt, { password })
    }
    // 查询用户信息
    const result = await User.findOne({
        attributes: ['id', 'username', 'nickname', 'gender', 'picture', 'city'],
        where: whereOpt
    })

    // 未找到
    if (result == null) {
        return result
    }

    return result.dataValues
}

module.exports = {
    createUser,
    getUserInfo
}