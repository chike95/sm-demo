var express = require('express');
var router = express.Router();
var path = require('path');

var udpServer = require('../bin/udp-server');

/* GET home page. */
router.get('/', function (req, res, next) {
  // res.render('index', { title: 'Express' });
  res.sendFile('index.html', { root: path.join(__dirname, '../views') });
});

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
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to get equipment information' });
  }
});

router.get('/argument', async function (req, res, next) {
  // udpServer.getArgument();
  console.log("get argument");
  res.send("argument");
});

module.exports = router;
