const dgram = require('dgram')
const server = dgram.createSocket('udp4')


server.on('listening', () => {
    const address = server.address()

    console.log(`udp-Server running ${address.address}:${address.port}`)

    server.setBroadcast(true) // 开启广播模式

    // const message = Buffer.from('ff010102', 'hex');
    // server.send(message, 1500, '255.255.255.255')
})

server.on('message', (msg, remoteInfo) => {
    console.log(`server got msg from ${remoteInfo.address}:${remoteInfo.port}: ${msg.toString("hex")}`)
    server.send('world', remoteInfo.port, remoteInfo.address)
})

server.on('error', err => {
    console.log('server error', err)
})

server.bind(0, '192.168.30.100')