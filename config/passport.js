const LocalStrategy = require("passport-local").Strategy,
    //mongoose = require("mongoose"),
    bcrypt = require("bcryptjs"),
    // Get keys
    keys = require("./keys"),
    // User model here for check up
    User = require("../models/User"),
    // Initial Menu
    Menu = require("../models/menu"),
    contractTemp = require("../models/contract_template"),
    proposalTemp = require("../models/proposal_template"),
    ContractDraft = require("../models/contract_draft"),
    ProposalDraft = require("../models/proposal_draft");

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
                        });
                    }
                    // match the user password
                    bcrypt.compare(password, user.password, (err, isMatch) => {
                        if (err) throw err;
                        if (isMatch) {
                            /* if (!user.email_verified) {
                                return sendNotification();
                            } */
                            return done(null, user);
                        } else {
                            return done(null, false, {
                                message: 'Password incorrect, check your password and try again!'
                            });
                        }
                    });
                })
                .catch(err => console.log(err));

        })
    );

    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    passport.deserializeUser((id, done) => {
        User.findById(id, (err, user) => {
            if (typeof user !== 'undefined' && user.username === 'Sadja') {
                Menu.find({})
                    .then(async(menu) => {
                        ContractDraft.findOne({})
                            .then((co_draft) => {
                                ProposalDraft.findOne({})
                                    .then((pro_draft) => {
                                        contractTemp.find({}).sort([
                                            ['date', -1]
                                        ]).then(contracts => {
                                            proposalTemp.find({}).sort([
                                                ['date', -1]
                                            ]).then(proposals => {
                                                done(err, [user, menu, co_draft, pro_draft, contracts, proposals]);

                                            }).catch((err) => console.log(err));

                                        }).catch((err) => console.log(err));


                                    }).catch((err) => console.log(err));

                            }).catch((err) => console.log(err));



                    }).catch((err) => console.log(err));
            } else {
                done(err, user);
            }
        });
    });


};