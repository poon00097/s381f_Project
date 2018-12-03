var express = require('express');
var router = express.Router();
var expressMongoDb = require("express-mongo-db");
var assert = require("assert");
var url = require("url");
var cookieParser = require("cookie-parser");
var formidable = require("formidable");


router.use(
  cookieParser(),
  expressMongoDb(
    "mongodb://poon:db123456@ds151382.mlab.com:51382/poon00097"
  ),
  // bodyParser.urlencoded({ extended: true }),
  function(req, res, next) {
    if (req.session.authenticated) {
      next();
    } else {
      res.render("login");
    }
  }
);


/* GET home page. */
router.get('/', function(req, res, next) {

  var criteria = {};

  findRestaurants(req.db, criteria, function(restaurants) {
    // restaurants.forEach(function(restaurant) {
    //     console.log(restaurant);
    //   });
    res.render('main', {
    restaurants: restaurants,
    userID: req.session.userID
    });
  });

});

router.get('/map', function(req, res, next) {

  res.render("restaurant_GoogleMap.ejs", {
  lat: req.query.lat,
  lon: req.query.lon,
  zoom: req.query.zoom
  });

});

router.post('/search', function(req, res, next) {

  var formData = req.body;
  var key = req.body.Key;

  if (key == "Street"){
    key = 'Address.Street';
  } else
  if (key == "building")
  {
    key = 'Address.building'
  } else
  if (key == "zipcode")
  {
    key = 'Address.zipcode'
  }

  console.log(req.body.Key);

  var criteria = {};

  criteria = { [key] : req.body.Value}

  console.log(criteria);

  findRestaurants(req.db, criteria, function(restaurants) {
    // restaurants.forEach(function(restaurant) {
    //     console.log(restaurant);
    //   });
      res.render('main', {
        restaurants: restaurants,
      userID: req.session.userID
      });

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
