const mongoose = require("mongoose"),
    RandExp = require('randexp');
randexp = new RandExp(/\d\d\d\d\d/);
randexp.defaultRange.add(32, new Date());
const _onceTemp = new mongoose.Schema({
    documentID: {
        type: Number,
        default: randexp.gen(new Date())
    },
    path: {
        type: String,
        required: true
    },
    destination: {
        type: String,
        default: ""
    },
    filename: {
        type: String,
        default: ""
    },
    originalname: {
        type: String,
        default: ""
    },
    mimetype: {
        type: String,
        default: ""
    },
    status: {
        type: String,
        default: "sent"
    },
    date: {
        type: Date,
        default: Date.now
    }
});
mongoose.set('useFindAndModify', false);
let onceTemp = mongoose.model("onceTemplate", _onceTemp);

module.exports = onceTemp;