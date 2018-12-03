var express = require('express');
var router = express.Router();
var expressMongoDb = require("express-mongo-db");
var assert = require("assert");
var url = require("url");
var cookieParser = require("cookie-parser");


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

  var criteria = { owner : req.session.userID};

  findRestaurants(req.db, criteria, function(restaurants) {
    console.log("Inside router", restaurants.ID)
    res.render('self', {
    restaurants: restaurants,
    userID: req.session.userID
    });
  });

});

router.get("/delete", function(req, res, next) {

    var params = url.parse(req.url, true).query;
    var filter = { "ID": params.id };

    removeRestaurant(req.db, filter, function(result) {
      if (result) {
        res.redirect("/self");
      }
  });
});

router.get("/edit", function(req, res, next) {
    console.log(req.param.id);
    var params = url.parse(req.url, true).query;
    console.log(params.id);
    var criteria = { ID: params.id };
    console.log("Here get method edit in self.js");
    console.log(criteria);


    findRestaurants(req.db, criteria, function(restaurants) {

      res.render('edit', {
      restaurants: restaurants,
      userID: req.session.userID
      });
    });


});

router.get("/rate", function(req, res, next) {
    console.log(req.param.id);
    var params = url.parse(req.url, true).query;
    console.log(params.id);
    var criteria = { ID: params.id };
    console.log("Here get method rate in self.js");
    console.log(criteria);


    findRestaurants(req.db, criteria, function(restaurants) {

      res.render('rate', {
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

function removeRestaurant(db, filter, callback) {
  db.collection("restaurants").remove(filter, function(err, res) {
    console.log(filter);
    assert.equal(err, null);
    console.log("remove was successful!");
    callback(true);
  });
}

module.exports = router;
