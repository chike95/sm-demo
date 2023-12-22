function addTableData(equipment, index) {
    // console.log(equipment);
    // 给table添加数据
    var tbody = document.createElement('tbody');
    tbody.className = 'equipment-table-item equipment-table-item' + index;

    var tr = document.createElement('tr');
    var td1 = document.createElement('td');
    var td2 = document.createElement('td');
    var td3 = document.createElement('td');
    var td4 = document.createElement('td');
    td1.innerText = equipment.Client_IP_address;    // IP 地址
    td2.innerText = hexToAscii(equipment.msg.substring(38, 66));    // 设备名称
    td3.innerText = equipment.msg.substring(18, 30).toUpperCase().replace(/(.{2})/g, "$1 ");    // MAC 地址
    td4.innerText = equipment.msg.substring(30, 36);    // 设备序列号

    tr.append(td1)
    tr.append(td2)
    tr.append(td3)
    tr.append(td4)
    tbody.append(tr)
    tbody.id = equipment.msg.substring(18, 30);

    var devTable = document.getElementById('dev-table');
    devTable.append(tbody)
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

            // 添加获取参数事件
            bindClickEvent();
        }
    };
    httpRequest.open('GET', '/equipmentArray');
    httpRequest.send();
    out("指令发送成功 -> FF010102");
    out("点击搜到的设备可读取参数");
}

// 绑定点击事件
document.getElementById('searchBtn').addEventListener('click', getData);

// 绑定点击事件到设备项
function bindClickEvent() {
    var equipments = document.getElementsByClassName('equipment-table-item');
    console.log(equipments);
    Array.from(equipments).forEach(function (item, index) {
        item.addEventListener('click', getArgument);
    });
}

// 获取参数请求
function getArgument() {
    var mac = this.id;
    var url = '/argument?mac=' + encodeURIComponent(mac);

    var httpRequest = new XMLHttpRequest();
    httpRequest.open('GET', url);
    httpRequest.send();
}




function computeCrcSum() {
    const hexString = "13 03 9C A5 25 A3 FE 38 61 64 6D 69 6E 00 61 64 6D 69 6E 00";
    // 去除字符串中的空格
    const hexStringWithoutSpace = hexString.replace(/\s/g, "");
    // 将字符串转换为十六进制数组
    const hexArray = hexStringWithoutSpace.match(/.{2}/g).map(str => parseInt(str, 16));
    // 计算所有值的和
    const sum = hexArray.reduce((acc, cur) => acc + cur);
    // 转换为十六进制形式并输出
    console.log(sum.toString(16).toUpperCase());
}


/******************************************* 进制转换 **********************************************/

function hexToChars(hexStr) {
    let bytes = hexStr.replace(/\s/g, '').split('');
    let chars = bytes.map(byte => String.fromCharCode(parseInt(byte, 16)));
    return chars.join('');
}

function hexToAscii(hexString) {
    let asciiString = '';
    for (let i = 0; i < hexString.length; i += 2) {
        const hex = hexString.substr(i, 2);
        const decimal = parseInt(hex, 16); // 将十六进制转换为十进制
        asciiString += String.fromCharCode(decimal); // 将十进制转换为字符
    }
    return asciiString;
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