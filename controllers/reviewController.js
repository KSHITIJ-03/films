const Review = require("./../models/reviewModel")

exports.createReview = async (req, res) => {

    try {
        const user = req.user
        const review = await Review.create({
        rating : req.body.rating,
        review : req.body.review,
        author : req.user._id,
        movie : req.body.movie
        })
        res.status(201).json({
            status : "success",
            message : "review created"
        })

    } catch(err) {
        res.status(404).json({
            status : "fail",
            message : err
        })
    }
}

exports.getAllReviews = async (req, res) => {

    try {
        const reviews = await Review.find()
        res.status(201).json({
            status : "success",
            count : reviews.length,
            data : {
                reviews
            }
        })

    } catch(err) {
        res.status(404).json({
            status : "fail",
            message : err
        })
    }
}