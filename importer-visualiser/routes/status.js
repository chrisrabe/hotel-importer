var express = require('express');
var router = express.Router();

const data = {};

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send(data);
});

router.post('/', function (req, res) {
  const { file, percent, transferred, total } = req.body;
  if (file) {
    data[file] = {
      percent,
      transferred,
      total
    }
  }
  res.send("Success!");
})

module.exports = router;
