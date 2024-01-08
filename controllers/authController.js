const User = require("./../models/userModel")
const jwt = require("jsonwebtoken")
//const {promisify} = require("util")

const sendEmail = require("./../utils/email")

exports.signup = async (req, res) => {
    try {
        const user = await User.create({
            name : req.body.name,
            email : req.body.email,
            password : req.body.password,
            confirmPassword : req.body.confirmPassword,
            passwordChange : req.body.passwordChange,
            role : req.body.role
        })

        const token = jwt.sign({id : user._id}, process.env.JWT_SECRET, {
            expiresIn : process.env.JWT_EXPIRE
        })

        res.status(201).json({
            status : "success",
            token,
            message : {
                user
            }
        })

    } catch (err) {
        res.status(400).json({
            status : "fail",
            message : err
        })
    }
}

exports.login = async (req, res, next) => {
    try {
        //const name = req.body.name;
        const email = req.body.email;
        const password = req.body.password;

        if(!email || !password) {
            res.status(400).json({
                status : "fail",
                message : "provide email and password"
            })
            return next()
        }

        const user = await User.findOne({email}).select("+password")  // returns an object

        const correct = await user.correctPassword(password, user.password)

        // console.log(user);
        // console.log(correct);

        if(!user || !correct) {
            return res.status(401).json({
                status : "unauthorized",
                message : "invalid email or password"
            })
            next()
        }

        const token = jwt.sign({id : user._id}, process.env.JWT_SECRET, {
            expiresIn : process.env.JWT_EXPIRE
        })
        res.status(200).json({
            status : "success",
            token
        })


    } catch(err) {
        res.status(404).json({
            status : "fail",
            message : err
        })
    }
}

exports.protect = async (req, res, next) => {
    try {
        let token;

        if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
            token = req.headers.authorization.split(" ")[1]
        }

        if(!token) {
            return res.status(401).json({
                status : "fail",
                message : "you are logged out"
            })
            //next()
        }

        // verification of token

        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        //console.log(decoded); console.log(token);

        //console.log(decoded.id); // on changing jwt token why it is showing invalid signature ???

        // checkng if user still exists

        console.log(decoded);

        const freshUser = await User.findById(decoded.id)

        console.log(freshUser);
        
        if(!freshUser) {
            return res.status(401).json({
                status : "fail",
                message : "the token do not belong to this user"
            })
            //next()
        }

        // check is user have changed the password after it have signed in

        if(freshUser.changedPasswordAfter(decoded.iat)) {
            return res.status(401).json({
                status : "fail",
                message : "user changed password recently please login again"
            })
        }

        // res.status(200).json({
        //     status : "success",
        //     message : "signed in user"
        // })
        req.user = freshUser
        //next()
    } catch(err) {
        res.status(404).json({
            status : "fail",
            message : err
        })
    }
    next()
}

exports.restrictTo = (...roles) => {
    return (req, res, next) => {
        if(!roles.includes(req.user.role)) {
            return res.status(403).json({
                status : "fail",
                message : "you are not authorized to this route"
            })
        }

        next()
    }
}

exports.checkUser = async (req, res, next) => {
    try {
        // console.log(req.user);
        // console.log(req.user.role);
        if(req.user.role != "admin") {
            return res.status(403).json({
                status : "fail",
                message : "you are not authorized to this route"
            })
        }
        next()
    } catch(err) {
        res.status(404).json({
            status : "fail",
            message : err
        })
    }
}

exports.updatePassword = async (req, res, next) => {
    try {
        console.log(req.user);
        const oldPassword = req.body.oldPassword
        const newPassword = req.body.newPassword
        const confirmNewPassowrd = req.body.confirmNewPassword

        // const token = req.headers.authorization.split(" ")[1]

        // //console.log(token);

        // // verify token if user still signed in or not //
        // const decoded = jwt.verify(token, process.env.JWT_SECRET)

        // //console.log(decoded);

        // //find that user through the given token
        // const freshUser = await User.findById(decoded.id).select("+password")

        // console.log(freshUser);

        // //verify the old password
        // const correct = await freshUser.correctPassword(oldPassword, freshUser.password)

        // if(!freshUser || !correct) {
        //     return res.status(401).json({
        //         status : "fail",
        //         message : "your current password is wrong"
        //     })
        // }

        // freshUser.password = newPassword
        // freshUser.confirmPassword = confirmNewPassowrd 

        // console.log(freshUser);
        // await freshUser.save()

        // res.status(200).json({
        //     status : "success",
        //     token,
        //     message : "password updated"
        // })

        const freshUser = await User.findById(req.user._id).select("+password")

        //console.log(freshUser);
        
        if(!await freshUser.correctPassword(oldPassword, freshUser.password)){
            return res.status(403).json({
                status : "fail",
                message : "old password is incorrect"
            })
        }

        freshUser.password = newPassword
        freshUser.confirmPassword = confirmNewPassowrd
        await freshUser.save()

        const token = jwt.sign({id : freshUser._id}, process.env.JWT_SECRET, {
            expiresIn : process.env.JWT_EXPIRE
        })

        return res.status(200).json({
            status : "success",
            token,
            message : "password updated"
        })

        next()

        
    } catch(err) {
        res.status(404).json({
            status : "fail",
            message : err
        })
    }
}

exports.forgotPassword = async(req, res, next) => {
    try {
        const user = await User.findOne({email : req.body.email})
        if(!user) {
            return res.status(404).json({
                status : "fail",
                message : "no user with this email address"
            })
        }
        const resetToken = user.createPasswordResetToken()
        await user.save({validateBeforeSave : false})

        const resetURL = req.protocol+"://"+req.get("host")+"/api/v1/users/resetPassword/"+resetToken

        //console.log(resetURL); console.log(resetToken); console.log(user);

        const message = "forgot your password ? submit a patch request with a new password and confirm password to url :- " + resetURL + " ." + " if not forgot then please ignore this message"

        try {
            await sendEmail({
            email : user.email,
            subject : "your password reset token valid for 10 minutes",
            message
            })

            return res.status(200).json({
                status : "success",
                message : "Token sent to email"
            })
            next()
        } catch(err) {
            user.passwordResetToken = undefined
            user.passwordResetExpire = undefined
            await user.save({validateBeforeSave : false})

            return res.status(500).json({
                status : "fail",
                message : "email can't be sent! please try again later"
            })
        }
        //next()

    } catch(err) {
        res.status(404).json({
            status : "fail",
            message : err
        })
    }
}

// exports.resetPassword = async (req, res, next) =>{
//     try {
//         //1 ) get the token from url
//         //
//     } catch(err) {
//         res.status(404).json({
//             status : "fail",
//             message : err
//         })
//     }
// }


