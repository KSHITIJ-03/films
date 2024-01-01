const mongoose = require("mongoose")


const movieSchema = new mongoose.Schema({
    name : {
        type : String,
        required : [true, "movie must have a name"],
        unique : [true, "movie must be unique"]
    },
    genres : {
        type : [String],
        enum : ["Action", "Adult", "Adventure", 
               "Animation", "Biography", "Comedy", "Crime", 
               "Documentary", "Drama", "Family", "Fantasy", "Film Noir", 
               "Game Show", "History", "Horror", "Musical", "Music", 
               "Mystery", "News", "Reality-TV", "Romance", "Sci-Fi", 
               "Short", "Sport", "Talk-Show", "Thriller", "War", "Western"],
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
    },
    imdbRating : {
        type : Number,
        required : [true, "imdbRating is must"]
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

const Movie = mongoose.model("Movie", movieSchema);

module.exports = Movie