const mongoose = require("mongoose")
const validator = require("validator")
const bcrypt = require("bcrypt")


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
        minlength : 8,
        select : false
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
    },
    passwordChange : {
        type : Date
    }
})

userSchema.pre("save", async function(next) {
    this.confirmPassword = undefined

    if(!this.isModified("password")) return next()

    this.password = await bcrypt.hash(this.password, 12)
    next()
})

// instance method to check password is correct or not and it is available to the current document
// instance method is available to all the files

userSchema.methods.correctPassword = async (candidatePassowrd, userPassword) => {
    return await bcrypt.compare(candidatePassowrd, userPassword)
}

userSchema.methods.changedPasswordAfter = function(JWTTimeStamp){ // why i can't set this function as async

    if(this.passwordChange) {
        const changeTimeStamp = parseInt(this.passwordChange.getTime()/1000, 10)
        //console.log(JWTTimeStamp, this.passwordChange)

        return JWTTimeStamp < changeTimeStamp // if password is changed after jwt issued then return true ie password is changed
    }

    return false
}


const User = new mongoose.model("User", userSchema)

module.exports = User