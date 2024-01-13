const { findById } = require("../models/movieModel")
const User = require("./../models/userModel")
const jwt = require("jsonwebtoken")

exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find()
        res.status(200).json({
            status : "success",
            count : users.length,
            data : {
                users
            }
        })
    } catch(err) {
        res.status(404).json({
            status : "fail",
            message : err
        })
    }
}

exports.getUser = async (req, res) => {
    try {
        const users = await User.findById(req.params.id)
        res.status(200).json({
            status : "success",
            data : {
                users
            }
        })
    } catch(err) {
        res.status(404).json({
            status : "fail",
            message : err
        })
    }
}

exports.deleteUser = async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id)
        res.status(204).json({
            status : "success",
            message : "movie deleted"
        })
    } catch(err) {
        res.status(404).json({
            status : "fail",
            message : err
        })
    }
}

exports.updateMe = async (req, res) => {
    try {
        console.log(req.user);
        if(req.body.password){
            return res.status(400).json({
                status : "fail",
                message : "password do not update here"
            })
        }
        const user = await User.findOneAndUpdate({email : req.user.email}, {name : req.body.name}, {
            new : true,
            runValidators : true
        })

        console.log(user);

        res.status(200).json({
            status : "success",
            user
        })

    } catch(err) {
        res.status(404).json({
            status : "fail",
            message : err
        })
    }
}

exports.deleteMe = async(req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.user.id, {active : false})
        res.status(204).json({
            status : "success",
            message : "user deleted"
        })
    } catch(err) {
        res.status(404).json({
            status : "fail",
            message : err
        })
    }
}

exports.getMe = async(req, res) => {
    try {
        const user = await User.findById(req.user._id)
        res.status(200).json({
            status : "success",
            user
        })
    } catch(err) {
        res.status(404).json({
            status : "fail",
            message : err
        })
    }
}

exports.fillMe = async(req, res, next) => {
    try {
        req.params.id = req.user._id
        next()
    } catch(err) {
        res.status(404).json({
            status : "fail",
            message : err
        })
    }
}







