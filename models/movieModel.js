const mongoose = require("mongoose")


const movieSchema = new mongoose.Schema({
    name : {
        type : String,
        require : [true, "movie name is must"],
        unique : true
    },
    rating : {
        type : Number
    },
    Director : {
        type : [String]
        //require : [true, "directors are required"]
    },

})

const Movie = mongoose.model("Movie", movieSchema);

const newMovie = new Movie({
    name : "test movie 2",
    rating : 8
})

newMovie.save().then(doc => {
    console.log(doc);
    console.log("doc saved !!");
}).catch(err => {
    console.log(err);
})

module.exports = Movie