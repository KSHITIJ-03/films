//every thing is middleware (even routers)
//order of middlewares matters a lot to build an express app
//all the requests and responses are gone through the req, res cycle containing all
//the middlewares

const express = require("express")
const fs = require("fs")
const morgan = require("morgan")
const app = express()

const movieRouter = require("./routes/movieRouter")
const userRouter = require("./routes/userRouter")

app.use(express.json())

app.use(morgan("dev")) // third party middleware this .use makes it a middleware
// which will have req, res, next() functions 

app.use("/api/v1/films", movieRouter)
app.use("/api/v1/user", userRouter)

app.listen(3000, () => {
    console.log("server started at port 3000");
})

app.get("/", (req, res) => {
    res.status(200).json({
        "status" : "success",
        "message" : "from the root url"
    })
})

// app.get("/api/v1/films", getAllFilms)
// app.post("/api/v1/films", createFilm)
// app.get("/api/v1/films/:id", getFilm)
// app.patch("/api/v1/films/:id", updateFilm)
// app.delete("/api/v1/films/:id", deleteFilm)


