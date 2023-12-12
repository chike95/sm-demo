function addTableData(equipment) {
    // // 给table 添加新数据
    // var tbody = document.createElement('tbody');
    // // 添加这个类名是方便后面删除时定位到这些元素
    // tbody.className = 'equipment-table-item'
    // var tr = document.createElement('tr');

    // var td1 = document.createElement('td');
    // td1.innerText = '0'
    // var td2 = document.createElement('td');
    // td2.innerText = equipment.addr
    // var td3 = document.createElement('td');
    // td3.innerText = equipment.id
    // var td4 = document.createElement('td');
    // td4.innerText = equipment.lastValue
    // td4.setAttribute("style", "overflow: hidden;");

    // tr.append(td1)
    // tr.append(td2)
    // tr.append(td3)
    // tr.append(td4)
    // tbody.append(tr)
    // var devTable = document.getElementById('dev-table');
    // devTable.append(tbody)
    console.log(equipment);
}


function getEquipment() {
    var httpRequest = new XMLHttpRequest();
    httpRequest.onreadystatechange = function () {
        if (httpRequest.readyState === 4) {
            // 删除table里的旧数据（根据类名来找到那些元素）
            var tableItems = document.getElementsByClassName("equipment-table-item");
            Array.from(tableItems).forEach(function (item) {
                item.remove();
            })

            var responseData = JSON.parse(httpRequest.responseText);
            console.log(responseData);
        }
    }
    httpRequest.open('GET', '/equipmentArray');
    httpRequest.send();
}

document.getElementById('searchBtn').addEventListener('click', getEquipment);



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
