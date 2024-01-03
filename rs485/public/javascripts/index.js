// 设备列表
function addTableData(equipment, index) {
    console.log(equipment);
    // 创建 tbody 元素
    const tbody = document.createElement('tbody');
    tbody.className = `equipment-table-item equipment-table-item${index}`;
    tbody.id = equipment.msg.substring(18, 30);     // MAC地址作为id

    // 创建 tr 元素
    const tr = document.createElement('tr');

    // 创建 td 元素，设置其 innerText 属性并添加到 tr 中
    const td1 = document.createElement('td');
    td1.innerText = equipment.Client_IP_address;
    tr.appendChild(td1);

    const td2 = document.createElement('td');
    td2.innerText = hexToAscii(equipment.msg.substring(38, 66));
    tr.appendChild(td2);

    const td3 = document.createElement('td');
    td3.innerText = equipment.msg.substring(18, 30).toUpperCase().replace(/(.{2})/g, "$1 ");
    tr.appendChild(td3);

    const td4 = document.createElement('td');
    td4.innerText = equipment.msg.substring(30, 36);
    tr.appendChild(td4);

    // 将 tr 添加到 tbody 中
    tbody.appendChild(tr);

    // 将 tbody 添加到表格中
    const devTable = document.getElementById('dev-table');
    devTable.appendChild(tbody);
}

// 清空列表
function clearTable() {
    const devTable = document.getElementById('dev-table');
    while (devTable.rows.length > 1) {
        devTable.deleteRow(1);
    }
}

// 设备参数
function setFieldValue(element, value, disabled) {
    element.value = value;
    element.disabled = disabled;
}

function addInputData(data) {
    console.log(data.argument.msg.substring(42, 70));

    var fields = [
        { id: 'eq-ip-type', value: '静态ip', disabled: true },
        { id: 'eq-ip', value: hexToIp(data.argument.msg.substring(18, 26)), disabled: false },
        { id: 'eq-mask', value: hexToIp(data.argument.msg.substring(34, 42)), disabled: false },
        { id: 'eq-gateway', value: hexToIp(data.argument.msg.substring(26, 34)), disabled: false },
        { id: 'eq-dns', value: hexToIp(data.argument.msg.substring(118, 126)), disabled: false },
        { id: 'eq-mac', value: data.argument.msg.substring(106, 118).toUpperCase().replace(/(.{2})/g, "$1 "), disabled: true },
        { id: 'eq-restart_time', value: '3600', disabled: true },

        { id: 'eq-http-port', value: '80', disabled: true },
        { id: 'eq-user', value: hexToAscii(data.argument.msg.substring(74, 86)), disabled: true },
        { id: 'eq-password', value: hexToAscii(data.argument.msg.substring(86, 98)), disabled: true },
        { id: 'eq-name', value: hexToAscii(data.argument.msg.substring(42, 70)), disabled: true },

        { id: 'eq-verify', value: data.argument.msg.substring(98, 106), disabled: true },
        { id: 'eq-work-type', value: 'TCP Client', disabled: true },
        { id: 'eq-remote-addr', value: hexToIp(data.argument.msg.substring(226, 234)), disabled: false },
        { id: 'eq-short-link', value: '3', disabled: true },

        { id: 'eq-baud', value: hexToDecimalString(reverseHexString(data.argument.msg.substring(134, 142))), disabled: false },
        { id: 'eq-local-port', value: parseInt(reverseEndian(data.argument.msg.substring(158, 162)), 16), disabled: false },
        { id: 'eq-remote-port', value: parseInt(reverseEndian(data.argument.msg.substring(162, 166)), 16), disabled: false },
        { id: 'eq-tcp-links', value: '4', disabled: true }
    ];

    fields.forEach(function (field) {
        var element = document.getElementById(field.id);
        setFieldValue(element, field.value, field.disabled);
    });
}
// 获取设备数据
function getData() {
    var httpRequest = new XMLHttpRequest();
    httpRequest.onreadystatechange = function () {
        if (httpRequest.readyState === 4) {
            // 删除table里的旧数据（根据类名来找到那些元素）
            var tableItems = document.getElementsByClassName("equipment-table-item");
            Array.from(tableItems).forEach(function (item) {
                item.remove();
            });

            var responseData = JSON.parse(httpRequest.responseText);
            // console.log(responseData);
            responseData.forEach((equipment, index) => {
                // 给table 添加新数据
                addTableData(equipment, index);
                // out(equipment.msg)
            });

            out("指令发送成功 -> FF010102");
            out("点击搜到的设备可读取参数");

            // 添加获取参数事件
            bindClickEvent();
        }
    };
    httpRequest.open('GET', '/equipmentArray');
    httpRequest.send();

}

