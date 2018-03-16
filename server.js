var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");

var axios = require("axios");
var cheerio = require("cheerio");

var db = require("./models");

var PORT = process.env.PORT || 3000;

var app = express();

app.use(logger("dev"));

app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static("public"));

var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoScraper";

mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI);

//GET route for scraping

//GET route for getting articles from the db

//GET route for grabbing a specific Article by id with Note

//POST route for saving/updating an Article's Note

app.listen(PORT, function() {
    console.log("App running on port " + PORT + "!");
});