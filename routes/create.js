var express = require('express');
var router = express.Router();
var expressMongoDb = require("express-mongo-db");
var formidable = require("formidable");
var assert = require('assert');
var bodyParser = require("body-parser");
var fs = require("fs");

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('create');
});

router.post('/', function(req, res, next) {

  var form = new formidable.IncomingForm();
  var upload_json = {};

  form.parse(req, function(err, fields, files) {
    console.log(err);
    console.log("files");
    console.log(JSON.stringify(files));

    upload_json["ID"] = fields.name+fields.Latitude+fields.Longitude+getRandomInt(9999999);
    upload_json["Name"] = fields.name;
    upload_json["borough"] = fields.borough;
    upload_json["cuisine"] = fields.cuisine;
    //upload_json["photo"] = fields.photo;
    upload_json["photo mimetype"] = files.photo.type;
    upload_json["Address"] = {
        Street: fields.Street,
        building: fields.building,
        zipcode: fields.zipcode
      },
      upload_json["coord"] = {
        Latitude: fields.Latitude,
        Longitude: fields.Longitude
      };
    upload_json["owner"] = req.session.userID;
    upload_json["grades"] = []

    if (files.photo.size != 0) {
      var filename = files.photo.path;

      fs.readFile(filename, function(err, data) {
      assert.equal(err, null);
      upload_json["photo"] = new Buffer(data).toString("base64");
      //因為readFile係async，所以upload statment 等佢read完再做, 所以寫係到
      console.log(upload_json);

      createRestaurant(req.db, upload_json, function(result) {
        console.log("Okay restaurant created");
          res.redirect("/main");
        });

      });
    } else {
      createRestaurant(req.db, upload_json, function(result) {
        console.log("Okay restaurant created");
          res.redirect("/main");
        });
    }
});

  });

function createRestaurant(db, data, callback) {
  db.collection("restaurants").insertOne(data, function(err, result) {
    assert.equal(err, null);
    console.log("insert was successful!");
    console.log(JSON.stringify(result));
    callback(result);
  });
}

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

module.exports = router;