// 绑定点击事件
document.getElementById('searchBtn').addEventListener('click', getData);

// 绑定点击事件到设备项
function bindClickEvent() {
    var equipments = document.getElementsByClassName('equipment-table-item');
    console.log(equipments);

    const selectedClassName = 'selected';
    Array.from(equipments).forEach(function (item, index) {
        item.addEventListener('click', getArgument);
    });

    Array.from(equipments).forEach((tbody) => {
        tbody.addEventListener('click', () => {
            // 将当前 tbody 的 class 修改为 selected
            tbody.classList.add(selectedClassName);

            // 将其他 tbody 的 class 修改为初始值
            const otherTbodyList = Array.from(equipments).filter((t) => t !== tbody);
            otherTbodyList.forEach((otherTbody) => {
                otherTbody.classList.remove(selectedClassName);
            });

            // 将当前 tbody 下的所有 tr 添加 selected 类名和修改 id
            const trList = tbody.querySelectorAll('tr');
            trList.forEach((tr, index) => {
                tr.id = 'selected';
            });

            // 将其他 tbody 下的所有 tr 移除 selected 类名和恢复原始 id
            otherTbodyList.forEach((otherTbody) => {
                const otherTrList = otherTbody.querySelectorAll('tr');
                otherTrList.forEach((tr, index) => {
                    tr.id = `tr-${index + 1}`;
                });
            });
        });
    });
}

// 获取参数请求
function getArgument() {
    var mac = this.id;
    var url = '/argument?mac=' + encodeURIComponent(mac);

    var httpRequest = new XMLHttpRequest();
    httpRequest.onreadystatechange = function () {
        if (httpRequest.readyState === 4) {
            var argumentData = JSON.parse(httpRequest.responseText);
            console.log(argumentData);

            addInputData(argumentData);
            out("参数接收成功");
            out("192.168.30.100 <- " + argumentData.argument.addr) //argumentData.argument.msg

            // 绑定：保存参数
            document.getElementById('saveBtn').addEventListener('click', postData);

        }
    };
    httpRequest.open('GET', url);
    httpRequest.send();
}

document.getElementById('saveBtn').addEventListener('click', postData);

// function postData() {
//     var base_order = '';
//     var serial_order = '';
//     var obj = [];
//     obj.str0 = 'FF 56 05';
//     //  D4 AD 20 3B 49 17 61 64 6D 69 6E 00 61 64 6D 69 6E 00 95 63 03 C0 00 00 50 00 00';
//     obj.ip = ipToHex(document.getElementById('eq-ip').value);
//     obj.mask = ipToHex(document.getElementById('eq-mask').value);
//     obj.getway = ipToHex(document.getElementById('eq-gateway').value);
//     obj.name = asciiToHex(document.getElementById('eq-name').value);
//     obj.user = asciiToHex(document.getElementById('eq-user').value, 12);
//     obj.password = asciiToHex(document.getElementById('eq-password').value, 12);
//     // obj.str1 = '00 01 00 A0';
//     obj.mac = document.getElementById('eq-mac').value;
//     obj.dns = ipToHex(document.getElementById('eq-dns').value);
//     // obj.str2 = '03 00 00 00';
//     obj.baud = reverseHexString(decimalToHex(document.getElementById('eq-baud').value));
//     // obj.str3 = '08 01 01 01 01 00 00 00 00';
//     obj.local_port = swapHexChar(parseInt(document.getElementById('eq-local-port').value, 10).toString(16));
//     obj.remote_port = swapHexChar(parseInt(document.getElementById('eq-remote-port').value, 10).toString(16));
//     obj.remote_addr = convertIpToAsciiHex(document.getElementById('eq-remote-addr').value);


