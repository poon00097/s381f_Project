var express = require('express');
var url = require("url");
var expressMongoDb = require("express-mongo-db");
var assert = require("assert");
var router = express.Router();

router.use(
  expressMongoDb(
    "mongodb://poon:db123456@ds151382.mlab.com:51382/poon00097"
  )
);

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('register');
});

router.post("/", function(req, res, next) {
  var formData = req.body;
  console.log(formData);
  req.db.collection("User", function(err, collection) {
    collection.insertOne(
      { userID: formData.userID, password: formData.password },
      function(err, result) {
        assert.equal(err, null);
        console.log("insert was successful!");

        res.redirect("/login");
      }
    );
  });
});

module.exports = router;
