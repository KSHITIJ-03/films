const express = require("express")
const fs = require("fs")

const movieController = require("../controllers/movieController")

const router = express.Router()

// param middleware
//router.param("id", movieController.checkID)

router.route("/")
    .get(movieController.getAllFilms)
    .post(movieController.createFilm)

router.route("/topMovies").get(movieController.topMovies, movieController.getAllFilms)

router.route("/:id")
    .get(movieController.getFilm)
    .patch(movieController.updateFilm)
    .delete(movieController.deleteFilm)

router.route("/Stars/:actor").get(movieController.getMoviesByStars)

module.exports = router;