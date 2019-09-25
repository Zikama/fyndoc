

const express = require("express"),
    router = express.Router(), storage = require("../config/multer-storage"),
    {
        ensureAuthenticated
    } = require("../config/auth"),
    multer = require('multer'),
    path = require("path"),
    upload = multer({ storage: storage("./assets/uploads", null, multer, path) }).single("templateFile");

// let __makeDir = require("../config/__makeDir");
// __makeDir("Directory", "/Which-doesnt-exists")
//     .then(dir => console.log(dir))
//     .catch((err) => console.log(err))

// Send A Contract
let sendContract = require("./send/contract");
sendContract(router, ensureAuthenticated, upload);

// Send A proposal
let sendProposal = require("./send/proposal");
sendProposal(router, ensureAuthenticated, upload);

module.exports = router;