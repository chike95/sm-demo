/**
 * @description 环境变量
 * @author 夜枫林
 */

const ENV = process.env.NODE_ENV

module.exports = {
    isDEV: ENV === 'dev',
    notDev: ENV !== 'dev',
    isProduct: ENV === 'production',
    notProduct: ENV !== 'production',
    isTest: ENV === 'test',
    notTest: ENV !== 'test'
}