const LocalStrategy = require("passport-local").Strategy,
    //mongoose = require("mongoose"),
    bcrypt = require("bcryptjs"),
    // Get keys
    keys = require("./keys"),
    // Get Nodemailer
    // nodemailer = require("nodemailer"),
    // User model here for check up
    User = require("../models/User"), Menu = require("../models/menu");

module.exports = (passport) => {
    passport.use(
        new LocalStrategy({
            usernameField: 'email'
        }, (email, password, done) => {
            // Match user email
            User.findOne({
                // email: email
                $or: [{
                    email: email
                }, {
                    username: email
                }]
            })
                .then(user => {
                    if (!user) {
                        return done(null, false, {
                            message: 'That email is not registered'
                        })
                    }
                    // match the user password
                    bcrypt.compare(password, user.password, (err, isMatch) => {
                        if (err) throw err;
                        if (isMatch) {
                            /* if (!user.email_verified) {
                                return sendNotification();
                            } */
                            return done(null, user)
                        } else {
                            return done(null, false, {
                                message: 'Password incorrect, check your password and try again!'
                            })
                        }
                    })
                })
                .catch(err => console.log(err))

        })
    )

    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });

    passport.deserializeUser((id, done) => {
        User.findById(id, (err, user) => {
            if (user) {
                Menu.find({})
                    .then(async (menu) => {
                        if (menu) {
                            done(err, [user, menu]);
                        }

                    }).catch((err) => console.log(err));
            }


        });
    });


}