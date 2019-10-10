const express = require("express"),
    passport = require("passport"),
    router = express.Router(),
    {
        ensureAuthenticated
    } = require("../config/auth"),
    // Get the converted clients model
    converted_client = require("../models/converted_clients"),
    // Get request for change
    request_change = require("../models/request_changes"),

    // Get the proposal model
    proposal = require("../models/proposal"),
    // proposal_draft for saving auto drafts
    proposal_draft = require("../models/proposal_draft"),

    // Get the contract model
    contract = require("../models/contract"),
    // contract_draft for saving auto drafts
    contract_draft = require("../models/contract_draft"),
    // Notification model
    Notify = require("../models/notifications"),
    // Nodemailer for sending email
    nodemailer = require("nodemailer"),
    keys = require("../config/keys"),
    shortCode = require("shortid"),
    RandExp = require('randexp');
randexp = new RandExp(/\d\d\d\d\d/);
randexp.defaultRange.add(32, new Date()),
    mail = require("../mail");

const sendNotificationViaEmail = (messageTemp, Subject, to, from, attach, context) => {
    // We can also send another email as a reminder
    const art_mail = new mail(nodemailer, keys.user, keys.pass); //Authenticate SMTP
    // Send an email
    const message = messageTemp;
    return new Promise((resolv, rej) => {
        art_mail.send(Subject, message, to, from, attach, context)
            .then(sent => resolv(sent)).catch(err => rej(err));

    })
};
// JSON parse
function pars(e) {
    return JSON.parse(e)
}
// JSON stringify
function fy(e) {
    return JSON.stringify(e)
}
var options = {
    // Return the document after updates are applied
    new: true,
    // Create a document if one isn't found. Required
    // for `setDefaultsOnInsert`
    upsert: true,
    setDefaultsOnInsert: true
};

// The initials times the contract been visisted, default is 0
let times = 0,
    // Global vars for WS
    _ws, request, websocket, norm_size, history, clients, clientsize;
// Test WS
web_socket.Server((ws, req, Websocket, normSize, HISTORY, CLIENS, clienSize) => {
    _ws = ws;
    request = req;
    websocket = Websocket;
    norm_size = normSize;
    history = HISTORY;
    clients = CLIENS;
    clientsize = clienSize;

    _ws.on('message', function incoming(message) {
        message = pars(message);
        if (message.type === 'keepAlive') {
            _ws.send(fy({
                type: "keepAlive",
                data: Date.now()
            }))
        }

        if (message.type === 'test') {
            console.log(message);
        }
        if (message.type === 'visits') {
            message.times = times++;
        }

        // Save contract to draft
        if (message.type === 'draft' && message.to === 'contract') {
            contract_draft.findOneAndUpdate({ auto: "true" }, {
                    data: message.data
                })
                .then(ress => {
                    if (ress) {
                        _ws.send(fy({
                            type: "draft",
                            to: "contract",
                            data: "Saved to draft"
                        }))
                    }
                })
                .catch(err => console.log(err))
        }
        // Save contract to draft

        if (message.type === 'save' && message.to === 'contract') {

            contract_draft.findOneAndUpdate({ auto: 'false' }, {...message }).then((done) => {
                if (done) {
                    _ws.send(fy({
                        type: "save",
                        to: "contract",
                        data: "Saved"
                    }))
                }
            }).catch(err => console.log(err))
        }

        // Save proposal to draft

        if (message.type === 'draft' && message.to === 'proposal') {

            proposal_draft.findOneAndUpdate({ auto: "true" }, {
                    data: message.data
                })
                .then(ress => {
                    if (ress) {
                        _ws.send(fy({
                            type: "draft",
                            to: "proposal",
                            data: "Saved to draft"
                        }))
                    }
                })
                .catch(err => console.log(err))
        }
        // Save proposal to draft

        if (message.type === 'save' && message.to === 'proposal') {
            proposal_draft.findOneAndUpdate({ auto: 'false' }, {...message })
                .then((done) => {
                    if (done) {
                        _ws.send(fy({
                            type: "save",
                            to: "proposal",
                            data: "Saved"
                        }))
                    }

                }).catch(err => console.log(err));
        }

        // Send new Proposal
        let sendProposal = require('./proposals/send');
        new sendProposal(_ws, req, message, proposal_draft, proposal, Notify, randexp, shortCode, sendNotificationViaEmail);

        // Send Contract
        let sendContract = require('./contracts/send');
        new sendContract(_ws, req, message, contract_draft, contract, Notify, randexp, shortCode, sendNotificationViaEmail);
    });
});

