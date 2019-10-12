class proposalApproval {
    constructor(router, proposal, Notify, converted_client, sendNotificationViaEmail) {
        router.post("/proposal/approve", (req, res) => {
            let data = { names: req.body.full_name, id: '00000', date_of_birth: req.body.date_of_birth, email: req.body.email, position: req.body.position, ref: req.body.ref, more_details: { contract: req.body.more_details, link: req.body.link, company: req.body.company } };

            let newConvertedClent = new converted_client(data);
            newConvertedClent.save()
                .then((saved) => {
                    if (saved) {
                        // Visible date
                        let visibleDate = new Date().setDate(saved.date.getDate() + 30);

                        // Update the proposal status and apply visible date for it
                        proposal.findOneAndUpdate({ ref: saved.ref }, {
                                status: 'approved',
                                proposal_status: "approved",
                                approved_date: saved.date,
                                'more_details.visible_until': new Date(visibleDate)
                            }, { new: true })
                            .then((done) => {
                                // Notify the main sadja web solutions' email
                                sendNotificationViaEmail('index', "New Proposal Approved by: " + saved.names.split(" ")[0], 'zikama.sadja@gmail.com', 'saphira@sadjawebtools.com', [{
                                        /*  filename: 'contract-agreement.png',
                                         path: './views/templates/output.png',
                                         cid: 'output.png',
                                         contentType: 'image/png' */
                                    }], {
                                        name: `The Proposal ID is : ${saved.ref}`,
                                        title: `${saved.names}, has successfully Approved the Proposal`,
                                        regards: `Sadja WebSolutions LTD`,
                                        url: `${req['header']('origin') + '/' + saved.more_details.link}`,
                                        _view: 'View Proposal'
                                    })
                                    .then(sent => {
                                        if (sent && sent.match(/accepted/)) {
                                            // Mail sent

                                            // We can send an email to the client
                                            sendNotificationViaEmail('index', "Proposal Successfully approved ", saved.email, 'saphira@sadjawebtools.com', [{
                                                    /* filename: 'contract-agreement.png',
                                                    path: './views/templates/output.png',
                                                    cid: 'output.png',
                                                    contentType: 'image/png' */
                                                }], {
                                                    name: `We look forward on contacting you further on the same.`,
                                                    title: `Hello ${saved.names.split(" ")[0]}, thank you for accepting our Proposal`,
                                                    regards: `Kind regards: Sadja WebSolutions support team`,
                                                    url: `${req['header']('origin') + '/' + saved.more_details.link}`,
                                                    _view: 'View Proposal',
                                                    _no_hands: 'no display'
                                                })
                                                .then(sent => {
                                                    // Mail sent
                                                    let newNotify = new Notify({
                                                        title: 'New Proposal Approved',
                                                        message: `${saved.names} from ${saved.more_details.company} Company with the position of the ${saved.position}, has successfully approved the proposal of the ID : ${saved.ref}`,
                                                        ref: `${saved.ref}`,
                                                        link: "/converted/" + saved.ref,
                                                        _no_hands: 'no display'
                                                    })
                                                    newNotify.save((err, resu) => {
                                                        if (err) {
                                                            console.log(err);
                                                        }
                                                        resu.status = "approved"; //___
                                                        // Send live notification
                                                        if (typeof _ws !== 'undefined') {
                                                            _ws.send(fy(resu));
                                                        }
                                                    });

                                                }).catch((err) => console.log(err))
                                        }
                                    }).catch((err) => console.log(err));

                            }).catch((err) => console.log(err))
                    }
                });
            res.redirect("../" + data.more_details.link);
        });
    }
}

module.exports = proposalApproval