const fs = require("fs")

const Movie = require("./../models/movieModel");

exports.topMovies = (req, res, next) =>{
    req.query.limit = "5"
    req.query.sort = "-imdbRating"
    req.query.fields = "name, imdbRating"
    next()
}

exports.getMoviesByStars = async (req, res) => {
    try {
        console.log(req.params);
        //const movie = await Movie.find({ stars: { $elemMatch: { $regex: new RegExp(req.params.actor, 'i') } } });

        const movie = await Movie.find({stars : {$elemMatch : {$regex : new RegExp(req.params.actor, "i")}}}, {name : 1, _id : 0})
        console.log(movie);
        res.status(200).json({
            status : "success",
            message : movie
        })
    } catch(err){
        res.status(404).json({
            status : "fail",
            message : err
        })
    }
}

exports.getAllFilms = async (req, res) => {
    try{

        console.log(req.query);

        let temp_Movies = Movie.find({})
        
        // const queryObj = {...req.query}
        // const excludedQueries = ["sort", "page", "limit", "fields"]
        // excludedQueries.forEach(el => delete queryObj[el])
        
        // console.log(queryObj, req.query);

        // if(queryObj.genres){
        //     console.log(queryObj.genres);
        //     query = Movie.find({genres: {$in : req.body.genres}})
        // }

        //console.log(queryObj.genres);

        //genresArray = queryObj.genres.split(",")

        //console.log(genresArray);

        // const movies = await Movie.find({genres: {$all : genresArray}})

        if(req.query.sort){
            temp_Movies.sort(req.query.sort)
        } else {
            temp_Movies.sort("imdbRating")
        }

        if(req.query.fields){
            const fields = req.query.fields.split(",").join(" ")
            temp_Movies = temp_Movies.select(fields)
        } else {
            temp_Movies = temp_Movies.select("-__v")
        }

        const page = req.query.page*1 || 1
        const limit = req.query.limit*1 || 100
        const skip = (page - 1)*limit
        temp_Movies = temp_Movies.skip(skip).limit(limit)

        const movies = await temp_Movies;

        //console.log(genresArray);
        //const movies = await Movie.find(req.query)
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
        console.log(req.params)
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