// Get the real path to the root
// This helps to go to statics on front-end with easy
// Expample [path = '/this/is/a/pth/df/fdf/dsd/fdf/fdf] = hard to read and replacing it with ../../etc is hard
// So better path the rootPath to pathToTheRoot so we can get the ../../etc for front-end
function pathToTheRoot(params) {
    let rootPath = params,
        rPath = [];
    rootPath = rootPath.split("");
    for (let rootPath_ of rootPath) {
        if (rootPath_ === "/") { // make sure the rootPath_ contains have the [/]
            rPath.push(".." + rootPath_) // append the ..[dots] to each [/]
        }
    };
    return rPath.join(""); ///return the real path [now this is like ../../etc]
}

// Capitalize the string. This works The way css [text-transform : capitalize] works
function Capitalize(name, sepa) {
    sepa = sepa || " ";

    name = name.split(sepa);
    let currier = [];
    for (let _name of name) {
        let _name_ = _name.toUpperCase().slice(0, 1);

        currier.push(_name_ + _name.slice(1))
    }
    return currier.join(" ")
}
// Welcome Parameters
const IndexPR = {
    who: "admin",
    title: { true: true, name: "Admin Manager" },
    original_css: true,
    header: `CONTRACT AGREEMENT BETWEEN: SADJA WEB SOLUTIONS - ANOTHER COMPANY`
};

router.get("/", ensureAuthenticated, (req, res) => res.render("index", {
    menu: (() => {
        if (typeof req.user != "undefined" && typeof req.user == 'object' && req.user.length) {
            return req.user[1]; // Menues from database
        }
    })(),
    contractDraft: (() => {
        if (typeof req.user != "undefined" && typeof req.user == 'object' && req.user.length) {

            return req.user[2]; // Proposal-draft from database

        }
    })(),
    proposalDraft: (() => {
        if (typeof req.user != "undefined" && typeof req.user == 'object' && req.user.length) {
            return req.user[3]; // Proposal-draft from database
        }
    })(),
    contractTemplate: (() => {
        if (typeof req.user != "undefined" && typeof req.user == 'object' && req.user.length) {

            return req.user[4][0]; // Proposal-draft from database

        }
    })(),
    proposalTemplate: (() => {
        if (typeof req.user != "undefined" && typeof req.user == 'object' && req.user.length) {

            return req.user[5][0]; // Proposal-draft from database
        }
    })(),
    pathToTheRoot: (() => {

        IndexPR.pathToTheRoot = pathToTheRoot(req._parsedOriginalUrl.path);
        return IndexPR.pathToTheRoot;

    })(),
    ...IndexPR
}));

// Agree or acceptance on the contract
let AgreeContract = require('./contracts/agree');
new AgreeContract(router, contract, Notify, converted_client, sendNotificationViaEmail)

// Request changes
let requestForChange = require('./contracts/change');
new requestForChange(router, Notify, sendNotificationViaEmail);

// Render the dynamic contract link or route
let readNewContract = require('./contracts/render');
new readNewContract(router, contract, Capitalize, pathToTheRoot);

// Render the dynamic proposal link or route
let readNewProposal = require('./proposals/render');
new readNewProposal(router, proposal, Capitalize, pathToTheRoot);

// approve on the proposal _ 
let proposalApproval = require('./proposals/approve');
new proposalApproval(router, proposal, Notify, converted_client, sendNotificationViaEmail);

// Login listener

// Login Parameters
const loginPR = {
    who: "login",
    title: { true: true, name: "Welcome to Sadja | Login" },
    original_css: true,
    header: `Welcome - Login`
};
router.get("/login", (req, res) => res.render("login", {
    pathToTheRoot: (() => {
        loginPR.pathToTheRoot = pathToTheRoot(req._parsedOriginalUrl.path);
        return loginPR.pathToTheRoot;
    })(),
    ...loginPR
}));

// Keep the connection live
router.get("/keeplive", (req, res) => {
    res.json({ res: Date.now() + 200000000 });
});
router.post("/keeplive", (req, res) => {
    res.json({ res: Date.now() + 200000000 });
});

// Login handler
function loginToDB() {

    router.post("/login", (req, res, next) => {
        passport.authenticate('local', {
            successRedirect: `../../`, // redirect the user/admin to the home page
            failureRedirect: './login', // redirect the user/admin to the login page
            failureFlash: true // flash a message to the user/admin on the failure 
                /* this helps them know what something went wrong
                 */
        })(req, res, next);
    });
}
loginToDB();



module.exports = router;