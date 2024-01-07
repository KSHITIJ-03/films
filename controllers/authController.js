const User = require("./../models/userModel")
const jwt = require("jsonwebtoken")
//const {promisify} = require("util")

exports.signup = async (req, res) => {
    try {
        const user = await User.create({
            name : req.body.name,
            email : req.body.email,
            password : req.body.password,
            confirmPassword : req.body.confirmPassword,
            passwordChange : req.body.passwordChange
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
        const name = req.body.name;
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
            res.status(401).json({
                status : "unauthorized",
                message : "invalid email or password"
            })
            return next()
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

        const freshUser = await User.findById(decoded.id)
        
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
    } catch(err) {
        res.status(404).json({
            status : "fail",
            message : err
        })
    }
    next()
}