//     // 基础配置指令
//     obj.str = 'FF'
//     obj.str0 = '56 05';
//     obj.str1 = '95 63 03 C0 00 00 50 00 00';
//     obj.str2 = '00 00';
//     obj.str3 = '00 01 00 a4'
//     obj.str4 = ' DE DE 43 D0 03 00 00 00'

//     var order1 = obj.str0 + obj.mac + obj.user + obj.password + obj.str1 + obj.ip + obj.getway + obj.mask + obj.name + obj.str2 + obj.user + obj.password + obj.str3 + obj.mac + obj.str4;
//     console.log(order1);
//     base_order = obj.str + order1 + computeCrcSum(order1);

//     // 串口配置指令
//     obj.str5 = '52 06';
//     obj.str6 = '08 01 01 01 00 00 00 00';
//     obj.str7 = '5F 5F 5F 5F 43 01 00 04 43 41 00 00 00 00 00 00 00';
//     var order2 = obj.str5 + obj.mac + obj.user + obj.password + obj.baud + obj.str6 + obj.local_port + obj.remote_port + obj.remote_addr + obj.str7;

//     serial_order = obj.str + order2 + computeCrcSum(order2);
//     console.log(serial_order);

//     // 去除空格，转大写
//     base_order = base_order.replace(/\s/g, "").toUpperCase();
//     serial_order = serial_order.replace(/\s/g, "").toUpperCase();

//     var httpRequest = new XMLHttpRequest();
//     httpRequest.onreadystatechange = function () {
//         if (httpRequest.readyState === 4) {
//             var argumentData = JSON.parse(httpRequest.responseText);
//             clearTable();

//             // var selectedObj = document.getElementById("selected");
//             // console.log(selectedObj.getElementsByTagName("tr")[0]);
//             // // selectedObj.getElementsByTagName("tr")[0].textContent = '123';
//             // selectedObj.innerHTML = argumentData.title;

//             // // 刷新设备列表
//             // getData();
//             out(argumentData.title);
//         }
//     };

//     httpRequest.open('Post', '/settings');
//     httpRequest.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
//     httpRequest.send(JSON.stringify({ base_order: base_order, serial_order: serial_order, mac: obj.mac })); // 发送请求及参数
// }

function postData() {
    var obj = {
        str: 'FF',
        str0: '56 05',
        ip: ipToHex(document.getElementById('eq-ip').value),
        mask: ipToHex(document.getElementById('eq-mask').value),
        gateway: ipToHex(document.getElementById('eq-gateway').value),
        name: asciiToHex(document.getElementById('eq-name').value),
        user: asciiToHex(document.getElementById('eq-user').value, 12),
        password: asciiToHex(document.getElementById('eq-password').value, 12),
        mac: document.getElementById('eq-mac').value,
        dns: ipToHex(document.getElementById('eq-dns').value),
        baud: reverseHexString(decimalToHex(document.getElementById('eq-baud').value)),
        local_port: swapHexChar(parseInt(document.getElementById('eq-local-port').value, 10).toString(16)),
        remote_port: swapHexChar(parseInt(document.getElementById('eq-remote-port').value, 10).toString(16)),
        remote_addr: convertIpToAsciiHex(document.getElementById('eq-remote-addr').value),
    };

    // 基础配置指令
    var baseOrder = `${obj.str} ${obj.str0} ${obj.mac} ${obj.user} ${obj.password} 95 63 03 C0 00 00 50 00 00 ${obj.ip} ${obj.gateway} ${obj.mask} ${obj.name} 00 00 ${obj.user} ${obj.password} 00 01 00 a4 DE DE 43 D0 03 00 00 00`;
    console.log(baseOrder);

    // 串口配置指令
    var serialOrder = `${obj.str} 52 06 ${obj.mac} ${obj.user} ${obj.password} ${obj.baud} 08 01 01 01 00 00 00 00 ${obj.local_port} ${obj.remote_port} ${obj.remote_addr} 5F 5F 5F 5F 43 01 00 04 43 41 00 00 00 00 00 00 00`;
    console.log(serialOrder);

    // 去除空格，转大写
    baseOrder = baseOrder.replace(/\s/g, "").toUpperCase();
    serialOrder = serialOrder.replace(/\s/g, "").toUpperCase();

    var httpRequest = new XMLHttpRequest();
    httpRequest.onreadystatechange = function () {
        if (httpRequest.readyState === 4) {
            var argumentData = JSON.parse(httpRequest.responseText);
            clearTable();
            out(argumentData.title);
        }
    };

    httpRequest.open('Post', '/settings');
    httpRequest.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
    httpRequest.send(JSON.stringify({ base_order: baseOrder, serial_order: serialOrder, mac: obj.mac }));
}


