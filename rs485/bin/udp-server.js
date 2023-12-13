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

// server.on('message', (msg, remoteInfo) => {
//     console.log(`server got msg from ${remoteInfo.address}:${remoteInfo.port}: ${msg.toString("hex")}`)
//     remoteInfo.msg = msg.toString("hex");
//     // addEquipment(remoteInfo);
//     // console.log(equipmentArray);
//     server.send('world', remoteInfo.port, remoteInfo.address)
// })

server.on('error', err => {
    console.log('server error', err)
})

server.bind(UDP_PORT, UDP_HOST)


// 广播搜索设备
function getEquipment() {
    return new Promise((resolve, reject) => {
        const message = Buffer.from('ff010102', 'hex');
        server.send(message, 1500, '255.255.255.255');

        server.on('message', (msg, remoteInfo) => {
            remoteInfo.msg = msg.toString("hex");
            addEquipment(remoteInfo);
            console.log(equipmentArray);
            resolve(equipmentArray);
        });
    });
}

function getArgument() {
    return new Promise((resolve, reject) => {
        const message = Buffer.from('ff010102', 'hex');
        server.send(message, 1500, '255.255.255.255');

        server.on('message', (msg, remoteInfo) => {
            remoteInfo.msg = msg.toString("hex");
            addEquipment(remoteInfo);
            console.log(equipmentArray);
            resolve(equipmentArray);
        });
    });
}

// // 添加设备
function addEquipment(dev) {
    const index = equipmentArray.findIndex(item => item.address === dev.address && item.port === dev.port && dev.msg);
    if (index !== -1) {
        equipmentArray.splice(index, 1); // 删除已存在的设备
    }
    equipmentArray.push(dev); // 添加设备到列表
}



module.exports = {
    equipmentArray: equipmentArray,
    getEquipment: getEquipment,
    getArgument: getArgument,
    addEquipment: addEquipment,
}
