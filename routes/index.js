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
    contract_draft = require("../models/contract_draft");

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
            let newcontract = new contract_draft({...message });
            newcontract.save()
                .then(ress => {
                    if (ress) {
                        ws.send(fy({
                            type: "save",
                            to: "contract",
                            data: "Saved"
                        }))
                    }
                })
                .catch(err => console.log(err))
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
            let data = message.data;
            let newproposal = new proposal_draft({...message });
            newproposal.save()
                .then(ress => {
                    if (ress) {
                        ws.send(fy({
                            type: "save",
                            to: "proposal",
                            data: "Saved"
                        }))
                    }
                })
                .catch(err => console.log(err))
        }



    });
})



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
        documentID = req.params.documentId,
        company = Capitalize(req.params.name, "_");

    // Double check the url params exists in our database
    contract.find({ shortCode, documentID, company })
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
                    readerPR.contract = results.more_details.path;
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