const fs = require("fs")

const Movie = require("./../models/movieModel")

exports.getAllFilms = async (req, res) => {
    try{
        const movies = await Movie.find()
        res.status(200).json({
            status : "success",
            count : movies.length,
            data :{
                movies
            }
        })
    } catch(err){
        res.status(404).json({
            status : "fail",
            message : err
        })
    }
}


exports.createFilm = async (req, res) => {
    try{
        console.log(req.body);

        const newMovie = await Movie.create(req.body)

        // const newMovie = new Movie({
        //     name : "test movie 4",
        //     rating : 8
        // })

        // newMovie.save().then(doc => { // this save method return promises, we can use create method from
        //                               // mongoose, which will be awaited and will use async function
        // })

        res.status(201).json({
            status : "success",
            data : {
                newMovie
            }
        })
    } catch(err){
        res.status(400).json({
            status : "fail",
            message : err
        })
    }
}

exports.getFilm = async (req, res) => {
    try{

        const movie = await Movie.findById(req.params.id)
        res.status(200).json({
            status : "success",
            data : {
                movie
            }
        })
    } catch(err){
        res.status(404).json({
            status: "fail",
            message : err
        })
    }
}

exports.updateFilm = async (req, res) => {

    try {
        //const filter = req.body;
        const movie = await Movie.findByIdAndUpdate(req.params.id, req.body, {
            new : true,  // updated document will be returned
            runValidators : true
        })
        //console.log(movie)
        res.status(200).json({
            status : "success",
            data : {
                movie
            } 
        })   
    } catch(err) {
        res.status(400).json({
            status : "fail",
            message : err
        })
    }
}

exports.deleteFilm = async (req, res) => {
    try {

        await Movie.findByIdAndDelete(req.params.id)

        res.status(204).json({
            status : "success",
            message : "<movie deleted>",
            data : null
        })  
    } catch(err) {
        res.status(400).json({
            status : "fail",
            message : err
        })
    }
}
