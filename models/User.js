const mongoose = require("mongoose"),
    shortCode = require("shortid"),
    bcrypt = require("bcryptjs"),
    RandExp = require('randexp');
randexp = new RandExp(/\d\d\d\d\d/);
randexp.defaultRange.add(32, new Date());
const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    username: {
        type: String,
        default: "null"
    },
    email: {
        type: String,
        required: true
    },
    contact: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    address2: {
        type: String,
        default: null
    },
    country: {
        type: String,
        required: true
    },
    region: {
        type: String,
        default: null
    },
    city: {
        type: String,
        required: true
    },
    profile_picture: {
        type: String,
        default: "./assets/more/dash/profile/user.svg"
    },
    email_verified: {
        type: Boolean,
        default: false
    },
    social: {
        type: Object,
        default: null
    },
    user_id: {
        type: String,
        default: "null"
    },
    secret_id: { //this is the referrer code
        type: String,
        default: null
    },
    permission: {
        type: Number,
        default: 0
    },

    date: {
        type: Date,
        default: Date.now
    }
});
mongoose.set('useFindAndModify', false);
let User = mongoose.model("User", UserSchema);
User.find({}, (err, results) => {
    if (err) throw err;
    if (results.length) {
        return
    } else {
        let data = {
            username: "Sadja",
            name: "Sadja Web Solutions",
            contact: "+1 923 435 4634",
            address: "Uganda/Kampala",
            country: "Uganda",
            city: "Kampala",
            email: "info@sadjawebtools.com",
            password: require("../config/keys").autoPass,
            permission: 4,
            email_verified: true
        };
        let p = new User(data);

        // Hash password
        bcrypt.genSalt(10, (err, salt) => {
            if (err) throw err;
            bcrypt.hash(p.password, salt, (err, hash) => {
                if (err) throw err;
                // Assign password to hashed
                p.password = hash;
                // Finally save new user to DB
                p.save() //Finally save
                    .then(user => { })
                    .catch(err => console.log(err));

            });
        });

    }
});
module.exports = User;