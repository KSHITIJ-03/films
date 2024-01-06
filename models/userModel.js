const mongoose = require("mongoose")
const validator = require("validator")

const userSchema = new mongoose.Schema({
    name : {
        type : String,
        validate : [validator.isAlpha, "user name must beof alphabets"],
        required : [true, "user name is required"]
    },
    email : {
        type : String,
        required : [true, "email is required"],
        unique : [true, "user exists"],
        lowercase : true,
        validate : [validator.isEmail, "enter a valid email"]
    },
    password : {
        type : String,
        required : [true, "password is required"],
        minlength : 8
    },
    confirmPassword : {
        type : String,
        validate : {
            validator : function(val) {
                return val == this.password
            },
            message : "both the passwords should match"
        },
        required : [true, "confirmPassword should match"]
    }
})

userSchema.pre("save", async function(next) {
    this.confirmPassword = undefined
    next()
})

const User = new mongoose.model("User", userSchema)

module.exports = User