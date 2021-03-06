const mongoose = require("mongoose"),
    shortCode = require("shortid"),
    RandExp = require('randexp');
randexp = new RandExp(/\d\d\d\d\d/);
randexp.defaultRange.add(32, Date.now()), Schema = mongoose.Schema;
const proposalSchema = new Schema({
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
        default: randexp.gen()
    },
    company: {
        type: String,
        required: true
    },
    person: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    message: {
        type: String,
        default: ""
    },
    ref: {
        type: String,
        default: randexp.gen()
    },
    proposal: {
        type: String,
        default: ``
    },
    proposal_status: {
        type: String,
        default: "not-approved"
    },
    link: {
        type: String,
        default: ""
    },
    status: {
        type: String,
        default: "sent"
    },
    approved_date: {
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
            path: `assets\\uploads\\proposals\\sadja-proposal.pdf`
        }
    },
    date: {
        type: Date,
        default: Date.now
    }
}, { strict: false });

mongoose.set('useFindAndModify', false);

let _proposal = mongoose.model("proposal", proposalSchema);

// console.log(_proposal.schema.paths.refg);

module.exports = _proposal;