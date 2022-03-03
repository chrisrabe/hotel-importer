var express = require('express');
var router = express.Router();

const data = [];

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send(data);
});

router.post('/', function (req, res) {
  const { body } = req;
  data.push(body);
  res.send("Success!");
})

module.exports = router;
