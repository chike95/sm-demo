
function hexToIp(hex) {
    const ip = [];
    for (let i = 0; i < 8; i += 2) {
        ip.push(parseInt(hex.substring(i, i + 2), 16));
    }
    return ip.join('.');
} const hex = 'c0a81e0a';
const ipAddress = hexToIp(hex);
console.log(ipAddress); // 输出：192.168.30.10