/******************************************* 进制转换 **********************************************/
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
//高低位交换（16进制字符串）
function swapHexChar(hexString) {
    while (hexString.length < 4) {
        hexString = "0" + hexString;
    }

    var swappedHexString = "";
    for (var i = hexString.length - 2; i >= 0; i -= 2) {
        swappedHexString += hexString.charAt(i) + hexString.charAt(i + 1);
    }

    return swappedHexString;
}

function hexToChars(hexStr) {
    let bytes = hexStr.replace(/\s/g, '').split('');
    let chars = bytes.map(byte => String.fromCharCode(parseInt(byte, 16)));
    return chars.join('');
}



function hexToAscii(hexString) {
    // 去除尾部 0
    while (hexString.slice(-2) === '00') {
        hexString = hexString.slice(0, -2);
    }

    let asciiString = '';
    for (let i = 0; i < hexString.length; i += 2) {
        const hex = hexString.substr(i, 2);
        const decimal = parseInt(hex, 16); // 将十六进制转换为十进制
        asciiString += String.fromCharCode(decimal); // 将十进制转换为字符
    }
    return asciiString;
}

function asciiToHex(asciiString, length) {
    let hexString = '';
    for (let i = 0; i < asciiString.length; i++) {
        const charCode = asciiString.charCodeAt(i);
        const hex = charCode.toString(16).padStart(2, '0'); // 将十进制转换为两位的十六进制
        hexString += hex;
    }

    while (hexString.length < length) {
        hexString += '00';
    }

    return hexString;
}

// 反转hex字符串
function reverseHexString(hexString) {
    var reversedHexString = "";
    for (var i = 0; i < hexString.length; i += 2) {
        reversedHexString = hexString.substr(i, 2) + reversedHexString;
    }
    return reversedHexString;
}

// 高低位互换
function reverseEndian(hexString) {
    var result = '';
    // 补零位数
    var zeroPadding = '';

    if (hexString.length % 2 !== 0) {
        zeroPadding = '0' + result.substr(0, 1);
        result = result.substr(1);
    }

    for (var i = hexString.length - 2; i >= 0; i -= 2) {
        result += hexString.substr(i, 2);
    }
    return result;
}

// addTableData-ip
function hexToIp2(hex) {
    const ip = [];
    for (let i = 0; i < 8; i += 2) {
        ip.push(parseInt(hex.substring(i, i + 2), 16));
    }
    return ip.join('.');
}


function hexToIp(hexString) {
    var ip = [];
    // 高低位互换
    var reversedHexString = reverseEndian(hexString);
    for (var i = 0; i < reversedHexString.length; i += 2) {
        var hex = reversedHexString.substr(i, 2);
        var decimal = parseInt(hex, 16);
        ip.push(decimal);
    }
    return ip.join(".");
}

function ipToHex(ipAddress) {
    var hexString = "";
    var octets = ipAddress.split(".");
    // 将每个八位的十进制数转换为两位的十六进制数
    for (var i = 0; i < octets.length; i++) {
        var hex = parseInt(octets[i]).toString(16);
        if (hex.length === 1) {
            hex = "0" + hex;
        }
        hexString += hex;
    }
    // 反转字节序
    return reverseEndian(hexString);
}


// 10进制转16进制
// function decimalToReversedHex(decimalNumber) {
//     // 转换为十六进制字符串
//     var hexString = decimalNumber.toString(16);
//     // 如果字符串长度不是偶数，向前补零
//     if (hexString.length % 2 !== 0) {
//         hexString = '0' + hexString;
//     }
//     // 反转字节序列
//     var reversedHexString = '';
//     for (var i = hexString.length - 2; i >= 0; i -= 2) {
//         reversedHexString += hexString.substr(i, 2);
//     }
//     return reversedHexString;
// }

