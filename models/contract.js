const mongoose = require("mongoose"),
    shortCode = require("shortid"),
    RandExp = require('randexp');
randexp = new RandExp(/\d\d\d\d\d/);
randexp.defaultRange.add(32, new Date()), Schema = mongoose.Schema;
const contractSchema = new Schema({
    from: {
        type: String,
        default: "Sadja Web Solutions LTD"
    },
    shortCode: {
        type: String,
        default: shortCode.worker(8).generate()
    },
    documentID: {
        type: String,
        default: randexp.gen(new Date())
    },
    company: {
        type: String,
        required: true
    },
    person: {
        type: String, required: true,
    },
    email: {
        type: String, required: true,
    },
    message: {
        type: String,
        default: ""
    },
    ref: {
        type: String,
        default: ``
    },
    contract: {
        type: String,
        default: ``
    },
    contract_status: {
        type: String,
        default: "not-signed"
    },
    link: {
        type: String,
        default: ""
    },
    status: {
        type: String,
        default: "sent"
    },
    signed_date: {
        type: Date,
        default: null
    },
    view_date: {
        type: Date,
        default: null
    },
    more_details: {
        type: Object,
        default: {
            path: `assets\\uploads\\contracts\\sadja-contract.pdf`
        }
    },
    date: {
        type: Date,
        default: Date.now
    }
});
mongoose.set('useFindAndModify', false);

let _contract = mongoose.model("contract", contractSchema);

module.exports = _contract;