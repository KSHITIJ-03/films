const mongoose = require("mongoose")

const reviewSchema = new mongoose.Schema({
    rating : {
        type : Number,
        min : 0,
        max : 10,
        required : true
    },
    review : {
        type : String,
        required : true
    },
    createdAt : Date,
    movie : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Movie",
        required : [true, "a review must be of a movie"]
    },
    author : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
        required : [true, "a review must have a author"]
    }
},
{
    toJSON : {virttuals : true},
    toObject : {virtuals : true}
})

reviewSchema.pre(/^find/, function(next) {
    // this.populate({
    //     path : "author",
    //     select : "name"
    // }).populate({
    //     path : "movie",
    //     select : "name imdbRating"
    // })
    next()
})

reviewSchema.pre(/^find/, function(next) {
    this.populate({
        path : "author",
        select : "name"
    })
    next()
})


reviewSchema.pre("save", function(next) {

    this.createdAt = Date.now()

    next()
})

const Review = new mongoose.model("Review", reviewSchema)

module.exports = Review