const express = require("express"),
    passport = require("passport"),
    router = express.Router(),
    {
        ensureAuthenticated
    } = require("../config/auth"),
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

function pars(e) {
    return JSON.parse(e)
}

function fy(e) {
    return JSON.stringify(e)
}
let times = 0;
// Test WS
web_socket.Server((ws, req, Websocket, normSize, HISTORY, CLIENS, clienSize) => {


    ws.on('message', function incoming(message) {
        message = pars(message);


        if (message.type === 'keepAlive') {
            ws.send(fy({
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
                        ws.send(fy({
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
                    ws.send(fy({
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
                        ws.send(fy({
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
                        ws.send(fy({
                            type: "save",
                            to: "proposal",
                            data: "Saved"
                        }))
                    }

                }).catch(err => console.log(err));
        }

        // Send proposal
        if (message.type === 'send' && message.to === 'proposal') {

            proposal_draft.findOne({ auto: "false" }).sort([
                ['date', -1]
            ]).then(proposals => {
                if (proposals && proposals.data !== "") {
                    // proposal

                    message.proposal = proposals.data
                    let data = {
                        company: message.data.company,
                        person: message.data.person,
                        email: message.data.email,
                        message: message.data.msg,
                        more_details: message,
                    };
                    let newProposal = new proposal(data);
                    newProposal.save()
                        .then((results) => {
                            if (results) {
                                // create a link
                                proposal.findOneAndUpdate({ _id: results._id }, {
                                        link: `${results.ref.replace("#", '')}/${results.shortCode}/${results.company.split(" ").join("_").toLowerCase()}`,
                                        proposal: `${results.from.replace('LTD', '')} - ${results.company} `
                                    })
                                    .then((ress) => {
                                        proposal.findOne({ _id: results._id }).then((done) => {

                                            //#############done#################
                                            // We can send an email
                                            sendNotificationViaEmail('index', "test1", done.email, 'saphira@sadjawebtools.com', [{
                                                    filename: 'contract-agreement.png',
                                                    path: './views/templates/output.png',
                                                    cid: 'output.png',
                                                    contentType: 'image/png'
                                                }], {
                                                    name: `${done.message}`,
                                                    title: `Hi ${done.person.split(" ")[0]},`,
                                                    regards: `Kind regards: Nemie`,
                                                    url: `${req.headers['origin'] + '/' + done.link}`
                                                })
                                                .then(sent => {
                                                    if (sent && sent.match(/accepted/)) {
                                                        // We can now send an email 
                                                        // Store Notification
                                                        let newNotify = new Notify({
                                                            title: 'New Proposal',
                                                            message: `You've successfully sent an new Proposal to ${done.email} with a proposal ID: #${done.ref}`,
                                                            ref: `${done._id}`,
                                                            link: "/proposals/" + done.ref
                                                        });
                                                        newNotify.save().then((_done) => {
                                                            // Notify the admin
                                                            // if() socket is open
                                                            _done.status = "successful";
                                                            ws.send(fy(_done))

                                                        })
                                                    } else {

                                                        // An error occured
                                                        // Store Notification
                                                        let newNotify = new Notify({
                                                            title: 'Failed Sending Proposal',
                                                            message: `There was a problem sending a Proposal to ${done.email} with a proposal ID: #${done.ref}, error : ${err}`,
                                                            ref: `${done._id}`,
                                                            link: "/proposals/failure" + done.ref
                                                        });
                                                        newNotify.save().then((_done) => {
                                                            // Notify the admin
                                                            // if() socket is open
                                                            _done.status = "failure";
                                                            ws.send(fy(_done))

                                                        }).catch((err) => {
                                                            console.log(err);
                                                        })
                                                    }

                                                }).catch(err => {
                                                    console.log(err);

                                                    // An error occured
                                                    // Store Notification
                                                    let newNotify = new Notify({
                                                        title: 'Failed Sending Proposal',
                                                        message: `There was a problem sending a Proposal to ${done.email} with a proposal ID: #${done.ref}, error : ${err}`,
                                                        ref: `${done._id}`,
                                                        link: "/proposals/failure" + done.ref
                                                    });
                                                    newNotify.save().then((_done) => {
                                                        // Notify the admin
                                                        // if() socket is open
                                                        _done.status = "failure";
                                                        ws.send(fy(_done))

                                                    }).catch((err) => console.log(err))
                                                });

                                        }).catch((err) => console.log(err))

                                    }).catch((err) => console.log(err))

                            }

                        })
                        .catch((err) => console.log(err))

                } else {
                    console.log("Empty proposal Error");
                }

            }).catch((err) => {
                console.log(err);

            })
            return 0

        }

        // Send Contract
        if (message.type === 'send' && message.to === 'contract') {

            contract_draft.findOne({ auto: "false" }).sort([
                ['date', -1]
            ]).then(contracts => {
                if (contracts && contracts.data !== "") {
                    message.contract = contracts.data
                    let data = {
                        documentID: message.data.proposal_id,
                        ref: message.data.proposal_id,
                        company: message.data.company,
                        person: message.data.person,
                        email: message.data.email,
                        message: message.data.msg,
                        more_details: message,
                    };
                    let newContract = new contract(data);
                    newContract.save()
                        .then((results) => {
                            if (results) {
                                contract.findOne({ _id: results._id }).then((_results) => {
                                    // Create link
                                    contract.findByIdAndUpdate({ _id: _results._id }, {
                                        link: `${_results.shortCode}/${_results.documentID.replace("#", '')}/${_results.company.split(" ").join("_").toLowerCase()}`,
                                        contract: `${_results.from.replace('LTD', '')} - ${_results.company} `
                                    }).then((mesg) => {
                                        contract.findOne({ _id: results._id }).then((done) => {
                                            //#############done#################
                                            // We can send an email
                                            sendNotificationViaEmail('index', "test1", done.email, 'saphira@sadjawebtools.com', [{
                                                    filename: 'contract-agreement.png',
                                                    path: './views/templates/output.png',
                                                    cid: 'output.png',
                                                    contentType: 'image/png'
                                                }], {
                                                    name: `${done.message}`,
                                                    title: `Hi ${done.person.split(" ")[0]},`,
                                                    regards: `Kind regards: Nemie`,
                                                    url: `${req.headers['origin'] + '/' + done.link}`
                                                })
                                                .then(sent => {
                                                    if (sent && sent.match(/accepted/)) {
                                                        // We can now send an email 
                                                        // Store Notification
                                                        let newNotify = new Notify({
                                                            title: 'New Contract',
                                                            message: `You've successfully sent an new Contract to ${done.email} with a proposal ID: #${done.ref}`,
                                                            ref: `${done._id}`,
                                                            link: "/contracts/" + done.ref
                                                        });
                                                        newNotify.save().then((_done) => {
                                                            // Notify the admin
                                                            // if() socket is open
                                                            _done.status = "successful";
                                                            ws.send(fy(_done))

                                                        })
                                                    } else {

                                                        // An error occured
                                                        // Store Notification
                                                        let newNotify = new Notify({
                                                            title: 'Failed Sending Contract',
                                                            message: `There was a problem sending a Contract to ${done.email} with a proposal ID: #${done.ref}, error : ${err}`,
                                                            ref: `${done._id}`,
                                                            link: "/contracts/failure" + done.ref
                                                        });
                                                        newNotify.save().then((_done) => {
                                                            // Notify the admin
                                                            // if() socket is open
                                                            _done.status = "failure";
                                                            ws.send(fy(_done))

                                                        }).catch((err) => {
                                                            console.log(err);
                                                        })
                                                    }

                                                }).catch(err => {
                                                    console.log(err);

                                                    // An error occured
                                                    // Store Notification
                                                    let newNotify = new Notify({
                                                        title: 'Failed Sending Contract',
                                                        message: `There was a problem sending a Contract to ${done.email} with a proposal ID: #${done.ref}, error : ${err}`,
                                                        ref: `${done._id}`,
                                                        link: "/contracts/failure" + done.ref
                                                    });
                                                    newNotify.save().then((_done) => {
                                                        // Notify the admin
                                                        // if() socket is open
                                                        _done.status = "failure";
                                                        ws.send(fy(_done))

                                                    }).catch((err) => console.log(err))
                                                });


                                        }).catch((err) => console.log(err))
                                    }).catch((err) => console.log(err))
                                }).catch((err) => console.log(err))
                            } else {
                                console.log("Empty contracts Error");
                            }

                        }).catch((err) => console.log(err))
                }



            });
            return 0
        }

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
    title: { true: true, name: "Sadja | Contract Manager" },
    original_css: true,
    header: `CONTRACT AGREEMENT BETWEEN: SADJA WEB SOLUTIONS - ANOTHER COMPANY`
};
// Login Parameters
const loginPR = {
    who: "login",
    title: { true: true, name: "Welcome to Sadja | Login" },
    original_css: true,
    header: `Welcome - Login`
};
router.get("/", ensureAuthenticated, async(req, res) => res.render("index", {
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

router.get("/login", (req, res) => res.render("login", {
    pathToTheRoot: (() => {
        loginPR.pathToTheRoot = pathToTheRoot(req._parsedOriginalUrl.path);
        return loginPR.pathToTheRoot;
    })(),
    ...loginPR
}));

// Reader parameters
const readerPR = {
    who: "client",
    title: { true: true, name: "Sadja | Contract Manager" },
    original_css: true,
    header: `CONTRACT AGREEMENT BETWEEN: SADJA WEB SOLUTIONS - ANOTHER COMPANY`
};
let viewTimes = 0;
router.get("/:shortUrl/:documentId/:name", (req, res) => {
    let shortCode = req.params.shortUrl,
        ref = req.params.documentId,
        company = Capitalize(req.params.name, "_");

    // Double check the url params exists in our database
    contract.find({ shortCode, ref, company })
        .then((results) => {
            if (results && results.length) {

                results = results[0];
                // Update viewTimes from db
                if (results.more_details.viewTimes) {
                    viewTimes = results.more_details.viewTimes + 1;
                } else {
                    viewTimes = viewTimes + 1;
                }

                if (results.contract_status == 'not-signed') {

                    contract.findByIdAndUpdate({ _id: results._id }, {
                            view_date: Date.now(),
                            status: 'viewed',
                            "more_details.viewTimes": viewTimes
                        })
                        .then((rwa) => {
                            // Doc updated
                        })
                        .catch(err => console.log(err))

                    let user_agent = req["headers"]["user-agent"];
                    readerPR.pathToTheRoot = pathToTheRoot(req._parsedOriginalUrl.path);
                    readerPR.header = `CONTRACT AGREEMENT BETWEEN: ${results.from} - ${results.company}`;
                    readerPR.contract = results.more_details.contract;
                    res.render("reader", {
                        pathToTheRoot: (() => {
                            readerPR.pathToTheRoot = pathToTheRoot(req._parsedOriginalUrl.path);
                            return readerPR.pathToTheRoot;
                        })(),
                        ...readerPR
                    });
                }
                // For already signed contract
                else {
                    res.redirect(`${pathToTheRoot(req._parsedOriginalUrl.path)}contract/signed/${shortCode}`)
                }
            } else {
                res.redirect(`${pathToTheRoot(req._parsedOriginalUrl.path)}notfound`)
            }
        })
        .catch(err => console.log(err))
});

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
                /* this helps them know what went wrong
                 */
        })(req, res, next);
    });
}
loginToDB();



module.exports = router;