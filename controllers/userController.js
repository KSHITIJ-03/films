const User = require("./../models/userModel")

exports.createUser = async (req, res) => {
    try {
        const user = await User.create(req.body)

        res.status(201).json({
            status : "success",
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




