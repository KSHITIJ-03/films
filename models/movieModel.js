const mongoose = require("mongoose")

const validator = require("validator")

//const joi = require("joi")


const movieSchema = new mongoose.Schema({
    name : {
        type : String,
        required : [true, "movie must have a name"],
        unique : [true, "movie must be unique"],
        validate: [validator.isAlpha, "A movie must contain only alphabets"]
        
    },
    genres : {
        type : [String],
        enum : {
            values :
            ["Action", "Adult", "Adventure", 
               "Animation", "Biography", "Comedy", "Crime", 
               "Documentary", "Drama", "Family", "Fantasy", "Film Noir", 
               "Game Show", "History", "Horror", "Musical", "Music", 
               "Mystery", "News", "Reality-TV", "Romance", "Sci-Fi", 
               "Short", "Sport", "Talk-Show", "Thriller", "War", "Western"],
            message : "genre must be from : Action | Adult | Adventure | Animation| Biography | Comedy | Crime | Documentary | Drama| Family | Fantasy | Film Noir | Game Show | History | Horror | Musical| Music | Mystery | News | Reality-TV | Romance | Sci-Fi | Short| Sport | Talk-Show | Thriller | War | Western "
            },
        required : [true, "genres is required"]
    },
    plotSummary : {
        type : String,
        trim : true,
    },
    stars : {
        type : [String],
        required : [true, "movie stars are required"]
    },
    directors : {
        type : [String],
        required : [true, "a movie must have director"]
        //require : [true, "directors are required"]
    },
    writers : {
        type : [String],
        required : [true, "a movie must have writer"]
    },
    trailor : String,
    ratingsAverage : {
        type : Number,
        max : [10, "rating must be between 1 to 10"],
        min : [0, "rating must be between 1 to 10"]
    },
    imdbRating : {
        type : Number,
        required : [true, "imdbRating is must"],
        max : [10, "rating must be between 1 to 10"],
        min : [0, "rating must be between 1 to 10"]
    },
    reviews : {
        type : [String]
    },
    releaseYear : {
        type : Date,
        required : [true, "movie must have release date"]
    },
    duration : Number,
    country : {
        type : String,
    }
})

// pre hooks
// post hooks

// virtual properties
// document middleware
// query middleware
// aggregation middleware

const Movie = mongoose.model("Movie", movieSchema);

module.exports = Movie