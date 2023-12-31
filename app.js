//every thing is middleware (even routers)

//order of middlewares matters a lot to build an express app

//all the requests and responses are gone through the req, res cycle containing all the middlewares

//each router is the mini/sub-application

const express = require("express")
const morgan = require("morgan")
const app = express()

const movieRouter = require("./routes/movieRoutes")
const userRouter = require("./routes/userRoutes")

app.use(express.json())

app.use(morgan("dev")) // third party middleware this .use makes it a middleware
// which will have req, res, next() functions 

app.use("/api/v1/films", movieRouter)
app.use("/api/v1/user", userRouter)

app.get("/", (req, res) => {
    res.status(200).json({
        "status" : "success",
        "message" : "from the root url"
    })
})

module.exports = app



