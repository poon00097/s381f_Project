var express = require('express');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var ObjectId = require('mongodb').ObjectID;
var cookieParser = require("cookie-parser");
var expressMongoDb = require("express-mongo-db");
var session = require('cookie-session');


router.use(
  expressMongoDb(
    "mongodb://poon:db123456@ds151382.mlab.com:51382/poon00097"
  )
);

/* GET home page. */
router.get("/", function(req, res) {
   console.log('Hi');
   console.log(req.session);
 	if (!req.session.authenticated) {
	   res.render('login');
 	} else {
 		res.status(200);
    console.log("success login")
 		res.redirect('/main');
 	}
  });

router.post("/", function(req, res, next) {
  var formData = req.body;
  console.log(formData);
  req.db.collection("User").findOne(formData, function(err, result) {
    assert.equal(err, null);
    console.log("result:" + result);
    if (result !== null) {
      console.log("result:" + result);
      req.session.authenticated = true;
      req.session.userID = result.userID;
      res.redirect("/");
    } else {
      res.send("fail");
    }
  });
});


module.exports = router;
