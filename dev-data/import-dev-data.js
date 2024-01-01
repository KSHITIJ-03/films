const mongoose = require("mongoose")
const dotenv = require("dotenv")
dotenv.config({path : "./../config.env"})

const Tour = require("../models/movieModel")
const fs = require("fs")

//console.log(process.env);

console.log(process.env.DATABASE);

const DB = process.env.DATABASE.replace("<password>", process.env.DATABASE_PASSWORD)

console.log(DB);

mongoose.connect(DB).then(con => {
    //console.log(con.connections);
    console.log("databse connected");
})

// read josn file

const tours = JSON.parse(fs.readFileSync("./../devData.json", "utf-8"))

// import data into DB

const importData = async () =>{
    try {
        await Tour.create(tours)
        console.log("data successfully loaded")
        process.exit()
    } catch(err){
        console.log(err);
    }
}

// delete many

const deleteData = async () =>{
    try {
        await Tour.deleteMany()
        console.log("data deleted successfully")
        process.exit()
    } catch(err){
        console.log(err);
    }
}

if(process.argv[2] == "--importData") {
    importData()
} else if( process.argv[2] == "--deleteData") {
    deleteData()
}
console.log(process.argv)