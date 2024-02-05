/**
 * @description user APi 路由
 * @author 夜枫林
 */

const router = require('koa-router')()
const { isExist, register } = require('../../controller/userController')

router.prefix('/api/users')

router.post('/bar', function (ctx, next) {
    ctx.body = 'this is a users/bar response'
})

// 注册路由
router.post('/register', async (ctx, next) => {
    // 获取前端参数
    console.log(ctx.request.body);
    const { username, password, gender } = ctx.request.body
    // 调用 controller，返回
    ctx.body = await register({ username, password, gender })
})

// 用户名是否存在
router.post('/isExist', async function (ctx, next) {
    const { username } = ctx.request.body
    // 返回数据
    ctx.body = await isExist(username)
})

module.exports = router
