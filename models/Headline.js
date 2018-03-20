const mongoose = require("mongoose");

const Schema = mongoose.Schema;

let HeadlineSchema = new Schema({
    // `title` is required and of type String
    headline: {
        type: String,
        required: true
    },
    // `link` is required and of type String
    summary: {
        type: String,
        required: true
    },

    url: {
        type: String,
        required: true
    }
});

// This creates our model from the above schema, using mongoose's model method
const Headline = mongoose.model("Headlines", HeadlineSchema);

// Export the Article model
module.exports = Headline;
