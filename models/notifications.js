const mongoose = require("mongoose"),
    shortCode = require("shortid"),
    RandExp = require('randexp');
randexp = new RandExp(/\d\d\d\d\d/);
randexp.defaultRange.add(32, new Date()), Schema = mongoose.Schema;
const notificationSchema = new Schema({
    title: {
        type: String,
        default: ""
    },
    message: {
        type: String,
        default: ""
    },
    ref: {
        type: String,
        default: ``
    },
    link: {
        type: String,
        default: ""
    },
    more_details: {
        type: Object,
        default: {}
    },
    date: {
        type: Date,
        default: Date.now
    }
});
mongoose.set('useFindAndModify', false);

let _notification = mongoose.model("notifications", notificationSchema);

module.exports = _notification;