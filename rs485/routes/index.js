var express = require('express');
var router = express.Router();
var path = require('path');

var udpServer = require('../bin/udp-server');

/* GET home page. */
router.get('/', function (req, res, next) {
  // res.render('index', { title: 'Express' });
  res.sendFile('index.html', { root: path.join(__dirname, '../views') });
});


/* 获取设备 */
router.get('/equipmentArray', async function (req, res, next) {
  try {
    await udpServer.getEquipment();
    const result = [];

    udpServer.equipmentArray.forEach(function (item) {
      result.push({
        Client_IP_address: item.address,
        msg: item.msg
      })
    })
    console.log(result);
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to get equipment information' });
  }
});

/* 获取参数 */
router.get('/argument', async function (req, res, next) {

  try {
    const mac_addr = req.query.mac;
    // console.log(mac_addr);

    const argument = await udpServer.getArgument(mac_addr);

    // console.log(argument);
    res.json({ argument });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to get equipment information' });
  }
});

/* 参数设置 */
router.post('/settings', function (req, res, next) {
  console.log(req.body); // 输出参数值

  const baseOrder = req.body.base_order;
  const serialOrder = req.body.serial_order;
  const mac = req.body.mac;

  udpServer.editArgument(baseOrder, serialOrder, mac);
  // udpServer.restartEquipment(mac)
  res.json({ title: '参数保存成功,请重启项目' });
});

module.exports = router;
