const mongoose = require("mongoose")
const validator = require("validator")
const bcrypt = require("bcrypt")
const crypto = require("crypto")


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
        required : [true, "please confirm your password"],
        validate : {
            validator : function(val) {
                return val == this.password
            },
            message : "both the passwords should match"
        }
    },
    passwordChange : {
        type : Date
    },
    role : {
        type : String,
        enum : ["admin", "user"],
        default : "user"
    },
    passwordResetToken : String,
    passwordResetExpire : Date
})

userSchema.pre("save", async function(next) {
    this.confirmPassword = undefined

    if(!this.isModified("password")) return next()

    this.password = await bcrypt.hash(this.password, 12)
    next()
})

userSchema.pre("save", function(next){
    if(!this.isModified("password") || !this.isNew) return next()
    this.passwordChange = Date.now() - 1000
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

userSchema.methods.createPasswordResetToken = function() {
    const resetToken = crypto.randomBytes(32).toString("hex")
    this.passwordResetToken = crypto.createHash("sha256").update(resetToken).digest("hex")
    this.passwordResetExpire = Date.now() + 10*60*1000
    //console.log({resetToken}, this.passwordResetToken);
    return resetToken
}

const User = new mongoose.model("User", userSchema)

module.exports = User