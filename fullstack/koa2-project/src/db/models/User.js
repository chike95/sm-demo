/**
 * @description 用户数据模型
 * @author 夜枫林
 */

const seq = require('../seq')
const { STRING, DECIMAL } = require('../types')

const User = seq.define('user', {
    username: {
        type: STRING,
        allowNull: false,
        unique: true,
        comment: '用户名，唯一'
    },
    password: {
        type: STRING,
        allowNull: false,
        comment: '密码'
    },
    nickname: {
        type: STRING,
        allowNull: false,
        comment: '昵称，默认用户名'
    },
    gender: {
        type: DECIMAL,
        allowNull: false,
        defaultValue: 3,
        comment: '性别，1男性，2女性 3保密',
    },
    picture: {
        type: STRING,
        defaultValue: '/images/default.png',
        comment: '用户头像，图片url',
    },
    city: {
        type: STRING,
        comment: '用户所在城市',
    }
})

module.exports = User