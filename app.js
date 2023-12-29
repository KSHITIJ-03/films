const express = require("express")
const fs = require("fs")
const app = express()

app.use(express.json())

const movies = JSON.parse(fs.readFileSync("./moviesDB.json"))

app.listen(3000, () => {
    console.log("server started at port 3000");
})

app.get("/", (req, res) => {
    res.status(200).json({
        "status" : "success",
        "message" : "from the root url"
    })
})

app.get("/api/v1/films", (req, res) => {
    res.status(200).json({
        status : "success",
        count : movies.length,
        data : movies
    })
})

app.post("/api/v1/films", (req, res) => {
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

})

app.get("/api/v1/films/:id", (req, res) => {
    console.log(req.params);

    // if(req.params.id > movies.length){
    //     return res.status(404).json({
    //         status : "fail",
    //         message : "Inavlid ID"
    //     })
    // }
    const movie = movies.find(element => element.id === req.params.id*1);

    if(!movie) {
        return res.status(404).json({
            status : "fail",
            message : "Invalid ID"
        })
    }

    res.status(200).json({
        status : "success",
        data : {
            movie
        }
    })
})

app.patch("/api/v1/films/:id", (req, res) => {

    const id = req.params.id * 1
    if(id > movies.length){
        res.status(404).json({
            status : "fail",
            message : "InvalidID"
        })
    }

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

    
})

app.delete("/api/v1/films/:id", (req, res) => {

    const id = req.params.id * 1
    if(id > movies.length){
        res.status(404).json({
            status : "fail",
            message : "InvalidID"
        })
    }

    res.status(204).json({
        status : "success",
        message : "<movie deleted>",
        data : null
    })    
})