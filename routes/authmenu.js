var express = require('express');
var router = express.Router();
var session = require('cookie-session');
var cookieParser = require("cookie-parser");

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { login: 'authmenu.ejs', userid: req.session.userID });
});

router.post('/', function(req, res) {
  console.log("onclik logout")
  req.session = null
  console.log(req.seesion)
  res.redirect('/login');
});

module.exports = router;
