
/****************************** udp **********************************/
const dgram = require('dgram')
const server = dgram.createSocket('udp4')

// udp服务：端口0-随机
const UDP_PORT = "0";
const UDP_HOST = "192.168.30.100"

let equipmentArray = [];

server.on('listening', () => {
    const address = server.address()

    console.log(`udp-Server running ${address.address}:${address.port}`)

    server.setBroadcast(true) // 开启广播模式

    // const message = Buffer.from('ff010102', 'hex');
    // server.send(message, 1500, '255.255.255.255')
})

// 监听 'message' 事件，处理接收到的消息
// socket.on('message', (msg, rinfo) => {
//     // 打印接收到的消息和发送者信息
//     console.log(`received message from ${rinfo.address}:${rinfo.port}: ${msg}`);
// });

server.on('error', err => {
    console.log('server error', err)
})

server.bind(UDP_PORT, UDP_HOST)



/******************************  **********************************/
// 4.3 广播搜索设备
function getEquipment() {
    return new Promise((resolve, reject) => {
        const message = Buffer.from('ff010102', 'hex');
        server.send(message, 1500, '255.255.255.255');

        server.on('message', (msg, remoteInfo) => {
            remoteInfo.msg = msg.toString("hex");
            addEquipment(remoteInfo);
            // console.log(equipmentArray);
            resolve(equipmentArray);
        });
    });
}

// 添加设备
function addEquipment(dev) {
    const index = equipmentArray.findIndex(item => item.address === dev.address && item.msg === dev.msg);
    if (index !== -1) {
        equipmentArray.splice(index, 1); // 删除已存在的设备
    }
    equipmentArray.push(dev); // 添加设备到列表
}

// 5.3 获取参数
function getArgument(macAddress) {
    let str = "1303" + macAddress + "61646D696E0061646D696E00";
    console.log(str);
    let order = "ff" + str + computeCrcSum(str);
    console.log(order);
    const message = Buffer.from(order, 'hex');
    console.log(message);

    return new Promise((resolve, reject) => {
        // 注册message事件监听器，并封装成Promise对象
        server.once('message', (msg, remoteInfo) => {
            if (remoteInfo.msg.length === 260) {
                const argument = {};
                argument.addr = remoteInfo.address;
                argument.msg = msg.toString("hex");
                resolve(argument);
            }
        });

        server.send(message, 1500, '255.255.255.255', (err) => {
            if (err) {
                reject(err);
            }
        });
    });
}

// 添加参数
// function addArgument(argument) {
//     const index = argumentArray.findIndex(item => item.addr === argument.addr && item.port === argument.port && argument.msg);
//     if (index !== -1) {
//         argumentArray.splice(index, 1); // 删除已存在的设备
//     }
//     argumentArray.push(argument); // 添加设备到列表
// }


// 计算校验和
function computeCrcSum(hexString) {
    // 去除字符串中的空格
    const hexStringWithoutSpace = hexString.replace(/\s/g, "");
    // 将字符串转换为十六进制数组
    const hexArray = hexStringWithoutSpace.match(/.{2}/g).map(str => parseInt(str, 16));
    // 计算所有值的和
    const sum = hexArray.reduce((acc, cur) => acc + cur);
    // 转换为十六进制形式并输出后两位
    // console.log(sum.toString(16).toUpperCase().slice(-2));
    return sum.toString(16).toUpperCase().slice(-2);
}
computeCrcSum("FF13039ca525a3fe3861646D696E0061646D696E00")
module.exports = {
    equipmentArray: equipmentArray,
    getEquipment: getEquipment,
    getArgument: getArgument,
    addEquipment: addEquipment,
}
