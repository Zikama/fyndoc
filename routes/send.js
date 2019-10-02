const express = require("express"),
    router = express.Router(),
    storage = require("../config/multer-storage"),
    {
        ensureAuthenticated
    } = require("../config/auth"),
    multer = require('multer'),
    path = require("path"),
    upload = multer({ storage: storage("./assets/uploads", null, multer, path) }).single("templateFile");


// Send A Contract
let sendContract = require("./send/contract");
sendContract(router, ensureAuthenticated, upload);

// Send A proposal
let sendProposal = require("./send/proposal");
sendProposal(router, ensureAuthenticated, upload);

module.exports = router;