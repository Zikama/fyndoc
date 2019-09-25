
uploadProposal = (router, ensureAuthenticated, upload, ) => router.post("/proposal", ensureAuthenticated, (req, res) => {

    upload(req, res, err => {
        let  // The cobtract Model
            proposal = require("../../models/proposal_template");

        if (err) throw err;
        if (req.file) {
            let once_temp = proposal;
            let temp = req.file;
            data = {
                path: temp.path,
                destination: temp.destination,
                filename: temp.filename,
                originalname: temp.originalname,
                mimetype: temp.mimetype
            };
            let _once_temp = new once_temp(data);
            _once_temp.save()
                .then((results) => {
                    if (results) {
                        // We can now send an email 
                        // Redirect the user 
                        req.flash("art_p_success_msg", `Proposal Template Uploaded successfully`);
                        res.redirect("../..");
                    }
                }).catch((err) => {
                    console.log(err);// Error updating 
                })
        }

    })

});

module.exports = uploadProposal