// 目标ip转换
function convertIpToAsciiHex(ip) {
    var ipChars = ip.split('');
    var ipAsciiHex = '';

    for (var i = 0; i < ipChars.length; i++) {
        var char = ipChars[i];
        var ascii = char.charCodeAt(0);
        var hex = ascii.toString(16).toUpperCase();
        ipAsciiHex += hex;
    }

    ipAsciiHex = ipAsciiHex.padEnd(60, '0');

    return ipAsciiHex;
}

function decimalToHex(decimalString) {
    const decimalNumber = parseInt(decimalString);
    let hexString = decimalNumber.toString(16).toUpperCase();

    while (hexString.length % 2 !== 0 || hexString.length < 8) {
        hexString = '0' + hexString;
    }

    return hexString;
}

// 16进制转10进制
function reversedHexToDecimal(reversedHexString) {
    // 反转字节序列
    var hexString = '';
    for (var i = reversedHexString.length - 2; i >= 0; i -= 2) {
        hexString += reversedHexString.substr(i, 2);
    }
    // 如果字符串长度不是偶数，向后补零
    if (hexString.length % 2 !== 0) {
        hexString = hexString + '0';
    }
    // 转换为十进制数
    var decimalNumber = parseInt(hexString, 16);
    return decimalNumber;
}

// 16进制字符串转10进制字符串
function hexToDecimalString(hexString) {
    // 将十六进制字符串转换为十进制数
    var decimalNumber = parseInt(hexString, 16);
    // 将十进制数转换为字符串
    var decimalString = decimalNumber.toString();
    return decimalString;
}

function binaryToStr(str) {
    var result = [];
    var list = str.split(" ");
    for (var i = 0; i < list.length; i++) {
        var item = list[i];
        var asciiCode = parseInt(item, 2);
        var charValue = String.fromCharCode(asciiCode);
        result.push(charValue);
    }
    return result.join("");
}

// 目标地址
function convertToAscii(str) {
    let asciiStr = "";
    for (let i = 0; i < str.length; i++) {
        asciiStr += str.charCodeAt(i);
    }

    if (asciiStr.length < 60) {
        asciiStr += "0".repeat(60 - asciiStr.length);
    }

    return asciiStr;
}

/**
 * 
 * 输出信息
 */
function err(str) // 红色显示错误信息
{
    var dom = document.getElementById("dat");
    var time = getCurrentTime();
    if (dom) {
        dom.innerHTML += "<p style='color:red'>" + time + str + "</p>";
        dom.scrollTop = dom.scrollHeight;
    }
    else console.error(str);
}
function log(str) // 蓝色显示消息
{
    var dom = document.getElementById("dat");
    var time = getCurrentTime();
    if (dom) {
        dom.innerHTML += "<p style='color:blue'>" + str + "</p>";
        dom.scrollTop = dom.scrollHeight;
    }
    else console.log(str);
}
function out(str) // 简单输出消息
{
    var dom = document.getElementById("dat");
    var time = getCurrentTime();
    if (dom) {
        dom.innerHTML += "<p>" + time + "：" + str + "</p>";
        dom.scrollTop = dom.scrollHeight;
    }
    else console.log(str);
}

// 获取当前时间 00:00:00
function getCurrentTime() {
    let currentDate = new Date();
    let hours = ("0" + currentDate.getHours()).slice(-2);
    let minutes = ("0" + currentDate.getMinutes()).slice(-2);
    let seconds = ("0" + currentDate.getSeconds()).slice(-2);

    return hours + ":" + minutes + ":" + seconds;
}


function makeRequest(method, url, callback, errorCallback) {
    var httpRequest = new XMLHttpRequest();
    httpRequest.onreadystatechange = function () {
        if (httpRequest.readyState === 4) {
            if (httpRequest.status === 200) {
                var responseData = JSON.parse(httpRequest.responseText);
                callback(responseData);
            } else {
                if (errorCallback) {
                    errorCallback(httpRequest.status);
                }
            }
        }
    };
    httpRequest.open(method, url);
    httpRequest.send();
}