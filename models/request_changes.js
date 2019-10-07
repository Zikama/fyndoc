const mongoose = require("mongoose"),
    shortCode = require("shortid"),
    bcrypt = require("bcryptjs"),
    RandExp = require('randexp');
randexp = new RandExp(/\d\d\d\d\d/);
randexp.defaultRange.add(32, new Date());
const Request_changeSchema = new mongoose.Schema({
    names: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    changes: {
        type: String,
        required: true
    },
    ref: {
        type: String,
        required: true
    },
    more_details: {
        type: Object,
        default: null
    },
    date: {
        type: Date,
        default: Date.now
    }
});
mongoose.set('useFindAndModify', false);
let Request_change = mongoose.model("Request_change", Request_changeSchema);

module.exports = Request_change;