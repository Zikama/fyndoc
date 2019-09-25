const mongoose = require("mongoose"),
    RandExp = require('randexp');
randexp = new RandExp(/\d\d\d\d\d/);
randexp.defaultRange.add(32, new Date());
const proposal_template = new mongoose.Schema({
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
let proposal_template_ = mongoose.model("proposalTemplate", proposal_template);

module.exports = proposal_template_;