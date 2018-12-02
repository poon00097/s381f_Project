var express = require('express');
var router = express.Router();
var expressMongoDb = require("express-mongo-db");
var formidable = require("formidable");
var assert = require('assert');
var bodyParser = require("body-parser");
var fs = require("fs");

/* GET home page. */
router.get("/", function(req, res, next) {
  res.redirect("/main");
});

router.post("/", function(req, res, next) {

  var formData = req.body;
  var form = new formidable.IncomingForm();
  var upload_json = {};
  var filter = {};

    form.parse(req, function(err, fields, files) {

    filter = { ID: fields.id };

    var data = {
    $push: {
      grades: {
        user: req.session.userID,
        score: fields.rate
      }
    }
  };

  console.log(data);

    pushRate(req.db, filter, data, function(result) {
      if (result) {
        res.redirect("/main");
      }
    });
  });
});


function pushRate(db, filter, data, callback) {
  db.collection("restaurants").updateOne(filter, data, function(err, res) {
    assert.equal(err, null);
    console.log("push was successful!");
    callback(true);
  });
}


module.exports = router;
