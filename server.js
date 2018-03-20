const express = require("express");
const bodyParser = require("body-parser");
const logger = require("morgan");
const mongoose = require("mongoose");
const axios = require("axios");
const cheerio = require("cheerio");
const request = require("request")

// Require all models
const db = require("./models");

const PORT = 3000;

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
    // First, we grab the body of the html with request
    axios.get("http://reductress.com/").then(function (response) {
        // Then, we load that into cheerio and save it to $ for a shorthand selector
        var $ = cheerio.load(response.data);

        // Now, we grab every h2 within an article tag, and do the following:
        $(".small").each(function (i, element) {
            // Save an empty result object
            var result = {};

            // Add the text and href of every link, and save them as properties of the result object
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
                    // View the added result in the console
                    console.log(dbArticle);
                })
                .catch(function (err) {
                    // If an error occurred, send it to the client
                    return res.json(err);
                });
        });

        // If we were able to successfully scrape and save an Article, send a message to the client
        res.send("Scrape Complete");
    });
});


app.get("/articles", function (req, res) {
    // Grab every document in the Articles collection
    db.Headline.find({})
        .then(function (dbHeadline) {
            // If we were able to successfully find Articles, send them back to the client
            res.json(dbHeadline);
        })
        .catch(function (err) {
            // If an error occurred, send it to the client
            res.json(err);
        });
});








// Start the server
app.listen(PORT, function () {
    console.log("App running on port " + PORT + "!");
});