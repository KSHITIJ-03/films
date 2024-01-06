//every thing is middleware (even routers)

//order of middlewares matters a lot to build an express app

//all the requests and responses are gone through the req, res cycle containing all the middlewares

//each router is the mini/sub-application

const express = require("express")
const morgan = require("morgan")
const app = express()

const appError = require("./utils/appError")

const globalErrorController = require("./controllers/errorController")

const movieRouter = require("./routes/movieRoutes")
const userRouter = require("./routes/userRoutes")
//const appError = require("./utils/appError")

app.use(express.json())

app.use(morgan("dev")) // third party middleware this .use makes it a middleware
// which will have req, res, next() functions 

app.use("/api/v1/films", movieRouter)
app.use("/api/v1/users", userRouter)

// if the url reaches at this line of code that means it di not entertained by any of the above routers

app.all("*", (req, res, next) => {
    // res.status(404).json({
    //     status : "fail",
    //     message : "this url "  + req.originalUrl + " not found on this server"
    // })

    // const err = new Error("this url "  + req.originalUrl + " not found on this server")
    // err.status = "fail",
    // err.statusCode = 404

    // next(err) // this err in next() shows that after this middleware it will skip all the between middlewares
    //           // present in stack and execute the error middleware

    next(new appError("this url "  + req.originalUrl + " not found on this server", 404))
})

// global error handling middleware

app.use(globalErrorController.errorController)

// app.get("/", (req, res) => {
//     res.status(200).json({
//         "status" : "success",
//         "message" : "from the root url"
//     })
// })

module.exports = app



