const express = require("express")

const userController = require("../controllers/userController")
const authController = require("../controllers/authController")
const router = express.Router()

const reviewRouter = require("./reviewRoutes")


// router.route("/")
//     .get(userController.getAllUsers)
//     .post(userController.createUser)
// router.route("/:id")
//     .get(userController.getUser)
//     .patch(userController.updateUser)
//     .delete(userController.deleteUser)

router.route("/signup").post(authController.signup)

router.route("/login").post(authController.login)

router.route("/forgotPassword").post(authController.forgotPassword)

router.route("/").get(authController.protect, authController.checkUser, userController.getAllUsers)

router.route("/updateMe").patch(authController.protect, userController.updateMe)

router.route("/updateMyPassword").patch(authController.protect, authController.updatePassword)

router.route("/resetPassword/:token").patch(authController.resetPassword)

router.route("/deleteMe").delete(authController.protect, userController.deleteMe)

//router.route("/me").get(authController.protect, userController.getMe)

router.route("/me").get(authController.protect, userController.fillMe, userController.getUser)

router.route("/:id")
    .get(userController.getUser)
    //.delete(authController.protect, authController.restrictTo("admin"), userController.deleteUser)
    .delete(authController.protect, authController.checkUser, userController.deleteUser)

module.exports = router

