const express = require("express"),
    passport = require("passport"),
    router = express.Router(),
    {
        ensureAuthenticated
    } = require("../config/auth"),
    // Get the proposal model
    proposal = require("../models/proposal"),
    // Get the contract model
    contract = require("../models/contract"),
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
sendNotificationViaEmail('index', "test1", "zikama.sadja@gmail.com", 'saphira@sadjawebtools.com', [{
        filename: 'contract-agreement.png',
        path: './views/templates/output.png',
        cid: 'output.png',
        contentType: 'image/png'
    }], {
        name: "Kindly click the button bellow to see the contract sent to you",
        title: "Hi Nehemie Zikama",
        regards: `Kind regards: Nemie`,
        url: "http://localhost:5002/21t0i0sR/79658/sadja_web_solutions"
    })
    .then(sent => console.log(sent)).catch(err => console.log(err));

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