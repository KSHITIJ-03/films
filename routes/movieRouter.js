const express = require("express")

const movieController = require("./../controllers/movieController")

const router = express.Router()

router.route("/")
    .get(movieController.getAllFilms)
    .post(movieController.createFilm)
router.route("/:id")
    .get(movieController.getFilm)
    .patch(movieController.updateFilm)
    .delete(movieController.deleteFilm)

module.exports = router;