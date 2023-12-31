const fs = require("fs")
//const movies = JSON.parse(fs.readFileSync("./moviesDB.json"))

const Movie = require("./../models/movieModel")

exports.getAllFilms = (req, res) => {
    res.status(200).json({
        status : "success",
        count : movies.length,
        data : movies
    })
}

exports.checkID = (req, res, next, val) => {
    const movie = movies.find(element => element.id === val*1)

    if(!movie){
        return res.status(404).json({
            status : "fail",
            message : "invalid id"
        })
    }
    next()
}

exports.checkBody = (req, res, next) => {
    const movie = req.body;

    if(!movie.name || !movie.category){
        return res.status(400).json({
            status : "fail",
            message : "invalid movie"
        })
    }

    next()
}

exports.createFilm = (req, res) => {
    console.log(req.body);

    const newId = movies[movies.length - 1].id + 1
    const newMovie = Object.assign({id : newId}, req.body)

    movies.push(newMovie)

    fs.writeFile("./moviesDB.json", JSON.stringify(movies), err => {
        res.status(201).json({
            status : "success",
            data : {
                newMovie
            }
        })
    })

}

exports.getFilm = (req, res) => {
    console.log(req.params);

    // if(req.params.id > movies.length){
    //     return res.status(404).json({
    //         status : "fail",
    //         message : "Inavlid ID"
    //     })
    // }
     const movie = movies.find(element => element.id === req.params.id*1);

    // if(!movie) {
    //     return res.status(404).json({
    //         status : "fail",
    //         message : "Invalid ID"
    //     })
    // }

    res.status(200).json({
        status : "success",
        data : {
            movie
        }
    })
}

exports.updateFilm = (req, res) => {

    //const id = req.params.id * 1
    // if(id > movies.length){
    //     res.status(404).json({
    //         status : "fail",
    //         message : "InvalidID"
    //     })
    // }

    // const updatedFilm = req.body;

    // movies.forEach(element => {
    //     if(element.id === id) {
    //         movies = 
    //     }
    // });

    res.status(200).json({
        status : "success",
        message : "<movie updated here>"
    })

    
}

exports.deleteFilm = (req, res) => {

    // const id = req.params.id * 1
    // if(id > movies.length){
    //     res.status(404).json({
    //         status : "fail",
    //         message : "InvalidID"
    //     })
    // }

    res.status(204).json({
        status : "success",
        message : "<movie deleted>",
        data : null
    })    
}
