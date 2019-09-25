
const express = require("express"),
    router = express.Router(), storage = require("../config/multer-storage"),
    {
        ensureAuthenticated
    } = require("../config/auth"),
    multer = require('multer'),
    path = require("path"),
    _upload = multer({ storage: storage("./assets/uploads/proposals", null, multer, path) }).single("proposal_template"),
    upload = multer({ storage: storage("./assets/uploads/contracts", null, multer, path) }).single("contract_template");

// let __makeDir = require("../config/__makeDir");
// __makeDir("Directory", "/Which-doesnt-exists")
//     .then(dir => console.log(dir))
//     .catch((err) => console.log(err))

// Send A Contract
let uploadContract = require("./upload/contract");
uploadContract(router, ensureAuthenticated, upload);

// Send A proposal
let uploadProposal = require("./upload/proposal");
uploadProposal(router, ensureAuthenticated, _upload);

module.exports = router;