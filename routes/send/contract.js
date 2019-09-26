sendContract = (router, ensureAuthenticated, upload, ) => router.post("/contract", ensureAuthenticated, (req, res) => {

    upload(req, res, err => {
        let // The cobtract Model
            contract = require("../../models/contract"),
            body = req.body, // Body data
            nodemailer = require("nodemailer"),
            keys = require("../../config/keys"),

            mail = require("../../mail");

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
                                        if (done) {
                                            done.link = `${results.shortCode}/${results.documentID}/${results.company.split(" ").join("_").toLowerCase()}`; // Assign the link

                                            done.contract = `${results.from.replace('LTD', '')} - ${results.company} `; // Assign the people in the contract

                                            //#############done#################


                                            sendNotificationViaEmail('index', "test1", done.email, 'saphira@sadjawebtools.com', [{
                                                    filename: 'contract-agreement.png',
                                                    path: './views/templates/output.png',
                                                    cid: 'output.png',
                                                    contentType: 'image/png'
                                                }], {
                                                    name: `${done.message}`,
                                                    title: `Hi ${done.person.split(" ")[0]},`,
                                                    regards: `Kind regards: Nemie`,
                                                    url: `${req['header']('origin') + '/' + done.link}`
                                                })
                                                .then(sent => {

                                                    if (sent && sent.match(/accepted/)) {
                                                        // We can now send an email 
                                                        // Redirect the user 
                                                        req.flash("art_p_success_msg", `Contract sent successfully to ${done.email}`);
                                                        res.redirect("../..")
                                                    }
                                                }).catch(err => {
                                                    console.log(err);
                                                    // An error occured
                                                    // Redirect the user 
                                                    req.flash("art_p_error_msg", `There was an error sending the Contractto ${done.email}, Try again in a while.`);
                                                    res.redirect("../..");
                                                });
                                        }
                                    })
                                    .catch((err) => {
                                        console.log(err); // Error updating 
                                    })
                            })
                            .catch((err) => {
                                console.log(err); // Error Saving contract 
                            })
                    }
                })
                .catch((err) => {
                    if (err) throw err // Error inserting the once use template 
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
                            if (done) {

                                done.link = `${results.shortCode}/${results.documentID}/${results.company.split(" ").join("_").toLowerCase()}`; // Assign the link

                                done.contract = `${results.from.replace('LTD', '')} - ${results.company} `; // Assign the people in the contract

                                //#############done --#################"

                                sendNotificationViaEmail('index', "test1", done.email, 'saphira@sadjawebtools.com', [{
                                        filename: 'contract-agreement.png',
                                        path: './views/templates/output.png',
                                        cid: 'output.png',
                                        contentType: 'image/png'
                                    }], {
                                        name: `${done.message}`,
                                        title: `Hi ${done.person.split(" ")[0]},`,
                                        regards: `Kind regards: Nemie`,
                                        url: `${req['header']('origin') + '/' + done.link}`
                                    })
                                    .then(sent => {
                                        if (sent && sent.match(/accepted/)) {
                                            // We can now send an email 
                                            // Redirect the user 
                                            req.flash("art_p_success_msg", `Contract sent successfully to ${done.email}`);
                                            res.redirect("../..")
                                        }
                                    }).catch(err => {
                                        console.log(err);
                                        // An error occured
                                        // Redirect the user 
                                        req.flash("art_p_error_msg", `There was an error sending the Contractto ${done.email}, Try again in a while.`);
                                        res.redirect("../..");
                                    });
                            }
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