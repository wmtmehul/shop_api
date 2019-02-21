const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

exports.signup=(req, res, next) => {
    User.find({ email: req.body.email })
        .exec()
        .then(user => {
            if (user.length >= 1) {
                return res.status(422).json({
                    message: "Email Already  exists"
                });
            } else {

                bcrypt.hash(req.body.password, 10, (err, hash) => {
                    if (err) {
                        return res.status(500).json({
                            error: err
                        });
                    } else {
                        const user = new User({
                            email: req.body.email,
                            password: hash
                        });
                        user.save()
                            .then(result => {
                                res.status(201).json({
                                    message: "User created"
                                });
                            })
                            .catch(err => {
                                res.status(500).json({
                                    error: err
                                });
                            });
                    }
                });
            }
        });
}
exports.signin=(req, res, next) => {
    User.find({ email: req.body.email })
        .exec()
        .then(user => {
            if (user.length < 1) {
                return res.status(401).json({
                    message: "Auth failed"
                });
            }
            bcrypt.compare(req.body.password, user[0].password, (err, result) => {
                if (err) {
                    return res.status(401).json({
                        message: "Email or password is invalid"
                    });
                }
                if (result) {
                    const token = jwt.sign(
                        {
                            email: user[0].email,
                            userId: user[0]._id
                        },
                        process.env.JWT_KEY,
                    );
                    return res.status(200).json({
                        message: "Login Successfully",
                        token: token
                    });
                }
                res.status(401).json({
                    message: "Email or password is invalid"
                });
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
}
exports.delete_user=(req, res, next) => {
    User.deleteOne({ _id: req.params.userId })
        .exec()
        .then(result => {
            if (result.deletedCount > 0) {

                res.status(200).json({
                    message: 'User Deleted'

                })
            }
            else {
                res.status(404).json({ message: 'No User Found!' })
            }
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
}