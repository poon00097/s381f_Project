var express = require('express');
var router = express.Router();
var expressMongoDb = require("express-mongo-db");
var formidable = require("formidable");
var assert = require('assert');
var bodyParser = require("body-parser");
var fs = require("fs");

/* GET home page. */
router.get("/", function(req, res, next) {
  res.redirect("/self");
});

router.post("/", function(req, res, next) {

  var formData = req.body;
  var form = new formidable.IncomingForm();
  var upload_json = {};
  var filter = {};

  form.parse(req, function(err, fields, files) {

    filter = { ID: fields.id };

    upload_json["ID"] = fields.id;
    upload_json["Name"] = fields.name;
    upload_json["borough"] = fields.borough;
    upload_json["cuisine"] = fields.cuisine;
    //upload_json["photo"] = fields.photo;
    upload_json["photo mimetype"] = files.photo.type;
    (upload_json["Address"] = {
      Street: fields.Street,
      building: fields.building,
      zipcode: fields.zipcode
    }),
      (upload_json["coord"] = {
        Latitude: fields.Latitude,
        Longitude: fields.Longitude
      });
    upload_json["owner"] = req.session.userID;

    if (files.photo.size != 0) {
      var filename = files.photo.path;

      fs.readFile(filename, function(err, data) {
        assert.equal(err, null);
        upload_json["photo"] = new Buffer(data).toString("base64");
        //因為readFile係async，所以upload statment 等佢read完再做, 所以寫係到

        editRestaurant(req.db, filter, upload_json, function(result) {
          console.log("Okay restaurant edited");
          res.redirect("/self");
        });
      });
    } else {
      editRestaurant(req.db, filter, upload_json, function(result) {
        console.log("Okay restaurant edited");
        res.redirect("/self");
      });
    }
  });
});




function editRestaurant(db, filter, data, callback) {
  db.collection("restaurants").update(filter, { $set: data }, function(
    err,
    result
  ) {
    console.log(err);
    assert.equal(err, null);
    console.log("insert was successful!");
    console.log(JSON.stringify(result));
    console.log(filter);
    callback(result);
  });
}

module.exports = router;
