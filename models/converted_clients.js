const mongoose = require("mongoose"),
    shortCode = require("shortid"),
    bcrypt = require("bcryptjs"),
    RandExp = require('randexp');
randexp = new RandExp(/\d\d\d\d\d/);
randexp.defaultRange.add(32, new Date());
const Converted_clientSchema = new mongoose.Schema({
    names: {
        type: String,
        required: true
    },
    id: {
        type: String,
        required: true
    },
    date_of_birth: {
        type: Date,
        default: Date.now
    },
    email: {
        type: String,
        required: true

    },
    position: {
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
let Converted_client = mongoose.model("Converted_client", Converted_clientSchema);

module.exports = Converted_client;