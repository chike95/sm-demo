/**
 * @description user controller
 * @author 夜枫林
 */

const { getUserInfo, createUser } = require('../service/user')
const md5Pwd = require('../utils/cryp')

/**
 * 注册用户
 * @param {string} userName 用户名
 * @param {string} password 密码 
 * @param {number} gender   性别（1男，2女，3苞米）
 */
async function register({ username, password, gender }) {
    const userInfo = await getUserInfo(username)
    if (userInfo) {
        return ("用户已存在")
    } else {
        let result = await createUser(
            {
                username,
                password: md5Pwd(password),
                gender
            })
        return ("用户创建成功")
    }
}

/**
 * 用户名是否存在
 * @param {string} userName 用户名
 */
async function isExist(username) {
    const userInfo = await getUserInfo(username)
    if (userInfo) {
        return (userInfo)
    } else {
        return ("用户不存在")
    }

}

module.exports = {
    register,
    isExist
}