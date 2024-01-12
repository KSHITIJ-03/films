const express = require("express")
const reviewController = require("./../controllers/reviewController")
const authController = require("./../controllers/authController")
const userController = require("./../controllers/userController")

const router = express.Router()

router.route("/").post(authController.protect, reviewController.createReview)

router.route("/").get(reviewController.getAllReviews)

module.exports = router