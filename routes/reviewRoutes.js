const express = require("express")
const reviewController = require("./../controllers/reviewController")
const authController = require("./../controllers/authController")
const userController = require("./../controllers/userController")

const router = express.Router({mergeParams : true}) // it will merge parameters from the previous routes to this router
/* ----------------------------- {mergeParams : true} this is for nested endPoints-------------------------------*/


router.route("/").post(authController.protect, reviewController.createReview)

router.route("/").get(reviewController.getAllReviews)

module.exports = router