class Changes {
    constructor(_ws, router, Notify, sendNotificationViaEmail) {

        router.post("/request_change", (req, res) => {

            let data = { names: req.body.full_name, changes: req.body.changes, email: req.body.email, ref: req.body.ref, more_details: { contract: req.body.more_details, link: req.body.link, company: req.body.company } };

            let newRequest_change = new request_change(data);
            newRequest_change.save()
                .then((saved) => {
                    if (saved) {
                        // We can send an email to the client
                        sendNotificationViaEmail('index', "Request sent", saved.email, 'saphira@sadjawebtools.com', [{
                                filename: 'contract-agreement.png',
                                path: './views/templates/output.png',
                                cid: 'output.png',
                                contentType: 'image/png'
                            }], {
                                name: `You've successfully sent a request for change on the contract with Reference Number : ${saved.ref}`,
                                title: `Hello ${saved.names.split(" ")[0]}, Sadja WebSolutions support team will review your request and get back to you`,
                                regards: `Thank you.`,
                                _no: 'no display',
                                _no_hands: 'no display',
                                url: `#` /* ${req['header']('origin') + '/' + saved.more_details.link} */
                            })
                            .then(sent => {
                                // Mail sent
                            }).catch((err) => console.log(err))
                            // Notify the main sadja web solutions' email
                        sendNotificationViaEmail('index', "New Change request by " + saved.names.split(" ")[0], 'zikama.sadja@gmail.com', saved.email, [{
                                filename: 'contract-agreement.png',
                                path: './views/templates/output.png',
                                cid: 'output.png',
                                contentType: 'image/png'
                            }], {
                                name: `${saved.changes}`,
                                title: `${saved.names} has requested for change on contract with Proposal ID : ${saved.ref}`,
                                regards: `Sadja WebSolutions LTD`,
                                url: `${req['header']('origin') + '/' + saved.more_details.link}`
                            })
                            .then(sent => {
                                // Mail sent
                            }).catch((err) => console.log(err))


                        let newNotify = new Notify({
                            title: 'New Change request',
                            message: `${saved.changes}`,
                            ref: `${saved.ref}`,
                            link: "/changes/" + saved.ref
                        })
                        newNotify.save((err, resu) => {
                            if (err) {
                                console.log(err);
                            }
                            resu.status = "request"; //___
                            // Send live notification
                            _ws.send(fy(resu))
                        })
                    }
                }).catch((err) => console.log(err))

            req.flash("art_p_success_msg", `You've successfully sent a request for change, our team will shortly contact you`)
            res.redirect(data.more_details.link);

        });
    }
}
module.exports = Changes