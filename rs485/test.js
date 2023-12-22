function computeCrcSum(hexString) {
    // 去除字符串中的空格
    const hexStringWithoutSpace = hexString.replace(/\s/g, "");
    // 将字符串转换为十六进制数组
    const hexArray = hexStringWithoutSpace.match(/.{2}/g).map(str => parseInt(str, 16));
    // 计算所有值的和
    const sum = hexArray.reduce((acc, cur) => acc + cur);
    // 转换为十六进制形式并输出后两位
    console.log(sum.toString(16).toUpperCase().slice(-2));
    return sum.toString(16).toUpperCase().slice(-2);
}
computeCrcSum("1303D4AD203B491761646D696E0061646D696E00")
