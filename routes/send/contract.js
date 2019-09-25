
sendContract = (router, ensureAuthenticated, upload, ) => router.post("/contract", ensureAuthenticated, (req, res) => {

    upload(req, res, err => {
        let  // The cobtract Model
            contract = require("../../models/contract"),
            body = req.body;// Body data

        if (err) throw err;
        if (req.file && body.template === "Do Not use Tamplate") {
            let once_temp = require("../../models/once_template");
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
                        // Saved to DB
                        data = {
                            documentID: results.documentID,
                            company: body.company,
                            person: body.person,
                            email: body.email,
                            message: body.msg,
                            more_details: results
                        };
                        let newContract = new contract(data);
                        newContract.save().then(results => {
                            // Update lionk and contract agreement
                            contract.findOneAndUpdate({ _id: results._id }, {
                                link: `${results.shortCode}/${results.documentID}/${results.company.split(" ").join("_").toLowerCase()}`,
                                contract: `${results.from.replace('LTD', '')} - ${results.company} `
                            }).then((done) => {
                                // Updated
                                console.log("#############done#################");
                                // We can now send an email 
                                // Redirect the user 
                                req.flash("art_p_success_msg", `Contract sent successfully to ${done.email}`);
                                res.redirect("../..")
                            })
                                .catch((err) => {
                                    console.log(err);// Error updating 
                                })
                        })
                            .catch((err) => {
                                console.log(err);// Error Saving contract 
                            })
                    }
                })
                .catch((err) => {
                    if (err) throw err// Error inserting the once use template 
                })
        }
        // Save with the default contract template
        else {
            data = {
                company: body.company,
                person: body.person,
                email: body.email,
                message: body.msg,
            };
            // Initialize a new pending contract
            let newContract = new contract(data);
            newContract.save().then(results => {
                // Update link and contract agreement
                contract.findOneAndUpdate({ _id: results._id }, {
                    link: `${results.shortCode}/${results.documentID}/${results.company.split(" ").join("_").toLowerCase()}`,
                    contract: `${results.from.replace('LTD', '')} - ${results.company} `
                }).then((done) => {
                    // Updated
                    console.log("#############done --#################");

                    // We can now send an email 
                    // Redirect the user 
                    req.flash("art_p_success_msg", `Contract sent successfully to ${done.email}`);
                    res.redirect("../..")
                })
                    .catch((err) => {
                        console.log(err);
                    })
            })
                .catch((err) => {
                    console.log(err);
                })

        }


    })

});

module.exports = sendContract