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
app.get("/scrape", function(req, res) {
    console.log("---commense scraping---");

    axios.get("https://serebii.net/").then(function(response) {

        var $ = cheerio.load(response.data);

        $("div[class=subcat]").each(function(i, element) {
            var result = {};

            result.headline = $(this)
                .children("p[class=title]")
                .text();

            result.summary = $(this)
                .children("p")
                .next()
                .text();

            result.link = "https://serebii.net";
            result.link += $(this)
                .prev()
                .children("a")
                .attr("href");

            console.log("result.all:", result);

            db.Article.create(result)
                .then(function(dbArticle) {
                    console.log(dbArticle);
                })
                .catch(function(err) {
                    return res.json(err);
                });
        });

        res.send("Scrape Complete");
    });
});

//GET route for getting articles from the db
app.get("/articles", function(req, res) {

    db.Article.find({})
        .then(function(dbArticle) {
            res.json(dbArticle);
        })
        .catch(function(err) {
            res.json(err);
        });
});

//GET route for grabbing a specific Article by id with Note
app.get("articles':id", function(req, res) {
    db.Article.findOne({ _id: req.params.id })

    .populate("comment")
    .then(function(dbArticle) {
        res.json(dbArticle);
    })
    .catch(function(err) {
        res.json(err);
    });
});

//POST route for saving/updating an Article's Note
app.post("/articles/:id", function(req, res) {
    db.Note.create(req.body) 
    .then(function(dbNote) {
        return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
    })
    .then(function(dbArticle) {
        res.json(dbArticle);
    })
    .catch(function(err) {
        res.json(err);
    });
});

app.listen(PORT, function() {
    console.log("App running on port " + PORT + "!");
});