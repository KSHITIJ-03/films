const express = require("express")
const fs = require("fs")

//const movies = JSON.parse(fs.readFileSync("./moviesDB.json"))

const movieController = require("../controllers/movieController")

const router = express.Router()

// param middleware

// router.param("id", (req, res, next, val) => {
//     const movie = movies.find(element => element.id === req.params.id*1);

//     if(!movie) {
//         return res.status(404).json({
//             status : "fail",
//             message : "Invalid ID"
//         })
//     }

//     next()
// })

router.param("id", movieController.checkID)

router.route("/")
    .get(movieController.getAllFilms)
    .post(movieController.checkBody, movieController.createFilm)
router.route("/:id")
    .get(movieController.getFilm)
    .patch(movieController.checkBody, movieController.updateFilm)
    .delete(movieController.deleteFilm)

module.exports = router;