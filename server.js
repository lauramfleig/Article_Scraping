const express = require("express");
const bodyParser = require("body-parser");
const logger = require("morgan");
const mongoose = require("mongoose");
const axios = require("axios");
const cheerio = require("cheerio");
const request = require("request")
const fs = require("fs");

// Require all models
const db = require("./models");

const PORT = process.env || 3000;

// Initialize Express
const app = express();

// Use morgan logger for logging requests
app.use(logger("dev"));

// Use body-parser for handling form submissions
app.use(bodyParser.urlencoded({ extended: true }));

// Use express.static to serve the public folder as a static directory
app.use(express.static("public"));


// Connect to the Mongo DB
mongoose.Promise = Promise;
mongoose.connect("mongodb://localhost/Scraping_HW", {
});

// Scrape data from one site and place it into the mongodb db

app.get("/scrape", function (req, res) {
    axios.get("http://reductress.com/").then(function (response) {
        var $ = cheerio.load(response.data);
        $(".small").each(function (i, element) {

            var result = {};

            result.headline = $(this)
                .children(".type-post")
                .children("a")
                .attr("title");
            result.summary = $(this)
                .children(".type-post")
                .children("a")
                .find("p")
                .text();
            result.url = $(this)
                .children(".type-post")
                .children("a")
                .attr("href")
                

            // Create a new Article using the `result` object built from scraping
            db.Headline.create(result)
                .then(function (dbArticle) {
                    console.log(dbArticle);
                })
                .catch(function (err) {
                    return res.json(err);
                });
        });
        res.send("Scrape Complete");
    });
});


app.get("/articles", function (req, res) {
    db.Headline.find({})
        .then(function (dbHeadline) {
            res.json(dbHeadline);
        })
        .catch(function (err) {
            res.json(err);
        });
});


app.post('/articles/save/:id', (req, res) => {
   db.Headline.findByIdAndUpdate(req.params.id, {$set: { saved: true }}) 
    .then(function (dbHeadline) {
        res.json(dbHeadline);
    })
    .catch(function (err) {
        res.json(err)
    })
    
})

app.get("/saved", function (req, res){
    res.sendfile("./public/saved.html")
});



app.get("/articles/saved", function (req, res) {
    db.Headline.find({ saved: true})
        .then(function (dbHeadline) {
            res.json(dbHeadline);
        })
        .catch(function (err) {
            res.json(err);
        });
});

app.delete('/articles/delete/:id', (req, res) => {
    db.Headline.findByIdAndRemove(req.params.id)
        .then(function (dbHeadline) {
            console.log('successfully removed')
            res.json(dbHeadline);
        })
        .catch(function (err) {
            res.json(err)
        })

})

// Route for grabbing a specific Article by id, populate it with it's note
app.get("/articles/:id", function (req, res) {
    db.Headline.findOne({ _id: req.params.id })
        .populate("note")
        .then(function (dbArticle) {
            res.json(dbArticle);
        })
        .catch(function (err) {
            res.json(err);
        });
});







// Start the server
app.listen(PORT, function () {
    console.log("App running on port " + PORT + "!");
});