var express = require("express");
var assert = require("assert");
var url = require("url");
var cookieParser = require("cookie-parser");
var expressMongoDb = require("express-mongo-db");

var router = express.Router();

router.use(
  cookieParser(),
  expressMongoDb(
    "mongodb://poon:db123456@ds151382.mlab.com:51382/poon00097"
  ),
  // bodyParser.urlencoded({ extended: true }),
);

//POST /api/restaurant/create
router.post("/restaurant/create", function(req, res, next) {
  createRestaurant(req.db, req.body, function(result) {
    console.log(result);
    if (result == "failed") {
      res.json({ status: "failed" });
    } else {
      res.json({ status: "ok", _id: result.insertedId });
    }
  });
});

function createRestaurant(db, data, callback) {
  db.collection("restaurants").insertOne(data, function(err, result) {
    if (err) {
      callback("failed");
    } else {
      callback(result);
    }
  });
}

/* GET /api/restaurant/read */
router.get("/restaurant/read/Name/*", function(req, res, next) {
  console.log(req);
  var params = url.parse(req.url, true).query;
  var criteria = {};
  console.log(criteria);
  criteria.name = req.url.split("/").pop();
  findRestaurants(req.db, criteria, function(restaurants) {
    res.json(restaurants);
  });
});

router.get("/restaurant/read/borough/*", function(req, res, next) {
  console.log(req);
  var params = url.parse(req.url, true).query;
  var criteria = {};
  criteria.borough = req.url.split("/").pop();
  findRestaurants(req.db, criteria, function(restaurants) {
    res.json(restaurants);
  });
});


  router.get("/restaurant/read/cuisine/*", function(req, res, next) {
  console.log(req);
  var params = url.parse(req.url, true).query;
  var criteria = {};
  criteria.cuisine = req.url.split("/").pop();
  findRestaurants(req.db, criteria, function(restaurants) {
    res.json(restaurants);
  });
});
function findRestaurants(db, criteria, callback) {
  var cursor = db.collection("restaurants").find(criteria);

  var restaurants = [];

  cursor.each(function(err, doc) {
    assert.equal(err, null);
    if (doc != null) {
      restaurants.push(doc);
    } else {

      callback(restaurants);
    }
  });
}
module.exports = router;
